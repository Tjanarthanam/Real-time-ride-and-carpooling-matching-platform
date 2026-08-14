package com.carpooling.backend.controller;

import com.carpooling.backend.dto.AdminStatsResponse;
import com.carpooling.backend.dto.AdminUserResponse;
import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found."));
        }

        if ("ADMIN".equalsIgnoreCase(user.getRole()) || "admin@carpooling.com".equalsIgnoreCase(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Security Warning: You cannot delete the system administrator account."));
        }

        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User and all associated records successfully removed."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete user: " + e.getMessage()));
        }
    }

    @GetMapping("/rides")
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.ok(adminService.getAllRides());
    }

    @DeleteMapping("/rides/{id}")
    public ResponseEntity<?> cancelRide(@PathVariable Long id) {
        try {
            adminService.cancelRide(id);
            return ResponseEntity.ok(Map.of("message", "Ride cancelled successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to cancel ride: " + e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }
}