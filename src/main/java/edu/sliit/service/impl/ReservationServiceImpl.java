package edu.sliit.service.impl;

import edu.sliit.dto.ReservationRequest;
import edu.sliit.dto.ReservationResponse;
import edu.sliit.entity.ReservationEntity;
import edu.sliit.entity.RoomEntity;
import edu.sliit.repository.ReservationRepository;
import edu.sliit.repository.RoomRepository;
import edu.sliit.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    @Override
    public void addReservation(ReservationRequest request, Integer userId) {
      
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new RuntimeException("Check-in and check-out dates are required");
        }

        // Check if check-in is before check-out
        if (request.getCheckInDate().isAfter(request.getCheckOutDate())) {
            throw new RuntimeException("Check-in date must be before check-out date");
        }

        // Check if check-in is not in the past
        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Check-in date cannot be in the past");
        }

        // Validate number of guests
        if (request.getNumberOfGuests() == null || request.getNumberOfGuests() < 1) {
            throw new RuntimeException("Number of guests must be at least 1");
        }

        if (request.getNumberOfGuests() > 10) {
            throw new RuntimeException("Maximum 10 guests allowed per reservation");
        }

        
        if (!isRoomAvailable(request.getRoomId(), request.getCheckInDate(), request.getCheckOutDate())) {
            throw new RuntimeException("Room is not available for the selected dates");
        }

        // Get room and calculate total price
        RoomEntity room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        Double totalPrice = calculateTotalPrice(request.getCheckInDate(), request.getCheckOutDate(), room.getPrice());

        
        ReservationEntity reservation = new ReservationEntity();
        reservation.setUserId(userId);
        reservation.setRoomId(request.getRoomId());
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setTotalPrice(totalPrice);
        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        List<ReservationEntity> reservationEntities = reservationRepository.findAll();
        List<ReservationResponse> responses = new ArrayList<>();

        for (ReservationEntity entity : reservationEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public ReservationResponse findById(Integer id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        return convertToResponse(reservation);
    }

    @Override
    public List<ReservationResponse> getUserReservations(Integer userId) {
        List<ReservationEntity> reservationEntities = reservationRepository.findByUserId(userId);
        List<ReservationResponse> responses = new ArrayList<>();

        for (ReservationEntity entity : reservationEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public void cancelReservation(Integer id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        if (reservation.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Reservation is already cancelled");
        }

        reservation.setStatus("CANCELLED");
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public void confirmReservation(Integer id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        if (!reservation.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only pending reservations can be confirmed");
        }

        reservation.setStatus("CONFIRMED");
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public boolean isRoomAvailable(Integer roomId, LocalDate checkIn, LocalDate checkOut) {
        Long conflictingCount = reservationRepository.countConflictingReservations(roomId, checkIn, checkOut);
        return conflictingCount == 0;
    }

    // Helper methods
    private Double calculateTotalPrice(LocalDate checkIn, LocalDate checkOut, Double pricePerNight) {
        long days = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (days <= 0) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        return pricePerNight * days;
    }

    private ReservationResponse convertToResponse(ReservationEntity entity) {
        ReservationResponse response = new ReservationResponse();
        response.setId(entity.getId());
        response.setUserId(entity.getUserId());
        response.setRoomId(entity.getRoomId());
        response.setCheckInDate(entity.getCheckInDate());
        response.setCheckOutDate(entity.getCheckOutDate());
        response.setNumberOfGuests(entity.getNumberOfGuests());
        response.setTotalPrice(entity.getTotalPrice());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());

        return response;
    }
}
