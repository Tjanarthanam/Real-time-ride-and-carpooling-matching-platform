package com.carpooling.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.carpooling.backend.dto.DriverProfileResponse;
import com.carpooling.backend.dto.UpdateDriverProfileRequest;
import com.carpooling.backend.entity.DriverDetails;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.DriverDetailsRepository;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.service.DriverProfileService;

@Service
public class DriverProfileServiceImpl implements DriverProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverDetailsRepository driverDetailsRepository;

    @Override
    public DriverProfileResponse getDriverProfile() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DriverDetails driver = driverDetailsRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Driver details not found"));

        DriverProfileResponse response = new DriverProfileResponse();

        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setGender(user.getGender());

        response.setLicenseNumber(driver.getLicenseNumber());
        response.setVehicleModel(driver.getVehicleInfo());
        response.setVehicleNumber(driver.getVehicleNumber());

        return response;
    }

    @Override
    public DriverProfileResponse updateDriverProfile(UpdateDriverProfileRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DriverDetails driver = driverDetailsRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Driver details not found"));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());

        userRepository.save(user);

        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setVehicleInfo(request.getVehicleModel());
        driver.setVehicleNumber(request.getVehicleNumber());

        driverDetailsRepository.save(driver);

        DriverProfileResponse response = new DriverProfileResponse();

        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setGender(user.getGender());

        response.setLicenseNumber(driver.getLicenseNumber());
        response.setVehicleModel(driver.getVehicleInfo());
        response.setVehicleNumber(driver.getVehicleNumber());

        return response;
    }
}