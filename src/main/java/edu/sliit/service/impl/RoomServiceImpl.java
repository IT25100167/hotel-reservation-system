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
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public void addRoom(Room room) {
        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }

        RoomEntity entity = new RoomEntity();
        entity.setRoomNumber(room.getRoomNumber());
        entity.setRoomType(RoomType.valueOf(room.getRoomType().toUpperCase()));
        entity.setPrice(room.getPrice());
        entity.setStatus(RoomStatus.valueOf(room.getStatus().toUpperCase()));
        entity.setDescription(room.getDescription());
        entity.setImage(room.getImage());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        roomRepository.save(entity);
    }

    @Override
    public List<Room> getAllRooms() {
        List<RoomEntity> roomEntities = roomRepository.findAll();
        List<Room> rooms = new ArrayList<>();
        for (RoomEntity entity : roomEntities) {
            Room room = new Room();
            room.setRoomId(entity.getRoomId());
            room.setRoomNumber(entity.getRoomNumber());
            room.setRoomType(entity.getRoomType().name());
            room.setPrice(entity.getPrice());
            room.setStatus(entity.getStatus().name());
            room.setDescription(entity.getDescription());
            room.setImage(entity.getImage());
            rooms.add(room);
        }
        return rooms;
    }
    @Override
    public Room getRoomById(Integer roomId) {
        RoomEntity entity = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        return convertToRoom(entity);
    }

    @Override
    public Room getRoomByNumber(String roomNumber) {
        RoomEntity entity = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found with number: " + roomNumber));
        return convertToRoom(entity);
    }

    @Override
    public void updateRoom(Integer roomId, Room room) {
        RoomEntity entity = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));

        // Check if room number is being changed and if new number already exists
        if (!entity.getRoomNumber().equals(room.getRoomNumber()) &&
                roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }

        entity.setRoomNumber(room.getRoomNumber());
        entity.setRoomType(RoomType.valueOf(room.getRoomType().toUpperCase()));
        entity.setPrice(room.getPrice());
        entity.setStatus(RoomStatus.valueOf(room.getStatus().toUpperCase()));
        entity.setDescription(room.getDescription());
        entity.setImage(room.getImage());
        entity.setUpdatedAt(LocalDateTime.now());

        roomRepository.save(entity);
    }

    @Override
    public void deleteRoom(Integer roomId) {
        RoomEntity entity = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        roomRepository.delete(entity);
    }

    private Room convertToRoom(RoomEntity entity) {
        Room room = new Room();
        room.setRoomId(entity.getRoomId());
        room.setRoomNumber(entity.getRoomNumber());
        room.setRoomType(entity.getRoomType().name());
        room.setPrice(entity.getPrice());
        room.setStatus(entity.getStatus().name());
        room.setDescription(entity.getDescription());
        room.setImage(entity.getImage());
        return room;
    }

}
