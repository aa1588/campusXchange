package com.unt.campusxchange.wishlist.repo;

import com.unt.campusxchange.wishlist.entity.WishlistItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<WishlistItem, Integer> {
    List<WishlistItem> findByUserId(Integer userId);

    Optional<WishlistItem> findByUserIdAndItemId(Integer userId, Integer itemId);

    // Delete a wishlist item by user ID and item ID
    // void deleteByUserIdAndItemId(Integer userId, Integer itemId);
}
