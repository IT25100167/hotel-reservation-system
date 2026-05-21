package edu.sliit.repository;

import edu.sliit.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {

    List<PaymentEntity> findByUserId(Integer userId);

    List<PaymentEntity> findByReservationId(Integer reservationId);

    List<PaymentEntity> findByStatus(String status);

    Optional<PaymentEntity> findByReservationIdAndStatus(Integer reservationId, String status);

    List<PaymentEntity> findByRoomId(Integer roomId);
}
