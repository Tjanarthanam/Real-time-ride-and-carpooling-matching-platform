package com.carpooling.backend.service;

import com.carpooling.backend.dto.AdminStatsResponse;
import com.carpooling.backend.dto.AdminUserResponse;
import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.entity.Payment;
import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.BookingRepository;
import com.carpooling.backend.repository.PaymentRepository;
import com.carpooling.backend.repository.RideRepository;
import com.carpooling.backend.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public AdminStatsResponse getSystemStats() {
        long totalUsers = userRepository.count();
        long publishedRides = rideRepository.count();

        // 1. ACTIVE DRIVERS: Only count distinct drivers who have published at least one ride
        long activeDrivers = 0;
        try {
            List<Ride> allRides = rideRepository.findAll();
            activeDrivers = allRides.stream()
                    .filter(r -> r.getDriver() != null)
                    .map(r -> r.getDriver().getId())
                    .distinct()
                    .count();
        } catch (Exception e) {
            activeDrivers = 0;
        }

        // 2. TOTAL BOOKINGS: Only count bookings where the driver has accepted/confirmed them
        long totalBookings = 0;
        try {
            List<Booking> allBookings = bookingRepository.findAll();
            totalBookings = allBookings.stream()
                    .filter(b -> {
                        String status = b.getBookingStatus();
                        if (status == null) return false;
                        String upper = status.trim().toUpperCase();
                        return upper.equals("CONFIRMED") || upper.equals("ACCEPTED") || upper.equals("COMPLETED") || upper.equals("PAID");
                    })
                    .count();
        } catch (Exception e) {
            totalBookings = 0;
        }

        // 3. PLATFORM REVENUE: Calculate from confirmed/successful payments or accepted bookings * fare
        double totalRevenueDouble = 0.0;
        try {
            List<Payment> payments = paymentRepository.findAll();
            for (Payment p : payments) {
                if (p.getAmount() != null) {
                    totalRevenueDouble += p.getAmount().doubleValue();
                }
            }

            // Fallback: Calculate from confirmed/accepted bookings * fare if payments table is empty
            if (totalRevenueDouble == 0.0) {
                List<Booking> bookings = bookingRepository.findAll();
                for (Booking b : bookings) {
                    String status = b.getBookingStatus();
                    if (status != null) {
                        String upper = status.trim().toUpperCase();
                        if (upper.equals("CONFIRMED") || upper.equals("ACCEPTED") || upper.equals("COMPLETED") || upper.equals("PAID")) {
                            if (b.getRide() != null && b.getRide().getFare() != null) {
                                double fare = b.getRide().getFare().doubleValue();
                                int seats = b.getSeatsBooked() != null ? b.getSeatsBooked() : 1;
                                totalRevenueDouble += (fare * seats);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            totalRevenueDouble = 0.0;
        }

        return new AdminStatsResponse(totalUsers, activeDrivers, publishedRides, totalBookings, totalRevenueDouble);
    }

    @Override
    public List<AdminUserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt()
        )).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();

        try {
            entityManager.createNativeQuery(
                "DELETE FROM payment WHERE booking_id IN (" +
                "  SELECT id FROM booking WHERE passenger_id = :id OR ride_id IN (" +
                "    SELECT id FROM ride WHERE driver_id = :id" +
                "  )" +
                ")"
            ).setParameter("id", userId).executeUpdate();
        } catch (Exception ignored) {}

        try {
            entityManager.createNativeQuery(
                "DELETE FROM booking WHERE passenger_id = :id OR ride_id IN (" +
                "  SELECT id FROM ride WHERE driver_id = :id" +
                ")"
            ).setParameter("id", userId).executeUpdate();
        } catch (Exception ignored) {}

        try {
            entityManager.createNativeQuery("DELETE FROM ride WHERE driver_id = :id").setParameter("id", userId).executeUpdate();
        } catch (Exception ignored) {}

        entityManager.createNativeQuery("DELETE FROM users WHERE id = :id").setParameter("id", userId).executeUpdate();

        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();
    }

    @Override
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    @Override
    @Transactional
    public void cancelRide(Long rideId) {
        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM payment WHERE booking_id IN (SELECT id FROM booking WHERE ride_id = :id)").setParameter("id", rideId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM booking WHERE ride_id = :id").setParameter("id", rideId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM ride WHERE id = :id").setParameter("id", rideId).executeUpdate();
        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}