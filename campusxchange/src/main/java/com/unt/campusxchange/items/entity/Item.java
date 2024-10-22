package com.unt.campusxchange.items.entity;

import com.unt.campusxchange.users.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "offers")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EntityListeners(AuditingEntityListener.class)
public class offer {

    private static final Logger logger = LoggerFactory.getLogger(Offer.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Buyer

    @Column(nullable = false)
    private BigDecimal offeredPrice;

    @Column(nullable = false)
    private LocalDateTime offerTime = LocalDateTime.now();

    // Optional status of the offer (pending, accepted, rejected)
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OfferStatus status = OfferStatus.PENDING;

    public void makeOffer(Item item, User user, BigDecimal offeredPrice) {
        this.item = item;
        this.user = user;
        this.offeredPrice = offeredPrice;
        this.offerTime = LocalDateTime.now();
        logger.info(
                "New offer made by user: {} for item: {}, offered price: {}",
                user.getEmail(),
                item.getTitle(),
                offeredPrice);
    }
}

enum OfferStatus {
    PENDING,
    ACCEPTED,
    REJECTED
}
