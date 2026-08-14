package com.carpooling.backend.controller;

import com.carpooling.backend.dto.LocationUpdateRequest;
import com.carpooling.backend.dto.LocationResponse;
import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.repository.RideRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private RideRepository rideRepository;

    // Driver updates live position
    @PostMapping("/{rideId}/location")
    public ResponseEntity<?> updateLocation(@PathVariable Long rideId, @Valid @RequestBody LocationUpdateRequest request) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        ride.setCurrentLatitude(request.getLatitude());
        ride.setCurrentLongitude(request.getLongitude());
        if (!"COMPLETED".equalsIgnoreCase(ride.getStatus())) {
            ride.setStatus("IN_PROGRESS");
        }
        rideRepository.save(ride);

        LocationResponse response = new LocationResponse(
                ride.getId(),
                ride.getCurrentLatitude(),
                ride.getCurrentLongitude(),
                ride.getRoutePolyline(),
                ride.getStatus(),
                LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

    // Passenger / Driver fetches current live location
    @GetMapping("/{rideId}/location")
    public ResponseEntity<LocationResponse> getLocation(@PathVariable Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        LocationResponse response = new LocationResponse(
                ride.getId(),
                ride.getCurrentLatitude(),
                ride.getCurrentLongitude(),
                ride.getRoutePolyline(),
                ride.getStatus(),
                LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

    // Update status (e.g. START, COMPLETE)
    @PutMapping("/{rideId}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long rideId, @RequestParam String status) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        ride.setStatus(status.toUpperCase());
        rideRepository.save(ride);
        return ResponseEntity.ok("Ride status updated to " + status.toUpperCase());
    }
}
