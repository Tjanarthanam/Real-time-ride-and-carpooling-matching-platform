package com.carpooling.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingResponse {

    private Long bookingId;
    private Long rideId;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private LocalTime travelTime;
    private Long driverId;
    private String driverName;
    private Integer seatsBooked;
    private BigDecimal farePerSeat;
    private BigDecimal totalAmount;
    private String bookingStatus;

    public BookingResponse(
            Long bookingId,
            Long rideId,
            String source,
            String destination,
            LocalDate travelDate,
            LocalTime travelTime,
            Long driverId,
            String driverName,
            Integer seatsBooked,
            BigDecimal farePerSeat,
            String bookingStatus
    ) {

        this.bookingId = bookingId;
        this.rideId = rideId;
        this.source = source;
        this.destination = destination;
        this.travelDate = travelDate;
        this.travelTime = travelTime;
        this.driverId = driverId;
        this.driverName = driverName;
        this.seatsBooked = seatsBooked;
        this.farePerSeat = farePerSeat;
        this.totalAmount = farePerSeat.multiply(BigDecimal.valueOf(seatsBooked));
        this.bookingStatus = bookingStatus;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getRideId() {
        return rideId;
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

    public LocalTime getTravelTime() {
        return travelTime;
    }

    public Long getDriverId() {
        return driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public Integer getSeatsBooked() {
        return seatsBooked;
    }

    public BigDecimal getFarePerSeat() {
        return farePerSeat;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }
}