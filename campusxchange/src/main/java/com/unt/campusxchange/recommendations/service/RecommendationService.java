package com.unt.campusxchange.recommendations.service;

import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import com.unt.campusxchange.wishlist.entity.WishlistItem;
import com.unt.campusxchange.wishlist.repo.WishlistRepository;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private final ItemRepository itemRepository;
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    public RecommendationService(
            ItemRepository itemRepository, WishlistRepository wishlistRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
    }

    public List<CreateItemResponse> getRecommendedItemsForUser(String email) {

        // fetch user
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        // Fetch wishlist items for the user
        List<WishlistItem> wishlistItems = wishlistRepository.findByUserId(user.getId());
        if (wishlistItems.isEmpty()) {
            throw new IllegalArgumentException("No wishlist items found for user ID: " + user.getId());
        }

        // Extract items from wishlist
        List<Item> wishlistItemsList =
                wishlistItems.stream().map(WishlistItem::getItem).toList();

        // Fetch all items from the database
        List<Item> allItems = itemRepository.findAll();

        // Filter out items already in the wishlist
        Set<Integer> wishlistItemIds =
                wishlistItemsList.stream().map(Item::getId).collect(Collectors.toSet());

        // Map to hold aggregated similarity scores
        Map<Item, Double> similarityScores = new HashMap<>();

        for (Item wishlistItem : wishlistItemsList) {
            for (Item otherItem : allItems) {
                // Exclude items already in the wishlist
                if (!wishlistItemIds.contains(otherItem.getId())) {
                    double similarity = calculateSimilarity(wishlistItem, otherItem);
                    similarityScores.merge(otherItem, similarity, Double::sum);
                }
            }
        }

        // Sort items by similarity in descending order
        List<Item> recommendedItems = similarityScores.entrySet().stream()
                .sorted(Map.Entry.<Item, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();

        // Convert to CreateItemResponse
        return recommendedItems.stream().map(this::convertToCreateItemResponse).collect(Collectors.toList());
    }

    private double calculateSimilarity(Item item1, Item item2) {
        // Compare categories
        double categorySimilarity = item1.getCategory() == item2.getCategory() ? 1.0 : 0.0;

        // Compare prices
        BigDecimal priceDiff = item1.getPrice().subtract(item2.getPrice()).abs();
        double priceSimilarity = 1.0 / (1.0 + priceDiff.doubleValue());

        // Weighted similarity
        return 0.7 * categorySimilarity + 0.3 * priceSimilarity;
    }

    private CreateItemResponse convertToCreateItemResponse(Item item) {
        return new CreateItemResponse(
                item.getId(),
                item.getTitle(),
                item.getQuantity(),
                item.getDescription(),
                item.getPrice(),
                item.getCategory().name(),
                item.getUser().getId(),
                item.getImageUrls(),
                item.getCreatedAt(),
                item.getUpdatedAt());
    }
}
