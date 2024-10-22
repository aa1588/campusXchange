package com.unt.campusxchange.items.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Getter
@Setter
public class OfferRequest {
    private static final Logger logger = LoggerFactory.getLogger(OfferRequest.class);

    @NotNull(message = "Item ID cannot be null") private Integer itemId;

    @NotNull(message = "Offer amount cannot be null") @Positive(message = "Offer amount must be greater than zero") private Double offerAmount;

    public OfferRequest(Integer itemId, Double offerAmount) {
        this.itemId = itemId;
        this.offerAmount = offerAmount;
        logger.info("Creating OfferRequest with itemId: {} and offerAmount: {}", itemId, offerAmount);
    }

    // Default constructor for serialization/deserialization
    public OfferRequest() {
        logger.info("Empty OfferRequest created.");
    }

    @Override
    public String toString() {
        return "OfferRequest{" + "itemId=" + itemId + ", offerAmount=" + offerAmount + '}';
    }
}
