package com.carpooling.backend.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long activeDrivers;
    private long publishedRides;
    private long totalBookings;
    private double platformRevenue;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long activeDrivers, long publishedRides, long totalBookings, double platformRevenue) {
        this.totalUsers = totalUsers;
        this.activeDrivers = activeDrivers;
        this.publishedRides = publishedRides;
        this.totalBookings = totalBookings;
        this.platformRevenue = platformRevenue;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveDrivers() {
        return activeDrivers;
    }

    public void setActiveDrivers(long activeDrivers) {
        this.activeDrivers = activeDrivers;
    }

    public long getPublishedRides() {
        return publishedRides;
    }

    public void setPublishedRides(long publishedRides) {
        this.publishedRides = publishedRides;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public double getPlatformRevenue() {
        return platformRevenue;
    }

    public void setPlatformRevenue(double platformRevenue) {
        this.platformRevenue = platformRevenue;
    }
}