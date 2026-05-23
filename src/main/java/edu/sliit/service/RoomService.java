package edu.sliit.service;

import edu.sliit.dto.Room;

import java.util.List;

public interface RoomService {
    void addRoom(Room room);
    List<Room> getAllRooms();
    Room getRoomById(Integer roomId);
    Room getRoomByNumber(String roomNumber);
    void updateRoom(Integer roomId, Room room);
    void deleteRoom(Integer roomId);

}
