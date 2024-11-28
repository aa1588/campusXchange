package com.unt.campusxchange.users.dto;

public record UserDTO(
        Integer id,
        String firstname,
        String lastname,
        String email,
        String phone,
        com.unt.campusxchange.users.entity.ROLE role,
        String accountStatus) {}
