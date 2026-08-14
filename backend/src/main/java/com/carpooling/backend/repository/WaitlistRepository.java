package com.carpooling.backend.repository;

import com.carpooling.backend.entity.User;
import com.carpooling.backend.entity.Waitlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {
    List<Waitlist> findByPassengerOrderByCreatedAtDesc(User passenger);
    List<Waitlist> findByPassengerEmailOrderByCreatedAtDesc(String passengerEmail);
    List<Waitlist> findByStatus(String status);
}
