package edu.sliit.service.impl;

import edu.sliit.dto.Payment;
import edu.sliit.entity.PaymentEntity;
import edu.sliit.repository.PaymentRepository;
import edu.sliit.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    public void addPayment(Payment payment) {
        PaymentEntity entity = new PaymentEntity();
        entity.setReservationId(payment.getReservationId());
        entity.setCustomerName(payment.getCustomerName());
        entity.setAmount(payment.getAmount());
        entity.setPaymentMethod(payment.getPaymentMethod());
        entity.setPaymentStatus(payment.getPaymentStatus());
        entity.setPaymentDate(LocalDateTime.now());
        entity.setTransactionReference(payment.getTransactionReference());

        paymentRepository.save(entity);
    }

    @Override
    public List<Payment> getAllPayments() {
        List<Payment> payments = new ArrayList<>();

        for (PaymentEntity entity : paymentRepository.findAll()) {
            payments.add(convertToDto(entity));
        }

        return payments;
    }

    @Override
    public Payment getPaymentById(Long id) {
        PaymentEntity entity = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDto(entity);
    }

    @Override
    public List<Payment> getPaymentsByReservationId(Long reservationId) {
        List<Payment> payments = new ArrayList<>();

        for (PaymentEntity entity : paymentRepository.findByReservationId(reservationId)) {
            payments.add(convertToDto(entity));
        }

        return payments;
    }

    @Override
    public Payment getPaymentByTransactionReference(String transactionReference) {
        PaymentEntity entity = paymentRepository.findByTransactionReference(transactionReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDto(entity);
    }

    @Override
    public void updatePayment(Long id, Payment payment) {
        PaymentEntity entity = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        entity.setReservationId(payment.getReservationId());
        entity.setCustomerName(payment.getCustomerName());
        entity.setAmount(payment.getAmount());
        entity.setPaymentMethod(payment.getPaymentMethod());
        entity.setPaymentStatus(payment.getPaymentStatus());
        entity.setTransactionReference(payment.getTransactionReference());

        paymentRepository.save(entity);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    private Payment convertToDto(PaymentEntity entity) {
        Payment payment = new Payment();
        payment.setPaymentId(entity.getPaymentId());
        payment.setReservationId(entity.getReservationId());
        payment.setCustomerName(entity.getCustomerName());
        payment.setAmount(entity.getAmount());
        payment.setPaymentMethod(entity.getPaymentMethod());
        payment.setPaymentStatus(entity.getPaymentStatus());
        payment.setPaymentDate(entity.getPaymentDate());
        payment.setTransactionReference(entity.getTransactionReference());
        return payment;
    }
}