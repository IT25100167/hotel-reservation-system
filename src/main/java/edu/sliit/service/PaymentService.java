package edu.sliit.service;

import edu.sliit.dto.PaymentRequest;
import edu.sliit.dto.PaymentResponse;
import java.util.List;

public interface PaymentService {

    void addPayment(PaymentRequest request);

    List<PaymentResponse> getAllPayments();

    PaymentResponse findById(Integer id);

    List<PaymentResponse> getUserPayments(Integer userId);

    List<PaymentResponse> getReservationPayments(Integer reservationId);

    void updatePaymentStatus(Integer id, String status);

    void createPaymentForConfirmedReservation(Integer reservationId);
}
