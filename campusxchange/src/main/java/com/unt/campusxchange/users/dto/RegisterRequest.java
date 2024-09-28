package com.unt.campusxchange.users.dto;

public record RegisterRequest(String firstname, String lastname, String email, String password, String phone) {
}
