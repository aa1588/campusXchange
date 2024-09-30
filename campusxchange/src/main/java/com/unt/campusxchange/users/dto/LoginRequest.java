package com.unt.campusxchange.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @Email(message = "Email must be valid") @NotBlank(message = "Email is required") String email,
        @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters")
                String password) {}
