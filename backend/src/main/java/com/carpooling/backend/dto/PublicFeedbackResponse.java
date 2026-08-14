package com.carpooling.backend.dto;

import java.time.LocalDateTime;

// Safe, public-facing view of a Feedback row (no email/password/user id) —
// used to show testimonials on the landing page without requiring login.
public class PublicFeedbackResponse {
    private Long id;
    private String reviewerName;
    private String role; // "DRIVER" or "PASSENGER"
    private Integer rating;
    private String comments;
    private LocalDateTime createdAt;

    public PublicFeedbackResponse(Long id, String reviewerName, String role, Integer rating, String comments, LocalDateTime createdAt) {
        this.id = id;
        this.reviewerName = reviewerName;
        this.role = role;
        this.rating = rating;
        this.comments = comments;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getReviewerName() { return reviewerName; }
    public String getRole() { return role; }
    public Integer getRating() { return rating; }
    public String getComments() { return comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
