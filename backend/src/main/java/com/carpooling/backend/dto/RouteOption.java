package com.carpooling.backend.dto;

import java.util.List;

// One candidate driving route between two points, ready for the frontend
// to render on the map and show in the route picker.
public class RouteOption {

    private double distanceKm;
    private double durationMin;
    private int fare;

    // [ [lat, lon], [lat, lon], ... ] — already flipped from OSRM's
    // [lon, lat] GeoJSON order into what Leaflet expects.
    private List<List<Double>> coordinates;

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public double getDurationMin() {
        return durationMin;
    }

    public void setDurationMin(double durationMin) {
        this.durationMin = durationMin;
    }

    public int getFare() {
        return fare;
    }

    public void setFare(int fare) {
        this.fare = fare;
    }

    public List<List<Double>> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<List<Double>> coordinates) {
        this.coordinates = coordinates;
    }
}
