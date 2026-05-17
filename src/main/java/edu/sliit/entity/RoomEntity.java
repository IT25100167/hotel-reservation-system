package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rooms")
public class RoomEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String roomNumber;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    private double price;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
