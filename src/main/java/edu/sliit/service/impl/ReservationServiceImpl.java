package edu.sliit.service.impl;

import edu.sliit.dto.ReservationRequest;
import edu.sliit.dto.ReservationResponse;
import edu.sliit.entity.ReservationEntity;
import edu.sliit.repository.ReservationRepository;
import edu.sliit.service.ReservationService;
import edu.sliit.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    public void addReservation(ReservationRequest request, Long userId) {
        // Validate dates
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

        // Validate guest details
        if (request.getGuestName() == null || request.getGuestName().trim().isEmpty()) {
            throw new RuntimeException("Guest name is required");
        }

        if (request.getGuestEmail() == null || !ValidationUtil.isValidEmail(request.getGuestEmail())) {
            throw new RuntimeException("Valid email is required");
        }

        if (request.getGuestPhone() == null || !ValidationUtil.isValidPhoneNumber(request.getGuestPhone())) {
            throw new RuntimeException("Valid phone number is required");
        }

        // Check room availability
        if (!isRoomAvailable(request.getRoomId(), request.getCheckInDate(), request.getCheckOutDate())) {
            throw new RuntimeException("Room is not available for the selected dates");
        }

        // Calculate total price
        Double totalPrice = calculateTotalPrice(request.getCheckInDate(), request.getCheckOutDate());

        // Create reservation entity
        ReservationEntity reservation = new ReservationEntity();
        reservation.setReservationNumber(generateReservationNumber());
        reservation.setUserId(userId);
        reservation.setRoomId(request.getRoomId());
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setTotalPrice(totalPrice);
        reservation.setStatus("CONFIRMED");
        reservation.setPaymentStatus("PENDING");
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setGuestName(request.getGuestName());
        reservation.setGuestEmail(request.getGuestEmail());
        reservation.setGuestPhone(request.getGuestPhone());
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
    public void deleteReservation(Long id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        // Only cancelled reservations can be deleted
        if (!reservation.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Only cancelled reservations can be deleted");
        }

        reservationRepository.delete(reservation);
    }

    @Override
    public void updateReservation(Long id, ReservationRequest request) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        // Check if reservation can be modified
        if (reservation.getStatus().equals("CHECKED_IN") || reservation.getStatus().equals("CHECKED_OUT")) {
            throw new RuntimeException("Cannot modify reservation that has been checked in or out");
        }

        // Validate dates
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new RuntimeException("Check-in and check-out dates are required");
        }

        if (request.getCheckInDate().isAfter(request.getCheckOutDate())) {
            throw new RuntimeException("Check-in date must be before check-out date");
        }

        // Check availability for new dates if dates changed
        if (!reservation.getCheckInDate().equals(request.getCheckInDate()) ||
                !reservation.getCheckOutDate().equals(request.getCheckOutDate())) {

            if (!isRoomAvailable(reservation.getRoomId(), request.getCheckInDate(), request.getCheckOutDate())) {
                throw new RuntimeException("Room is not available for the new dates");
            }
        }

        // Validate guest details
        if (request.getGuestName() == null || request.getGuestName().trim().isEmpty()) {
            throw new RuntimeException("Guest name is required");
        }

        if (request.getGuestEmail() == null || !ValidationUtil.isValidEmail(request.getGuestEmail())) {
            throw new RuntimeException("Valid email is required");
        }

        if (request.getGuestPhone() == null || !ValidationUtil.isValidPhoneNumber(request.getGuestPhone())) {
            throw new RuntimeException("Valid phone number is required");
        }

        // Update reservation
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setGuestName(request.getGuestName());
        reservation.setGuestEmail(request.getGuestEmail());
        reservation.setGuestPhone(request.getGuestPhone());

        // Recalculate price if dates changed
        if (!reservation.getCheckInDate().equals(request.getCheckInDate()) ||
                !reservation.getCheckOutDate().equals(request.getCheckOutDate())) {
            Double newPrice = calculateTotalPrice(request.getCheckInDate(), request.getCheckOutDate());
            reservation.setTotalPrice(newPrice);
        }

        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public ReservationResponse findById(Long id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        return convertToResponse(reservation);
    }

    @Override
    public ReservationResponse findByReservationNumber(String reservationNumber) {
        ReservationEntity reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found with number: " + reservationNumber));
        return convertToResponse(reservation);
    }

    @Override
    public List<ReservationResponse> getUserReservations(Long userId) {
        List<ReservationEntity> reservationEntities = reservationRepository.findByUserId(userId);
        List<ReservationResponse> responses = new ArrayList<>();

        for (ReservationEntity entity : reservationEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public List<ReservationResponse> getActiveUserReservations(Long userId) {
        List<ReservationEntity> reservationEntities = reservationRepository.findActiveReservationsByUser(userId);
        List<ReservationResponse> responses = new ArrayList<>();

        for (ReservationEntity entity : reservationEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public List<ReservationResponse> getRoomReservations(Long roomId) {
        List<ReservationEntity> reservationEntities = reservationRepository.findByRoomId(roomId);
        List<ReservationResponse> responses = new ArrayList<>();

        for (ReservationEntity entity : reservationEntities) {
            responses.add(convertToResponse(entity));
        }
        return responses;
    }

    @Override
    public void cancelReservation(Long id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        if (reservation.getStatus().equals("CHECKED_IN")) {
            throw new RuntimeException("Cannot cancel reservation that has already been checked in");
        }

        if (reservation.getStatus().equals("CHECKED_OUT")) {
            throw new RuntimeException("Cannot cancel reservation that has already been checked out");
        }

        reservation.setStatus("CANCELLED");
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public void checkInReservation(Long id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        if (!reservation.getStatus().equals("CONFIRMED")) {
            throw new RuntimeException("Only confirmed reservations can be checked in");
        }

        if (reservation.getPaymentStatus().equals("PENDING")) {
            throw new RuntimeException("Payment required before check-in");
        }

        // Check if check-in date matches current date or is in the past
        if (reservation.getCheckInDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Cannot check in before check-in date");
        }

        reservation.setStatus("CHECKED_IN");
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public void checkOutReservation(Long id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        if (!reservation.getStatus().equals("CHECKED_IN")) {
            throw new RuntimeException("Only checked-in reservations can be checked out");
        }

        reservation.setStatus("CHECKED_OUT");
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public void updatePaymentStatus(Long id, String paymentStatus) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        if (!paymentStatus.equals("PENDING") && !paymentStatus.equals("PAID") && !paymentStatus.equals("REFUNDED")) {
            throw new RuntimeException("Invalid payment status. Must be PENDING, PAID, or REFUNDED");
        }

        reservation.setPaymentStatus(paymentStatus);
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        Long conflictingCount = reservationRepository.countConflictingReservations(roomId, checkIn, checkOut);
        return conflictingCount == 0;
    }

    // Helper methods
    private String generateReservationNumber() {
        return "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private Double calculateTotalPrice(LocalDate checkIn, LocalDate checkOut) {
        long days = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (days <= 0) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        // Default price per night - you can modify this or get from RoomService
        double pricePerNight = 100.0;

        return pricePerNight * days;
    }

    private ReservationResponse convertToResponse(ReservationEntity entity) {
        ReservationResponse response = new ReservationResponse();
        response.setId(entity.getId());
        response.setReservationNumber(entity.getReservationNumber());
        response.setRoomId(entity.getRoomId());
        response.setCheckInDate(entity.getCheckInDate());
        response.setCheckOutDate(entity.getCheckOutDate());
        response.setNumberOfGuests(entity.getNumberOfGuests());
        response.setTotalPrice(entity.getTotalPrice());
        response.setStatus(entity.getStatus());
        response.setPaymentStatus(entity.getPaymentStatus());
        response.setSpecialRequests(entity.getSpecialRequests());
        response.setGuestName(entity.getGuestName());
        response.setGuestEmail(entity.getGuestEmail());
        response.setGuestPhone(entity.getGuestPhone());
        response.setCreatedAt(entity.getCreatedAt());

        return response;
    }
}