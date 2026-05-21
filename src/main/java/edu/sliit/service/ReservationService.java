package edu.sliit.service;

import edu.sliit.dto.ReservationRequest;
import edu.sliit.dto.ReservationResponse;
import java.time.LocalDate;
import java.util.List;

public interface ReservationService {
    void addReservation(ReservationRequest request, Integer userId);
    List<ReservationResponse> getAllReservations();
    ReservationResponse findById(Integer id);
    List<ReservationResponse> getUserReservations(Integer userId);
    void confirmReservation(Integer id);
    void cancelReservation(Integer id);
    boolean isRoomAvailable(Integer roomId, LocalDate checkIn, LocalDate checkOut);
}
