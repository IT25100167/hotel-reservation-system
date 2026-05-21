package edu.sliit.controller;

import edu.sliit.dto.PaymentRequest;
import edu.sliit.dto.PaymentResponse;
import edu.sliit.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/add")
    public ResponseEntity<String> addPayment(@RequestBody PaymentRequest request) {
        try {
            paymentService.addPayment(request);
            return ResponseEntity.ok("Payment created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<PaymentResponse> searchPaymentById(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentService.findById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getUserPayments(@PathVariable Integer userId) {
        List<PaymentResponse> payments = paymentService.getUserPayments(userId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<PaymentResponse>> getReservationPayments(@PathVariable Integer reservationId) {
        List<PaymentResponse> payments = paymentService.getReservationPayments(reservationId);
        return ResponseEntity.ok(payments);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<String> updatePaymentStatus(@PathVariable Integer id, @RequestParam String status) {
        try {
            paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok("Payment status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/create-for-reservation/{reservationId}")
    public ResponseEntity<String> createPaymentForReservation(@PathVariable Integer reservationId) {
        try {
            paymentService.createPaymentForConfirmedReservation(reservationId);
            return ResponseEntity.ok("Payment created for reservation");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
