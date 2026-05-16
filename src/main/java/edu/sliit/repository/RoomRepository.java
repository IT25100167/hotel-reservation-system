package edu.sliit.repository;

import edu.sliit.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<RoomEntity,Integer> {
    boolean existsByRoomNumber(String roomNumber);
    Optional<RoomEntity> findByRoomNumber(String roomNumber);
}
