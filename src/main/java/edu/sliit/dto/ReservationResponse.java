package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private Long id;
    private String reservationNumber;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private Double totalPrice;
    private String status;
    private String paymentStatus;
    private String specialRequests;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private LocalDateTime createdAt;
}