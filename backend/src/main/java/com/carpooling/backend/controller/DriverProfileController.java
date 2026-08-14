package com.carpooling.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.carpooling.backend.dto.DriverProfileResponse;
import com.carpooling.backend.dto.UpdateDriverProfileRequest;
import com.carpooling.backend.service.DriverProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
@Validated
public class DriverProfileController {

    @Autowired
    private DriverProfileService driverProfileService;

    @GetMapping
    public DriverProfileResponse getProfile() {
        return driverProfileService.getDriverProfile();
    }

    @PutMapping
    public DriverProfileResponse updateProfile(
            @Valid @RequestBody UpdateDriverProfileRequest request) {

        return driverProfileService.updateDriverProfile(request);
    }
}