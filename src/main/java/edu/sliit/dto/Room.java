package edu.sliit.dto;

import lombok.Data;

@Data
public class Room {

    private Integer id;
    private String roomNumber;
    private String roomType;
    private double price;
    private String status;
    private String description;
}
