package com.unt.campusxchange.users.dto;

import com.unt.campusxchange.users.validator.UniqueEmail;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "First name is required") String firstname,
        @NotBlank(message = "First name is required") String lastname,

        @Email(message = "Email must be valid")
        @NotBlank(message = "Email is required")
        @UniqueEmail String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters") String password,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits") String phone
)
{}
