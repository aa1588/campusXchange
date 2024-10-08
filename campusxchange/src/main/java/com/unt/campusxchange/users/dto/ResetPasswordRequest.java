package com.unt.campusxchange.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters")
                String newPassword) {}
