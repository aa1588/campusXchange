package com.unt.campusxchange.items.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CreateItemResponse(
        Integer id,
        String title,
        Integer quantity,
        String description,
        BigDecimal price,
        String category,
        Integer listed_by,
        List<String> imageUrls,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
