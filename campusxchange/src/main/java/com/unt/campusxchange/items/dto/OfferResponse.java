package com.unt.campusxchange.items.dto;

import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Getter
@Setter
public class OfferResponse {
    private static final Logger logger = LoggerFactory.getLogger(OfferResponse.class);

    private Integer offerId;
    private String status; // e.g., "PENDING", "ACCEPTED", "REJECTED"
    private String message;

    public OfferResponse(Integer offerId, String status, String message) {
        this.offerId = offerId;
        this.status = status;
        this.message = message;
        logger.info("OfferResponse created with offerId: {}, status: {}, message: {}", offerId, status, message);
    }

    // Default constructor for serialization/deserialization
    public OfferResponse() {
        logger.info("Empty OfferResponse created.");
    }

    @Override
    public String toString() {
        return "OfferResponse{" + "offerId="
                + offerId + ", status='"
                + status + '\'' + ", message='"
                + message + '\'' + '}';
    }
}
