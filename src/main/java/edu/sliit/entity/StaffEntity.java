package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "staff")
public class StaffEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(name = "name",nullable = false)
    private String name;
    @Column(name = "phone_number")
    private String phoneNum;
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @Column(name = "password",nullable = false)
    private String password;


}
