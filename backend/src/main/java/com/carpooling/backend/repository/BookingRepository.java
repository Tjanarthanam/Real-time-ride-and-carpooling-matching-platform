package com.carpooling.backend.repository;

import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPassenger(User passenger);

    List<Booking> findByRide_Driver(User driver);

    List<Booking> findByPassengerAndBookingStatus(
            User passenger,
            String bookingStatus
    );

    List<Booking> findByRide_DriverAndBookingStatus(
            User driver,
            String bookingStatus
    );

}