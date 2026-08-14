package com.carpooling.backend.service;

import com.carpooling.backend.dto.AdminStatsResponse;
import com.carpooling.backend.dto.AdminUserResponse;
import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.entity.Ride;

import java.util.List;

public interface AdminService {

    AdminStatsResponse getSystemStats();

    List<AdminUserResponse> getAllUsers();

    void deleteUser(Long userId);

    List<Ride> getAllRides();

    void cancelRide(Long rideId);

    List<Booking> getAllBookings();
}