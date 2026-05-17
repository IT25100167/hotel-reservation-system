package edu.sliit.repository;

import edu.sliit.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    List<ReservationEntity> findByUserId(Long userId);

    List<ReservationEntity> findByRoomId(Long roomId);

    List<ReservationEntity> findByStatus(String status);

    List<ReservationEntity> findByPaymentStatus(String paymentStatus);

    Optional<ReservationEntity> findByReservationNumber(String reservationNumber);

    @Query("SELECT r FROM ReservationEntity r WHERE r.roomId = :roomId AND r.status != 'CANCELLED' AND " +
            "((r.checkInDate BETWEEN :checkIn AND :checkOut) OR " +
            "(r.checkOutDate BETWEEN :checkIn AND :checkOut) OR " +
            "(:checkIn BETWEEN r.checkInDate AND r.checkOutDate))")
    List<ReservationEntity> findConflictingReservations(@Param("roomId") Long roomId,
                                                        @Param("checkIn") LocalDate checkIn,
                                                        @Param("checkOut") LocalDate checkOut);

    @Query("SELECT COUNT(r) FROM ReservationEntity r WHERE r.roomId = :roomId AND " +
            "r.checkInDate <= :checkOut AND r.checkOutDate >= :checkIn AND r.status != 'CANCELLED'")
    Long countConflictingReservations(@Param("roomId") Long roomId,
                                      @Param("checkIn") LocalDate checkIn,
                                      @Param("checkOut") LocalDate checkOut);

    @Query("SELECT r FROM ReservationEntity r WHERE r.userId = :userId AND r.status != 'CANCELLED' ORDER BY r.createdAt DESC")
    List<ReservationEntity> findActiveReservationsByUser(@Param("userId") Long userId);

    boolean existsByReservationNumber(String reservationNumber);
}