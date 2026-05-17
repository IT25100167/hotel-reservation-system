package edu.sliit.controller;

import edu.sliit.dto.Room;
import edu.sliit.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public void addRoom(@RequestBody Room room) {
        roomService.addRoom(room);
    }

    @PutMapping
    public void updateRoom(@RequestBody Room room) {
        roomService.updateRoom(room);
    }
}
