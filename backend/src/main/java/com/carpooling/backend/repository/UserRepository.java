package com.carpooling.backend.repository;

import com.carpooling.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Counts unique drivers who have published AT LEAST ONE ride in the ride table
    @Query("SELECT COUNT(DISTINCT r.driver.id) FROM Ride r WHERE r.driver.id IS NOT NULL")
    long countDrivers();
}