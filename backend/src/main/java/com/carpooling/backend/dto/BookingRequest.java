package com.carpooling.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull(message = "Ride ID is required")
    private Long rideId;

    @NotNull(message = "Number of seats to book is required")
    @Min(value = 1, message = "Must book at least 1 seat")
    private Integer seatsToBook;

    public BookingRequest() {}

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public Integer getSeatsToBook() { return seatsToBook; }
    public void setSeatsToBook(Integer seatsToBook) { this.seatsToBook = seatsToBook; }
}