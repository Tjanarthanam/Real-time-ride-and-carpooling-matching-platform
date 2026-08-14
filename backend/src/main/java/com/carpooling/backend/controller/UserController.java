package com.carpooling.backend.controller;

import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized session"));
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload, Authentication authentication) {
        String currentEmail = (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser"))
                ? authentication.getName()
                : payload.get("email");

        if (currentEmail == null || currentEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User email is required"));
        }

        User user = userRepository.findByEmail(currentEmail.trim()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found in database"));
        }

        // Update Name
        String name = payload.get("name") != null ? payload.get("name") : payload.get("fullName");
        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
        }

        // Update Phone
        String phone = payload.get("phone") != null ? payload.get("phone") : payload.get("phoneNumber");
        if (phone != null && !phone.trim().isEmpty()) {
            user.setPhone(phone.trim());
        }

        // Update Gender
        if (payload.get("gender") != null && !payload.get("gender").trim().isEmpty()) {
            user.setGender(payload.get("gender").trim());
        }

        // Update Email in MySQL Database
        String newEmail = payload.get("email");
        if (newEmail != null && !newEmail.trim().isEmpty() && !newEmail.trim().equalsIgnoreCase(user.getEmail())) {
            newEmail = newEmail.trim();
            if (userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email " + newEmail + " is already in use by another user."));
            }
            user.setEmail(newEmail);
        }

        userRepository.save(user); // Persists all changes to MySQL
        return ResponseEntity.ok(user);
    }
}