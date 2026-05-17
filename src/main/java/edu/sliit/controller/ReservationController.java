package edu.sliit.controller;

import edu.sliit.dto.ReservationRequest;
import edu.sliit.dto.ReservationResponse;
import edu.sliit.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/add")
    public void addReservation(@RequestBody ReservationRequest request,
                               @RequestParam Long userId) {
        reservationService.addReservation(request, userId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<ReservationResponse> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }

    @PutMapping("/update/{id}")
    public void updateReservation(@PathVariable Long id,
                                  @RequestBody ReservationRequest request) {
        reservationService.updateReservation(id, request);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<ReservationResponse> searchReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.findById(id));
    }

    @GetMapping("/search/number/{reservationNumber}")
    public ResponseEntity<ReservationResponse> searchByReservationNumber(@PathVariable String reservationNumber) {
        return ResponseEntity.ok(reservationService.findByReservationNumber(reservationNumber));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getUserReservations(@PathVariable Long userId) {
        List<ReservationResponse> reservations = reservationService.getUserReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<ReservationResponse>> getActiveUserReservations(@PathVariable Long userId) {
        List<ReservationResponse> reservations = reservationService.getActiveUserReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ReservationResponse>> getRoomReservations(@PathVariable Long roomId) {
        List<ReservationResponse> reservations = reservationService.getRoomReservations(roomId);
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/cancel/{id}")
    public void cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
    }

    @PutMapping("/checkin/{id}")
    public void checkIn(@PathVariable Long id) {
        reservationService.checkInReservation(id);
    }

    @PutMapping("/checkout/{id}")
    public void checkOut(@PathVariable Long id) {
        reservationService.checkOutReservation(id);
    }

    @PutMapping("/payment/{id}")
    public void updatePaymentStatus(@PathVariable Long id,
                                    @RequestParam String paymentStatus) {
        reservationService.updatePaymentStatus(id, paymentStatus);
    }

    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkRoomAvailability(@RequestParam Long roomId,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        boolean isAvailable = reservationService.isRoomAvailable(roomId, checkIn, checkOut);
        return ResponseEntity.ok(isAvailable);
    }
}