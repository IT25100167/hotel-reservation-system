package edu.sliit.repository;

import edu.sliit.entity.StaffEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<StaffEntity,Integer> {
    boolean existsByEmail(String email);
    Optional<StaffEntity> findByEmailAndPassword(String email, String password);
}
