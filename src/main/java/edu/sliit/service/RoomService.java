package edu.sliit.service;

import edu.sliit.dto.Room;

import java.util.List;

public interface RoomService {
    void addRoom(Room room);
    List<Room> getAllRooms();
}
