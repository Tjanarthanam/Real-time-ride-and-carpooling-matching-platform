package com.carpooling.backend.repository;

import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    @Query("SELECT r FROM Ride r WHERE " +
           "LOWER(r.source) LIKE LOWER(CONCAT('%', TRIM(:source), '%')) AND " +
           "LOWER(r.destination) LIKE LOWER(CONCAT('%', TRIM(:destination), '%')) AND " +
           "r.travelDate = :date AND " +
           "r.availableSeats >= :seats")
    List<Ride> searchAvailableRides(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("date") LocalDate date,
            @Param("seats") Integer seats
    );

    List<Ride> findByDriver(User driver);
}