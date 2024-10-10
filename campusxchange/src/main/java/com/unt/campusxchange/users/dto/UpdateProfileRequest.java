package com.unt.campusxchange.users.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        String firstname,
        String lastname,
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits") String phone) {}
