package com.demo.parkease.entity;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    private String phone;   // ✅ ADD THIS

    @Enumerated(EnumType.STRING)
    private Role role;
}