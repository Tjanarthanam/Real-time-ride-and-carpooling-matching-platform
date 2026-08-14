package com.carpooling.backend.service;

import com.carpooling.backend.dto.DriverProfileResponse;
import com.carpooling.backend.dto.UpdateDriverProfileRequest;

public interface DriverProfileService {

    DriverProfileResponse getDriverProfile();

    DriverProfileResponse updateDriverProfile(UpdateDriverProfileRequest request);

}