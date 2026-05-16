package edu.sliit.dto;

import edu.sliit.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Integer userId;
    private String name;
    private String email;
    private Role role;
}
