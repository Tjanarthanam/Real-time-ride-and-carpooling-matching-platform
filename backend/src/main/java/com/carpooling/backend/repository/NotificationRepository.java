package com.carpooling.backend.repository;

import com.carpooling.backend.entity.Notification;
import com.carpooling.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByNotificationTimeDesc(User user);
}