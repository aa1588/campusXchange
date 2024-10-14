package com.unt.campusxchange.items.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record UpdateItemRequest(
        @NotBlank(message = "Title must not be blank") String title,
        @NotNull(message = "Quantity must not be null") @Min(value = 0, message = "Quantity must be at least 0")
                Integer quantity,
        @Size(max = 500, message = "Description cannot exceed 500 characters") String description,
        @NotNull(message = "Price must not be null") @DecimalMin(value = "0.00", message = "Price must be greater than or equal to zero")
                BigDecimal price,
        @NotBlank(message = "Category must not be blank") String category,
        @Size(min = 1, message = "At least one image URL is required") List<String> imageUrls) {}
