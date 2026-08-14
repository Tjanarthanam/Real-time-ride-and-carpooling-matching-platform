package com.carpooling.backend.controller;

import com.carpooling.backend.entity.User;
import com.carpooling.backend.entity.Waitlist;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.repository.WaitlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.carpooling.backend.service.EmailService;

@RestController
@RequestMapping("/api/waitlist")
@CrossOrigin(origins = "*")
public class WaitlistController {

    @Autowired
    private WaitlistRepository waitlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public static class WaitlistRequest {
        public String source;
        public String destination;
        public String travelDate;
        public String email;
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinWaitlist(@RequestBody WaitlistRequest request) {
        if (request.source == null || request.destination == null || request.travelDate == null) {
            return ResponseEntity.badRequest().body("Source, destination, and travel date are required.");
        }

        User passenger = null;
        String userEmail = request.email;

        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails userDetails) {
                passenger = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
                if (passenger != null && (userEmail == null || userEmail.trim().isEmpty())) {
                    userEmail = passenger.getEmail();
                }
            }
        } catch (Exception ignored) {}

        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Valid email address is required to join waitlist.");
        }

        Waitlist entry = new Waitlist();
        entry.setPassenger(passenger);
        entry.setPassengerEmail(userEmail.trim());
        entry.setSource(request.source.trim());
        entry.setDestination(request.destination.trim());
        entry.setTravelDate(request.travelDate.trim());
        entry.setStatus("WAITING");

        waitlistRepository.save(entry);

        // Send Immediate Acknowledgment Email to User's Email Address
        try {
            emailService.sendWaitlistConfirmationEmail(
                entry.getPassengerEmail(),
                entry.getSource(),
                entry.getDestination(),
                entry.getTravelDate()
            );
        } catch (Exception e) {
            System.err.println("Error sending waitlist acknowledgment email: " + e.getMessage());
        }

        return ResponseEntity.ok("Successfully joined ride waiting list! A confirmation email has been sent to " + userEmail + ". You will receive push notifications & email alerts as soon as a matching ride is posted.");
    }

    @GetMapping("/my")
    public ResponseEntity<List<Waitlist>> getMyWaitlists() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User passenger = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            return ResponseEntity.ok(waitlistRepository.findByPassengerOrderByCreatedAtDesc(passenger));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelWaitlist(@PathVariable Long id) {
        waitlistRepository.deleteById(id);
        return ResponseEntity.ok("Waitlist request removed.");
    }
}
