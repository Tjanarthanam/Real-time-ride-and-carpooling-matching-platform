package com.carpooling.backend.dto;

public class DriverProfileResponse {

    private String name;
    private String email;
    private String phone;
    private String gender;

    private String licenseNumber;
    private String vehicleModel;
    private String vehicleNumber;

    public DriverProfileResponse() {
    }

    public DriverProfileResponse(String name, String email, String phone, String gender,
                                 String licenseNumber, String vehicleModel, String vehicleNumber) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.licenseNumber = licenseNumber;
        this.vehicleModel = vehicleModel;
        this.vehicleNumber = vehicleNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
}