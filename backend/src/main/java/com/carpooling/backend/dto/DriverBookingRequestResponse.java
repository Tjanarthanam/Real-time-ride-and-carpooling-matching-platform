package com.carpooling.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DriverBookingRequestResponse {

    private Long bookingId;
    private Long rideId;
    private Long passengerId;
    private String passengerName;
    private String passengerPhone;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private Integer seatsBooked;
    private BigDecimal totalAmount;
    private String status;

    public DriverBookingRequestResponse(
            Long bookingId,
            Long rideId,
            Long passengerId,
            String passengerName,
            String passengerPhone,
            String source,
            String destination,
            LocalDate travelDate,
            Integer seatsBooked,
            BigDecimal fare,
            String status
    ) {

        this.bookingId = bookingId;
        this.rideId = rideId;
        this.passengerId = passengerId;
        this.passengerName = passengerName;
        this.passengerPhone = passengerPhone;
        this.source = source;
        this.destination = destination;
        this.travelDate = travelDate;
        this.seatsBooked = seatsBooked;
        this.totalAmount = fare.multiply(BigDecimal.valueOf(seatsBooked));
        this.status = status;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getRideId() {
        return rideId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getPassengerPhone() {
        return passengerPhone;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public Integer getSeatsBooked() {
        return seatsBooked;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }
}