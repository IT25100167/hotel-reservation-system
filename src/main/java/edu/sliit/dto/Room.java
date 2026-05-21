package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    private Integer roomId;
    private String roomNumber;
    private String roomType;
    private double price;
    private String status;
    private String description;
    private String image; // Base64 encoded image string
}
