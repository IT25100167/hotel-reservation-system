package edu.sliit.repository;

import edu.sliit.entity.StaffEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<StaffEntity,Integer> {

    boolean existsByEmail(String attr0);
}
