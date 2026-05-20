package edu.sliit.repository;

import edu.sliit.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    List<PaymentEntity> findByReservationId(Long reservationId);
    Optional<PaymentEntity> findByTransactionReference(String transactionReference);
    boolean existsByTransactionReference(String transactionReference);
}