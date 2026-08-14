package com.carpooling.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carpooling.backend.entity.DriverDetails;
import com.carpooling.backend.entity.User;

public interface DriverDetailsRepository
        extends JpaRepository<DriverDetails, Long> {

    Optional<DriverDetails> findByUser(User user);

}