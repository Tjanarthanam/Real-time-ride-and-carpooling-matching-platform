package com.carpooling.backend.controller;

import com.carpooling.backend.dto.RegisterRequest;
import com.carpooling.backend.dto.VerifyOtpRequest;
import com.carpooling.backend.entity.DriverDetails;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.DriverDetailsRepository;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverDetailsRepository driverDetailsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // NOTE: response contract for /register is left exactly as it was
    // (a plain String body) so the existing sign-up UI keeps working
    // without any changes.
    @PostMapping({"/register", "/signup"})
    public String register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole().toUpperCase());
        user.setGender(request.getGender() != null && !request.getGender().isBlank() ? request.getGender() : "Male");
        user.setCreatedAt(LocalDateTime.now());
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);

        if ("DRIVER".equalsIgnoreCase(request.getRole())) {
            DriverDetails driver = new DriverDetails();
            driver.setUser(savedUser);
            driver.setLicenseNumber(request.getLicenseNumber());
            driver.setVehicleInfo(request.getVehicleInfo());
            driver.setVehicleNumber(request.getVehicleNumber());
            driver.setRating(5.0);
            driverDetailsRepository.save(driver);
        }

        // Fire-and-forget welcome / verification OTP email. Failures here never
        // block registration since the response contract above must stay intact.
        try {
            emailService.createAndSendOtp(savedUser.getEmail());
        } catch (Exception ignored) {
        }

        return "User Registered Successfully";
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @RequestParam(required = false) String email,
            @RequestBody(required = false) Map<String, String> body) {

        String targetEmail = (email != null && !email.isBlank()) ? email : (body != null ? body.get("email") : null);

        if (targetEmail == null || targetEmail.isBlank()) {
            return ResponseEntity.badRequest().body("Email parameter is required.");
        }

        String cleanedEmail = targetEmail.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanedEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(targetEmail.trim());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found with email: " + targetEmail);
        }

        emailService.createAndSendOtp(userOpt.get().getEmail());
        return ResponseEntity.ok(Map.of("message", "A new OTP code has been sent to " + targetEmail));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String cleanedEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanedEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getEmail().trim());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User account not found.");
        }

        boolean isValid = emailService.verifyOtp(userOpt.get().getEmail(), request.getOtpCode()) ||
                emailService.verifyOtp(request.getEmail().trim(), request.getOtpCode());

        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP code.");
        }

        User user = userOpt.get();
        user.setEmailVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully!");
    }

    public static class ForgotPasswordRequest {
        public String email;
    }

    public static class ResetPasswordRequest {
        public String email;
        public String otpCode;
        public String newPassword;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        if (request.email == null || request.email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email address is required.");
        }

        String cleanedEmail = request.email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanedEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.email.trim());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No account registered with email: " + request.email);
        }

        User user = userOpt.get();
        emailService.createAndSendResetPasswordOtp(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "message", "A 6-digit password reset OTP code has been sent to " + user.getEmail()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.email == null || request.otpCode == null || request.newPassword == null) {
            return ResponseEntity.badRequest().body("Email, OTP code, and new password are required.");
        }

        String cleanedEmail = request.email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanedEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.email.trim());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User account not found.");
        }

        User user = userOpt.get();
        boolean isValid = emailService.verifyOtp(user.getEmail(), request.otpCode) ||
                emailService.verifyOtp(request.email.trim(), request.otpCode);

        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP code.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword.trim()));
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully! You can now sign in with your new password.");
    }
}