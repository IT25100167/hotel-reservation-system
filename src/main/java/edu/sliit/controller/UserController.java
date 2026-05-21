package edu.sliit.controller;


import edu.sliit.dto.User;
import edu.sliit.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    @PostMapping("/add")
    public void addUser(@RequestBody User user){
        userService.addUsers(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAll(){
        List<User> userList=userService.getUser();
        return ResponseEntity.ok(userList);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Integer id){
        userService.deleteById(id);
    }
    @PutMapping
    public void updateUser(@RequestBody User user){userService.updateUser(user);}
    @GetMapping("/search/{id}")
    public  ResponseEntity<User> search(@PathVariable int id){
        return ResponseEntity.ok(userService.findById(id));
    }

}
