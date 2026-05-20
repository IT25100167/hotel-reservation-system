package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff {
    private Integer id;
    private String name;
    private String phoneNumber;
    private String email;
    private String password;


}
