package edu.sliit.service;

import edu.sliit.dto.Payment;

import java.util.List;

public interface PaymentService {
    void addPayment(Payment payment);
    List<Payment> getAllPayments();
    Payment getPaymentById(Long id);
    List<Payment> getPaymentsByReservationId(Long reservationId);
    Payment getPaymentByTransactionReference(String transactionReference);
    void updatePayment(Long id, Payment payment);
    void deletePayment(Long id);
}