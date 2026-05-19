package edu.sliit.controller;

import edu.sliit.dto.LoginRequest;
import edu.sliit.dto.LoginResponse;
import edu.sliit.dto.User;
import edu.sliit.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userService.addUsers(user);
        return ResponseEntity.ok("Registered successfully");
    }
}
