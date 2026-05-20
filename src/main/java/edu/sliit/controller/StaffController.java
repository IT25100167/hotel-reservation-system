package edu.sliit.controller;
import edu.sliit.dto.Staff;
import edu.sliit.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/add")
    public void addStaff(@RequestBody Staff staff) {
        staffService.addStaff(staff);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Staff>> getAll() {

        List<Staff> staffList = staffService.getStaff();

        return ResponseEntity.ok(staffList);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteStaff(@PathVariable Integer id) {

        staffService.deleteById(id);
    }

    @PutMapping
    public void updateStaff(@RequestBody Staff staff) {

        staffService.updateStaff(staff);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<Staff> search(@PathVariable int id) {

        return ResponseEntity.ok(staffService.findById(id));
    }
}
