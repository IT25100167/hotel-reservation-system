package edu.sliit.service.impl;

import edu.sliit.dto.Staff;
import edu.sliit.entity.StaffEntity;
import edu.sliit.repository.StaffRepository;
import edu.sliit.service.StaffService;
import edu.sliit.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;

    @Override
    public void addStaff(Staff staff) {

        // Duplicate email validation
        if (staffRepository.existsByEmail(staff.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Email validation
        if (!ValidationUtil.isValidEmail(staff.getEmail())) {
            throw new RuntimeException("Invalid email");
        }

        // Phone validation
        if (!ValidationUtil.isValidPhoneNumber(staff.getPhoneNumber())) {
            throw new RuntimeException("Invalid phone number");
        }

        // Password validation
        if (!ValidationUtil.isValidPassword(staff.getPassword())) {
            throw new RuntimeException("Password must contain at least 6 characters");
        }

        StaffEntity staffEntity = new StaffEntity();

        staffEntity.setId(staff.getId());
        staffEntity.setName(staff.getName());
        staffEntity.setPhoneNum(staff.getPhoneNumber());
        staffEntity.setEmail(staff.getEmail());
        staffEntity.setPassword(staff.getPassword());

        staffRepository.save(staffEntity);
    }

    @Override
    public List<Staff> getStaff() {

        List<StaffEntity> staffEntities = staffRepository.findAll();
        List<Staff> staffs = new ArrayList<>();

        for (StaffEntity entity : staffEntities) {

            Staff staff = new Staff();

            staff.setId(entity.getId());
            staff.setName(entity.getName());
            staff.setPhoneNumber(entity.getPhoneNum());
            staff.setEmail(entity.getEmail());
            staff.setPassword(entity.getPassword());

            staffs.add(staff);
        }

        return staffs;
    }

    @Override
    public void deleteById(Integer id) {

        StaffEntity staffEntity = staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Staff not found"));

        staffRepository.delete(staffEntity);
    }

    @Override
    public void updateStaff(Staff staff) {

        StaffEntity existingStaff = staffRepository.findById(staff.getId())
                .orElseThrow(() ->
                        new RuntimeException("Staff not found"));

        // Duplicate email validation
        if (!existingStaff.getEmail().equals(staff.getEmail())
                && staffRepository.existsByEmail(staff.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        // Email validation
        if (!ValidationUtil.isValidEmail(staff.getEmail())) {
            throw new RuntimeException("Invalid email");
        }

        // Phone validation
        if (!ValidationUtil.isValidPhoneNumber(staff.getPhoneNumber())) {
            throw new RuntimeException("Invalid phone number");
        }

        // Password validation
        if (!ValidationUtil.isValidPassword(staff.getPassword())) {
            throw new RuntimeException("Password must contain at least 6 characters");
        }

        existingStaff.setName(staff.getName());
        existingStaff.setPhoneNum(staff.getPhoneNumber());
        existingStaff.setEmail(staff.getEmail());
        existingStaff.setPassword(staff.getPassword());

        staffRepository.save(existingStaff);
    }

    @Override
    public Staff findById(int id) {

        StaffEntity staffEntity = staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Staff not found"));

        Staff staff = new Staff();

        staff.setId(staffEntity.getId());
        staff.setName(staffEntity.getName());
        staff.setPhoneNumber(staffEntity.getPhoneNum());
        staff.setEmail(staffEntity.getEmail());
        staff.setPassword(staffEntity.getPassword());

        return staff;
    }
}