package com.carpooling.backend.service;

import com.carpooling.backend.dto.PaymentRequest;
import com.carpooling.backend.dto.PaymentResponse;
import java.util.List;
import com.carpooling.backend.dto.DriverPaymentResponse;

public interface PaymentService {

    PaymentResponse makePayment(PaymentRequest request);

    PaymentResponse getPayment(Long paymentId);

    List<PaymentResponse> getMyPayments();
    List<DriverPaymentResponse> getDriverPayments();

}