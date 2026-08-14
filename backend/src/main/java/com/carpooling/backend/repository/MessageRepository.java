package com.carpooling.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carpooling.backend.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Chat history of a booking
    List<Message> findByBookingIdOrderByCreatedAtAsc(Long bookingId);

    // Messages sent by a user
    List<Message> findBySender_Id(Long senderId);

    // Messages received by a user
    List<Message> findByReceiver_Id(Long receiverId);

    // Latest message of a booking
    Message findTopByBookingIdOrderByCreatedAtDesc(Long bookingId);

    // Latest messages
    List<Message> findAllByOrderByCreatedAtDesc();

    // All messages where the user is sender or receiver
    List<Message> findBySender_IdOrReceiver_IdOrderByCreatedAtDesc(
            Long senderId,
            Long receiverId
    );

}