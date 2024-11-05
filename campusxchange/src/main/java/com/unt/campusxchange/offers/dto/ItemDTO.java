package com.unt.campusxchange.offers.dto;

import java.math.BigDecimal;
import java.util.List;

public record ItemDTO(
        Integer id,
        String title,
        Integer quantity,
        String description,
        BigDecimal price,
        String category,
        List<String> imageUrls) {}
