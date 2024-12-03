package com.unt.campusxchange.users.dto;

import jakarta.validation.constraints.Pattern;

public record UpdateProfileRequest(
        String firstname,
        String lastname,
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits") String phone) {}
