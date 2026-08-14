package com.carpooling.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class RideResponse {
    private Long id;
    private String driverName;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private LocalTime travelTime;
    private Integer availableSeats;
    private BigDecimal fare;
    private String routePolyline;
    private String status;

    public RideResponse(Long id, String driverName, String source, String destination, LocalDate travelDate, LocalTime travelTime, Integer availableSeats, BigDecimal fare, String routePolyline, String status) {
        this.id = id;
        this.driverName = driverName;
        this.source = source;
        this.destination = destination;
        this.travelDate = travelDate;
        this.travelTime = travelTime;
        this.availableSeats = availableSeats;
        this.fare = fare;
        this.routePolyline = routePolyline;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getDriverName() { return driverName; }
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public LocalDate getTravelDate() { return travelDate; }
    public LocalTime getTravelTime() { return travelTime; }
    public Integer getAvailableSeats() { return availableSeats; }
    public BigDecimal getFare() { return fare; }
    public String getRoutePolyline() { return routePolyline; }
    public String getStatus() { return status; }
}
