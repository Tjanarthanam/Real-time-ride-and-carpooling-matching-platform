package com.carpooling.backend.service;

import com.carpooling.backend.dto.DriverPaymentResponse;
import com.carpooling.backend.dto.PaymentRequest;
import com.carpooling.backend.dto.PaymentResponse;
import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.entity.Payment;
import com.carpooling.backend.entity.PaymentStatus;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.BookingRepository;
import com.carpooling.backend.repository.PaymentRepository;
import com.carpooling.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PaymentResponse makePayment(PaymentRequest request) {

        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User passenger = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Passenger user not found."));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getPassenger().getId().equals(passenger.getId())) {
            throw new RuntimeException("Unauthorized payment.");
        }

        if (paymentRepository.findByBooking(booking).isPresent()) {
            throw new RuntimeException("Payment already exists for this booking.");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);

        payment.setAmount(
                booking.getRide()
                       .getFare()
                       .multiply(
                           java.math.BigDecimal.valueOf(
                               booking.getSeatsBooked()
                           )
                       )
                       .doubleValue()
        );
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());

        paymentRepository.save(payment);

        booking.setBookingStatus("CONFIRMED");
        bookingRepository.save(booking);

        return new PaymentResponse(
                payment.getId(),
                booking.getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus().name(),
                payment.getTransactionId(),
                payment.getPaymentDate()
        );
    }

    @Override
    public PaymentResponse getPayment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return new PaymentResponse(
                payment.getId(),
                payment.getBooking().getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus().name(),
                payment.getTransactionId(),
                payment.getPaymentDate()
        );
    }
    
    @Override
    public List<DriverPaymentResponse> getDriverPayments() {

        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User driver = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Driver user not found."));

        // Look up payments using immutable driver ID
        return paymentRepository
                .findByBooking_Ride_Driver_Id(driver.getId())
                .stream()
                .map(payment -> new DriverPaymentResponse(
                        payment.getId(),
                        payment.getBooking().getRide().getId(),
                        payment.getBooking().getPassenger().getName(),
                        payment.getAmount(),
                        payment.getPaymentMethod(),
                        payment.getPaymentStatus().name(),
                        payment.getTransactionId(),
                        payment.getPaymentDate()
                ))
                .toList();
    }

    @Override
    public List<PaymentResponse> getMyPayments() {

        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User passenger = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Passenger user not found."));

        // Look up payments using immutable passenger ID (preserves history if email changes)
        return paymentRepository.findByBooking_Passenger_Id(passenger.getId())
                .stream()
                .map(payment -> new PaymentResponse(
                        payment.getId(),
                        payment.getBooking().getId(),
                        payment.getAmount(),
                        payment.getPaymentMethod(),
                        payment.getPaymentStatus().name(),
                        payment.getTransactionId(),
                        payment.getPaymentDate()
                ))
                .toList();
    }
}