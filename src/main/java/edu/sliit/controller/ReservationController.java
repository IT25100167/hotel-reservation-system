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
                               @RequestParam Integer userId) {
        reservationService.addReservation(request, userId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<ReservationResponse> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<ReservationResponse> searchReservationById(@PathVariable Integer id) {
        return ResponseEntity.ok(reservationService.findById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getUserReservations(@PathVariable Integer userId) {
        List<ReservationResponse> reservations = reservationService.getUserReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/cancel/{id}")
    public void cancelReservation(@PathVariable Integer id) {
        reservationService.cancelReservation(id);
    }

    @PutMapping("/confirm/{id}")
    public void confirmReservation(@PathVariable Integer id) {
        reservationService.confirmReservation(id);
    }

    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkRoomAvailability(@RequestParam Integer roomId,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        boolean isAvailable = reservationService.isRoomAvailable(roomId, checkIn, checkOut);
        return ResponseEntity.ok(isAvailable);
    }
}

