package com.carpooling.backend.repository;

import com.carpooling.backend.entity.EmergencyAlert;
import com.carpooling.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {
    List<EmergencyAlert> findByUserOrderByCreatedAtDesc(User user);
}
