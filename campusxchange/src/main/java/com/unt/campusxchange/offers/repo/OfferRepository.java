package com.unt.campusxchange.offers.repo;

import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.offers.entity.Offer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfferRepository extends JpaRepository<Offer, Integer> {
    List<Offer> findByItem(Item item);
}
