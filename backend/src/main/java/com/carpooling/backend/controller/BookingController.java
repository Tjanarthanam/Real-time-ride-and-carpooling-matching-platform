package com.carpooling.backend.controller;

import com.carpooling.backend.dto.BookingRequest;
import com.carpooling.backend.dto.BookingResponse;
import com.carpooling.backend.dto.DriverBookingRequestResponse;
import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.entity.Notification;
import com.carpooling.backend.entity.Ride;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.BookingRepository;
import com.carpooling.backend.repository.NotificationRepository;
import com.carpooling.backend.repository.RideRepository;
import com.carpooling.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // 1. PASSENGER: Request a booking (Status -> PENDING)
    @PostMapping("/book")
    public ResponseEntity<String> bookRide(@Valid @RequestBody BookingRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User passenger = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getDriver().getId().equals(passenger.getId())) {
            return ResponseEntity.badRequest().body("Drivers cannot book their own rides.");
        }

        if (ride.getAvailableSeats() < request.getSeatsToBook()) {
            return ResponseEntity.badRequest().body("Not enough seats available.");
        }

        // Deduct seats temporarily
        ride.setAvailableSeats(ride.getAvailableSeats() - request.getSeatsToBook());
        rideRepository.save(ride);

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(request.getSeatsToBook());
        booking.setBookingStatus("PENDING");
        booking.setBookingTime(LocalDateTime.now());

        bookingRepository.save(booking);

        // Send Notification to Driver
        Notification driverNotif = new Notification();
        driverNotif.setUser(ride.getDriver());
        driverNotif.setMessage("New booking request from " + passenger.getName() + " (" + request.getSeatsToBook() + " seat(s)) for " + ride.getSource() + " → " + ride.getDestination());
        notificationRepository.save(driverNotif);

        return ResponseEntity.ok("Booking request sent! Waiting for driver approval.");
    }

    // 2. DRIVER: View incoming booking requests for their rides
 // 2. DRIVER: View incoming booking requests for their rides
    @GetMapping("/driver-requests")
    public ResponseEntity<List<DriverBookingRequestResponse>> getDriverRequests() {

        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User driver = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow();

        List<Ride> driverRides = rideRepository.findByDriver(driver);

        List<Booking> driverBookings = bookingRepository.findAll()
                .stream()
                .filter(b -> driverRides.stream()
                        .anyMatch(r -> r.getId().equals(b.getRide().getId())))
                .toList();

        List<DriverBookingRequestResponse> responseList =
                driverBookings.stream()
                        .map(b -> new DriverBookingRequestResponse(

                                b.getId(),                        // bookingId
                                b.getRide().getId(),             // rideId

                                b.getPassenger().getId(),        // <-- NEW
                                b.getPassenger().getName(),
                                b.getPassenger().getPhone(),

                                b.getRide().getSource(),
                                b.getRide().getDestination(),
                                b.getRide().getTravelDate(),

                                b.getSeatsBooked(),
                                b.getRide().getFare(),
                                b.getBookingStatus()

                        ))
                        .toList();

        return ResponseEntity.ok(responseList);
    }

    // 3. DRIVER: Accept Booking Request
    @PutMapping("/{id}/accept")
    public ResponseEntity<String> acceptBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setBookingStatus("CONFIRMED");
        bookingRepository.save(booking);

        // Send Notification to Passenger
        Notification passengerNotif = new Notification();
        passengerNotif.setUser(booking.getPassenger());
        passengerNotif.setMessage("Great news! Your booking for " + booking.getRide().getSource() + " → " + booking.getRide().getDestination() + " has been ACCEPTED by the driver.");
        notificationRepository.save(passengerNotif);

        return ResponseEntity.ok("Booking accepted successfully!");
    }

    // 4. DRIVER: Reject Booking Request
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"REJECTED".equals(booking.getBookingStatus())) {
            booking.setBookingStatus("REJECTED");
            bookingRepository.save(booking);

            // Restore seats back to the ride
            Ride ride = booking.getRide();
            ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
            rideRepository.save(ride);

            // Send Notification to Passenger
            Notification passengerNotif = new Notification();
            passengerNotif.setUser(booking.getPassenger());
            passengerNotif.setMessage("Your booking request for " + ride.getSource() + " → " + ride.getDestination() + " was REJECTED by the driver.");
            notificationRepository.save(passengerNotif);
        }

        return ResponseEntity.ok("Booking rejected.");
    }

    // 5. PASSENGER: View their bookings
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User passenger = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        List<Booking> bookings = bookingRepository.findByPassenger(passenger);

        List<BookingResponse> responseList = bookings.stream().map(b -> new BookingResponse(
                b.getId(),
                b.getRide().getId(),
                b.getRide().getSource(),
                b.getRide().getDestination(),
                b.getRide().getTravelDate(),
                b.getRide().getTravelTime(),
                b.getRide().getDriver().getId(),
                b.getRide().getDriver().getName(),
                b.getSeatsBooked(),
                b.getRide().getFare(),
                b.getBookingStatus()
        )).toList();

        return ResponseEntity.ok(responseList);
    }
}