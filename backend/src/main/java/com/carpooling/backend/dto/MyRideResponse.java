package com.carpooling.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class MyRideResponse {
    private Long id;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private LocalTime travelTime;
    private Integer availableSeats;
    private BigDecimal fare;

    public MyRideResponse(Long id, String source, String destination, LocalDate travelDate, LocalTime travelTime, Integer availableSeats, BigDecimal fare) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.travelDate = travelDate;
        this.travelTime = travelTime;
        this.availableSeats = availableSeats;
        this.fare = fare;
    }

    public Long getId() { return id; }
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public LocalDate getTravelDate() { return travelDate; }
    public LocalTime getTravelTime() { return travelTime; }
    public Integer getAvailableSeats() { return availableSeats; }
    public BigDecimal getFare() { return fare; }
}