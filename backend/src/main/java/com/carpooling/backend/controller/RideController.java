package com.carpooling.backend.controller;

import com.carpooling.backend.dto.MyRideResponse;
import com.carpooling.backend.dto.RideRequest;
import com.carpooling.backend.dto.RideResponse;
import com.carpooling.backend.entity.Notification;
import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.entity.Waitlist;
import com.carpooling.backend.repository.NotificationRepository;
import com.carpooling.backend.repository.RideRepository;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.repository.WaitlistRepository;
import com.carpooling.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RideController {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WaitlistRepository waitlistRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/offer")
    public ResponseEntity<String> offerRide(@Valid @RequestBody RideRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User driver = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        if (!driver.getRole().equalsIgnoreCase("DRIVER")) {
            return ResponseEntity.badRequest().body("Only drivers can offer rides.");
        }

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSource(request.getSource());
        ride.setDestination(request.getDestination());
        ride.setTravelDate(LocalDate.parse(request.getTravelDate().trim()));
        ride.setTravelTime(request.getTravelTime() != null ? LocalTime.parse(request.getTravelTime()) : LocalTime.of(9, 0));
        ride.setAvailableSeats(request.getAvailableSeats());
        ride.setFare(request.getFare());
        ride.setStatus("CREATED");
        if (request.getRoutePolyline() != null) {
            ride.setRoutePolyline(request.getRoutePolyline());
        }
        if (request.getGenderPreference() != null && !request.getGenderPreference().isEmpty()) {
            ride.setGenderPreference(request.getGenderPreference());
        }
        if (request.getVehicleType() != null && !request.getVehicleType().isEmpty()) {
            ride.setVehicleType(request.getVehicleType());
        }

        rideRepository.save(ride);

        // Suggestion feature: notify anyone who joined the ride waitlist for a
        // matching source/destination that a driver just posted this trip.
        try {
            List<Waitlist> activeWaitlists = waitlistRepository.findByStatus("WAITING");
            for (Waitlist w : activeWaitlists) {
                boolean matchSource = ride.getSource().toLowerCase().contains(w.getSource().toLowerCase())
                        || w.getSource().toLowerCase().contains(ride.getSource().toLowerCase());
                boolean matchDest = ride.getDestination().toLowerCase().contains(w.getDestination().toLowerCase())
                        || w.getDestination().toLowerCase().contains(ride.getDestination().toLowerCase());

                if (matchSource && matchDest) {
                    w.setStatus("MATCHED");
                    waitlistRepository.save(w);

                    if (w.getPassenger() != null) {
                        Notification notif = new Notification();
                        notif.setUser(w.getPassenger());
                        notif.setMessage("Ride Match Found! A ride from " + ride.getSource() + " to " + ride.getDestination()
                                + " on " + ride.getTravelDate() + " by " + driver.getName() + " is now available for Rs " + ride.getFare());
                        notif.setStatus(false);
                        notificationRepository.save(notif);
                    }

                    if (w.getPassengerEmail() != null && !w.getPassengerEmail().isEmpty()) {
                        emailService.sendRideMatchEmail(
                                w.getPassengerEmail(),
                                ride.getSource(),
                                ride.getDestination(),
                                ride.getTravelDate().toString(),
                                driver.getName(),
                                ride.getFare());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error matching waitlists: " + e.getMessage());
        }

        return ResponseEntity.ok("Ride published successfully!");
    }

    @GetMapping("/search")
    public ResponseEntity<List<RideResponse>> searchRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date,
            @RequestParam int seats) {

        LocalDate travelDate = LocalDate.parse(date.trim());
        List<Ride> rides = rideRepository.searchAvailableRides(source, destination, travelDate, seats);

        List<RideResponse> responseList = rides.stream().map(ride -> new RideResponse(
                ride.getId(),
                ride.getDriver().getName(),
                ride.getSource(),
                ride.getDestination(),
                ride.getTravelDate(),
                ride.getTravelTime(),
                ride.getAvailableSeats(),
                ride.getFare(),
                ride.getRoutePolyline(),
                ride.getStatus()
        )).toList();

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/my-rides")
    public ResponseEntity<List<MyRideResponse>> getMyRides() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User driver = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        List<Ride> rides = rideRepository.findByDriver(driver);

        List<MyRideResponse> responseList = rides.stream().map(ride -> new MyRideResponse(
                ride.getId(),
                ride.getSource(),
                ride.getDestination(),
                ride.getTravelDate(),
                ride.getTravelTime(),
                ride.getAvailableSeats(),
                ride.getFare()
        )).toList();

        return ResponseEntity.ok(responseList);
    }
}
