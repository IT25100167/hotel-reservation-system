package edu.sliit.service;

import edu.sliit.dto.ReservationRequest;
import edu.sliit.dto.ReservationResponse;
import java.time.LocalDate;
import java.util.List;

public interface ReservationService {
    void addReservation(ReservationRequest request, Long userId);
    List<ReservationResponse> getAllReservations();
    void deleteReservation(Long id);
    void updateReservation(Long id, ReservationRequest request);
    ReservationResponse findById(Long id);
    ReservationResponse findByReservationNumber(String reservationNumber);
    List<ReservationResponse> getUserReservations(Long userId);
    List<ReservationResponse> getActiveUserReservations(Long userId);
    List<ReservationResponse> getRoomReservations(Long roomId);
    void cancelReservation(Long id);
    void checkInReservation(Long id);
    void checkOutReservation(Long id);
    void updatePaymentStatus(Long id, String paymentStatus);
    boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut);
}
