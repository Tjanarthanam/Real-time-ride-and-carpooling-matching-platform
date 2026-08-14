package com.carpooling.backend.repository;

import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBooking(Booking booking);

    List<Payment> findByBookingPassengerId(Long passengerId);

    List<Payment> findByBooking_Passenger_Id(Long passengerId);

    List<Payment> findByBooking_Ride_Driver_Id(Long driverId);

    // Sums revenue from Payment table
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE UPPER(p.paymentStatus) IN ('SUCCESS', 'COMPLETED', 'PAID', 'CONFIRMED')")
    BigDecimal calculateTotalRevenue();
}