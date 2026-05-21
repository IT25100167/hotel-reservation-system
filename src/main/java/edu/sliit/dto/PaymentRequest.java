package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    private Integer reservationId;
    private Integer userId;
    private Integer roomId;
    private Double amount;
    private String paymentMethod;
}
