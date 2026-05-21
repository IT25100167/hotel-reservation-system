package edu.sliit.repository;

import edu.sliit.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Integer> {

    List<ReservationEntity> findByUserId(Integer userId);

    List<ReservationEntity> findByRoomId(Integer roomId);

    List<ReservationEntity> findByStatus(String status);

    @Query("SELECT r FROM ReservationEntity r WHERE r.roomId = :roomId AND r.status != 'CANCELLED' AND " +
            "((r.checkInDate BETWEEN :checkIn AND :checkOut) OR " +
            "(r.checkOutDate BETWEEN :checkIn AND :checkOut) OR " +
            "(:checkIn BETWEEN r.checkInDate AND r.checkOutDate))")
    List<ReservationEntity> findConflictingReservations(@Param("roomId") Integer roomId,
                                                        @Param("checkIn") LocalDate checkIn,
                                                        @Param("checkOut") LocalDate checkOut);

    @Query("SELECT COUNT(r) FROM ReservationEntity r WHERE r.roomId = :roomId AND " +
            "r.checkInDate <= :checkOut AND r.checkOutDate >= :checkIn AND r.status != 'CANCELLED'")
    Long countConflictingReservations(@Param("roomId") Integer roomId,
                                      @Param("checkIn") LocalDate checkIn,
                                      @Param("checkOut") LocalDate checkOut);
}