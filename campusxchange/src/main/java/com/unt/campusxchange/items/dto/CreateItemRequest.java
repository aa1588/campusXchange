package com.unt.campusxchange.items.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record CreateItemRequest(
        @NotBlank(message = "Title is mandatory") String title,
        @NotNull(message = "Quantity is mandatory") @Min(value = 1, message = "Quantity must be at least 1")
                Integer quantity,
        @Size(max = 500, message = "Description cannot exceed 500 characters") String description,
        @NotNull(message = "Price is mandatory") @DecimalMin(value = "0.01", message = "Price must be greater than zero")
                BigDecimal price,
        @NotBlank(message = "Category is mandatory") String category,
        @Size(min = 1, message = "At least one image URL is required") List<String> imageUrls) {}
