package com.carpooling.backend.controller;

import com.carpooling.backend.dto.EmergencyAlertRequest;
import com.carpooling.backend.entity.EmergencyAlert;
import com.carpooling.backend.entity.Notification;
import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.EmergencyAlertRepository;
import com.carpooling.backend.repository.NotificationRepository;
import com.carpooling.backend.repository.RideRepository;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Emergency / SOS backend. Triggering an alert:
 *  - persists the alert with the rider's last known location
 *  - emails the RideTogether safety dispatch mailbox (and the rider's own
 *    emergency contact email, if supplied)
 *  - drops an in-app notification for the other party on the ride (driver <-> passenger)
 */
@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    @Autowired
    private EmergencyAlertRepository emergencyAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    private User currentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerAlert(@RequestBody EmergencyAlertRequest request) {
        User user = currentUser();

        EmergencyAlert alert = new EmergencyAlert();
        alert.setUser(user);
        alert.setLatitude(request.getLatitude());
        alert.setLongitude(request.getLongitude());
        alert.setNote(request.getNote());
        alert.setStatus("TRIGGERED");

        Ride ride = null;
        if (request.getRideId() != null) {
            ride = rideRepository.findById(request.getRideId()).orElse(null);
            alert.setRide(ride);
        }
        emergencyAlertRepository.save(alert);

        // Notify RideTogether safety dispatch
        emailService.sendEmergencyAlertEmail(
                emailService.getSupportEmail(),
                user.getName(),
                user.getPhone(),
                request.getLatitude(),
                request.getLongitude(),
                request.getRideId(),
                request.getNote());

        // Optionally notify the user's own emergency contact
        if (request.getEmergencyContactEmail() != null && !request.getEmergencyContactEmail().isBlank()) {
            emailService.sendEmergencyAlertEmail(
                    request.getEmergencyContactEmail().trim(),
                    user.getName(),
                    user.getPhone(),
                    request.getLatitude(),
                    request.getLongitude(),
                    request.getRideId(),
                    request.getNote());
        }

        // Notify the other party on the ride (driver <-> passenger) in-app
        if (ride != null) {
            User counterpart = ride.getDriver() != null && ride.getDriver().getId().equals(user.getId())
                    ? null
                    : ride.getDriver();
            if (counterpart != null) {
                Notification notif = new Notification();
                notif.setUser(counterpart);
                notif.setMessage("EMERGENCY: " + user.getName() + " triggered an SOS alert on ride #" + ride.getId() + ". Please check on them immediately.");
                notif.setStatus(false);
                notificationRepository.save(notif);
            }
        }

        return ResponseEntity.ok(Map.of(
                "message", "Emergency alert dispatched. Safety dispatch and your emergency contact (if provided) have been notified.",
                "alertId", alert.getId()
        ));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EmergencyAlert>> myAlerts() {
        return ResponseEntity.ok(emergencyAlertRepository.findByUserOrderByCreatedAtDesc(currentUser()));
    }
}
