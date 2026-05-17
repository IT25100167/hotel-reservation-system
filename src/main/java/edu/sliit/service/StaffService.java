package edu.sliit.service;

import edu.sliit.dto.Staff;
import edu.sliit.dto.User;

import java.util.List;

public interface StaffService {
    void addStaff(Staff staff);
    List<Staff> getStaff();
    void deleteById(Integer id);
    void updateStaff(Staff staff);
    Staff findById(int id);
}
