package com.unt.campusxchange.offers.repo;

import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.offers.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Integer> {
    List<Offer> findByItem(Item item);
}
