package com.carpooling.backend.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]{1,49}$", message = "Name must be 2-50 letters and may include spaces, apostrophes or hyphens")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=]).{8,}$",
            message = "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character")
    private String password;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Role is required")
    private String role;

    private String gender;

    // Only required/validated for drivers (left blank for passengers), so no
    // @NotBlank here - @Pattern alone already lets a null/absent value through
    // while still rejecting a badly-formatted one that was actually supplied.
    @Pattern(regexp = "^[A-Za-z]{2}[A-Za-z0-9-]{4,13}$", message = "Driving License ID must start with 2 letters and be 6-15 characters long")
    private String licenseNumber;

    @Pattern(regexp = "^[A-Za-z0-9 .()-]{3,100}$", message = "Vehicle details must be 3-100 characters (letters, numbers, spaces)")
    private String vehicleInfo;

    private String vehicleNumber;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getVehicleInfo() { return vehicleInfo; }
    public void setVehicleInfo(String vehicleInfo) { this.vehicleInfo = vehicleInfo; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
}