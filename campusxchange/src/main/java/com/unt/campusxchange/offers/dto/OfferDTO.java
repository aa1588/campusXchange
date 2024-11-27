package com.unt.campusxchange.offers.dto;

import com.unt.campusxchange.offers.entity.OfferStatus;
import com.unt.campusxchange.offers.entity.OfferType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OfferDTO(
        Integer id,
        BigDecimal amount,
        UserDTO offeredBy,
        ItemDTO item,
        OfferStatus status,
        OfferType offerType,
        List<OfferItemDTO> offerItems, // List of item quantities
        LocalDateTime createdAt) {}
