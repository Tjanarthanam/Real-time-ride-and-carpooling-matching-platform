package com.carpooling.backend.dto;

import java.time.LocalDateTime;

public class LocationResponse {
    private Long rideId;
    private Double currentLatitude;
    private Double currentLongitude;
    private String routePolyline;
    private String status;
    private LocalDateTime lastUpdated;

    public LocationResponse() {}

    public LocationResponse(Long rideId, Double currentLatitude, Double currentLongitude, String routePolyline, String status, LocalDateTime lastUpdated) {
        this.rideId = rideId;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.routePolyline = routePolyline;
        this.status = status;
        this.lastUpdated = lastUpdated;
    }

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public String getRoutePolyline() { return routePolyline; }
    public void setRoutePolyline(String routePolyline) { this.routePolyline = routePolyline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
