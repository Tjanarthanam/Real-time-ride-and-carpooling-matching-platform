package com.carpooling.backend.repository;

import com.carpooling.backend.entity.Feedback;
import com.carpooling.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUserOrderByCreatedAtDesc(User user);

    // Used for the public landing-page testimonials strip: only feedback
    // with an actual written comment, best-rated and most recent first.
    List<Feedback> findTop12ByCommentsIsNotNullAndRatingGreaterThanEqualOrderByRatingDescCreatedAtDesc(Integer minRating);
}
