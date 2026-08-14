package com.carpooling.backend.dto;

// A geocoded location: coordinates plus the human-readable place name
// Nominatim resolved it to.
public class GeoPoint {

    private double lat;
    private double lon;
    private String displayName;

    public GeoPoint() {
    }

    public GeoPoint(double lat, double lon, String displayName) {
        this.lat = lat;
        this.lon = lon;
        this.displayName = displayName;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
