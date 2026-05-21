package edu.sliit.service.impl;

import edu.sliit.dto.Room;
import edu.sliit.entity.RoomEntity;
import edu.sliit.entity.RoomStatus;
import edu.sliit.entity.RoomType;
import edu.sliit.repository.RoomRepository;
import edu.sliit.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public void addRoom(Room room) {
        if(roomRepository.existsByRoomNumber(room.getRoomNumber())){
            throw new RuntimeException("Room number already exists");
        }
        RoomEntity entity = new RoomEntity();
        entity.setRoomNumber(room.getRoomNumber());
        entity.setRoomType(RoomType.valueOf(room.getRoomType().toUpperCase()));
        entity.setPrice(room.getPrice());
        entity.setStatus(RoomStatus.valueOf(room.getStatus().toUpperCase()));
        entity.setDescription(room.getDescription());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        roomRepository.save(entity);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll().stream().map(entity -> {
            Room room = new Room();
            room.setId(entity.getId());
            room.setRoomNumber(entity.getRoomNumber());
            room.setRoomType(entity.getRoomType().name());
            room.setPrice(entity.getPrice());
            room.setStatus(entity.getStatus().name());
            room.setDescription(entity.getDescription());
            return room;
        }).toList();
    }

    @Override
    public Room getRoomById(int id) {
        return null;
    }

    @Override
    public void updateRoom(Room room) {
        // RoomEntity entity = roomRepository.findById(room.getId())
        //         .orElseThrow(() -> new RuntimeException("Room not found"));

        // if(!entity.getRoomNumber().equals(room.getRoomNumber()) && roomRepository.existsByRoomNumber(room.getRoomNumber())){
        //     throw new RuntimeException("Room number already exists");
        // }

        // entity.setRoomNumber(room.getRoomNumber());
        // entity.setRoomType(RoomType.valueOf(room.getRoomType().toUpperCase()));
        // entity.setPrice(room.getPrice());
        // entity.setStatus(RoomStatus.valueOf(room.getStatus().toUpperCase()));
        // entity.setDescription(room.getDescription());
        // entity.setUpdatedAt(LocalDateTime.now());
        // roomRepository.save(entity);
    }

    @Override
    public void deleteRoom(int id) {

    }
}
