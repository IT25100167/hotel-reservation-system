package edu.sliit.service.impl;

import edu.sliit.dto.PaymentRequest;
import edu.sliit.dto.PaymentResponse;
import edu.sliit.entity.PaymentEntity;
import edu.sliit.entity.ReservationEntity;
import edu.sliit.repository.PaymentRepository;
import edu.sliit.repository.ReservationRepository;
import edu.sliit.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public void addPayment(PaymentRequest request) {
        if (request.getReservationId() == null) {
            throw new RuntimeException("Reservation ID is required");
        }

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        PaymentEntity payment = new PaymentEntity();
        payment.setReservationId(request.getReservationId());
        payment.setUserId(request.getUserId());
        payment.setRoomId(request.getRoomId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "PENDING");
        payment.setStatus("COMPLETED");
        payment.setCreatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        List<PaymentEntity> paymentEntities = paymentRepository.findAll();
        List<PaymentResponse> responses = new ArrayList<>();

        for (PaymentEntity entity : paymentEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public PaymentResponse findById(Integer id) {
        PaymentEntity payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return convertToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getUserPayments(Integer userId) {
        List<PaymentEntity> paymentEntities = paymentRepository.findByUserId(userId);
        List<PaymentResponse> responses = new ArrayList<>();

        for (PaymentEntity entity : paymentEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public List<PaymentResponse> getReservationPayments(Integer reservationId) {
        List<PaymentEntity> paymentEntities = paymentRepository.findByReservationId(reservationId);
        List<PaymentResponse> responses = new ArrayList<>();

        for (PaymentEntity entity : paymentEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public void updatePaymentStatus(Integer id, String status) {
        PaymentEntity payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
    }

    @Override
    public void createPaymentForConfirmedReservation(Integer reservationId) {
        System.out.println("Creating payment for reservation: " + reservationId);
        
        ReservationEntity reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        System.out.println("Found reservation - userId: " + reservation.getUserId() + ", roomId: " + reservation.getRoomId() + ", amount: " + reservation.getTotalPrice());

        PaymentEntity payment = new PaymentEntity();
        payment.setReservationId(reservationId);
        payment.setUserId(reservation.getUserId());
        payment.setRoomId(reservation.getRoomId());
        payment.setAmount(reservation.getTotalPrice());
        payment.setPaymentMethod("ONLINE");
        payment.setStatus("COMPLETED");
        payment.setCreatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
        System.out.println("Payment saved successfully");
    }

    private PaymentResponse convertToResponse(PaymentEntity entity) {
        PaymentResponse response = new PaymentResponse();
        response.setId(entity.getId());
        response.setReservationId(entity.getReservationId());
        response.setUserId(entity.getUserId());
        response.setRoomId(entity.getRoomId());
        response.setAmount(entity.getAmount());
        response.setStatus(entity.getStatus());
        response.setPaymentMethod(entity.getPaymentMethod());
        response.setTransactionId(entity.getTransactionId());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());

        return response;
    }
}
