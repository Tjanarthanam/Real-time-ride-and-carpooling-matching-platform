package com.carpooling.backend.controller;

import com.carpooling.backend.dto.PaymentRequest;
import com.carpooling.backend.dto.PaymentResponse;
import com.carpooling.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.carpooling.backend.dto.DriverPaymentResponse;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<PaymentResponse> makePayment(
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(paymentService.makePayment(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long id) {

        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory() {

        return ResponseEntity.ok(paymentService.getMyPayments());
    }
    
    @GetMapping("/driver-history")
    public ResponseEntity<List<DriverPaymentResponse>> getDriverPayments() {

        return ResponseEntity.ok(
                paymentService.getDriverPayments()
        );

    }
}