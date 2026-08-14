package com.carpooling.backend.controller;

import com.carpooling.backend.dto.FeedbackRequest;
import com.carpooling.backend.dto.PublicFeedbackResponse;
import com.carpooling.backend.entity.Feedback;
import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.FeedbackRepository;
import com.carpooling.backend.repository.RideRepository;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private EmailService emailService;

    private User currentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        User user = currentUser();

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());

        if (request.getRideId() != null) {
            Ride ride = rideRepository.findById(request.getRideId()).orElse(null);
            feedback.setRide(ride);
        }

        feedbackRepository.save(feedback);

        try {
            emailService.sendFeedbackAcknowledgementEmail(user.getEmail(), request.getRating(), request.getComments());
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok(Map.of("message", "Thank you for your feedback!", "feedbackId", feedback.getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Feedback>> myFeedback() {
        return ResponseEntity.ok(feedbackRepository.findByUserOrderByCreatedAtDesc(currentUser()));
    }

    // GET /api/feedback/public — no login required. Powers the testimonials
    // strip on the landing page with feedback left by both drivers and
    // passengers (rating >= 4, and only entries with a written comment).
    @GetMapping("/public")
    public ResponseEntity<List<PublicFeedbackResponse>> publicFeedback() {
        List<Feedback> topFeedback = feedbackRepository
                .findTop12ByCommentsIsNotNullAndRatingGreaterThanEqualOrderByRatingDescCreatedAtDesc(4);

        List<PublicFeedbackResponse> response = topFeedback.stream()
                .filter(f -> f.getUser() != null && f.getComments() != null && !f.getComments().isBlank())
                .map(f -> new PublicFeedbackResponse(
                        f.getId(),
                        f.getUser().getName(),
                        f.getUser().getRole(),
                        f.getRating(),
                        f.getComments(),
                        f.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(response);
    }
}
