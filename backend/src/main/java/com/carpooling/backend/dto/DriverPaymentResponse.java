package com.carpooling.backend.dto;

import java.time.LocalDateTime;

public class DriverPaymentResponse {

    private Long paymentId;
    private Long rideId;
    private String passengerName;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
    private LocalDateTime paymentDate;

    public DriverPaymentResponse(
            Long paymentId,
            Long rideId,
            String passengerName,
            Double amount,
            String paymentMethod,
            String paymentStatus,
            String transactionId,
            LocalDateTime paymentDate) {

        this.paymentId = paymentId;
        this.rideId = rideId;
        this.passengerName = passengerName;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.paymentDate = paymentDate;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public Long getRideId() {
        return rideId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public Double getAmount() {
        return amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
}