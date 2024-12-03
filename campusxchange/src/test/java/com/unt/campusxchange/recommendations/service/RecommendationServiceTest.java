package com.unt.campusxchange.recommendations.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.entity.Category;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import com.unt.campusxchange.wishlist.entity.WishlistItem;
import com.unt.campusxchange.wishlist.exception.WishlistItemNotFoundException;
import com.unt.campusxchange.wishlist.repo.WishlistRepository;
import java.math.BigDecimal;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class RecommendationServiceTest {

    @InjectMocks
    private RecommendationService recommendationService;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private UserRepository userRepository;

    private User user;
    private Item item1;
    private Item item2;
    private WishlistItem wishlistItem1;
    private WishlistItem wishlistItem2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create user
        user = new User();
        user.setId(1);
        user.setEmail("test@example.com");

        // Create items
        item1 = new Item();
        item1.setId(1);
        item1.setTitle("Item 1");
        item1.setCategory(Category.ELECTRONICS);
        item1.setPrice(BigDecimal.valueOf(100));
        item1.setUser(user);

        item2 = new Item();
        item2.setId(2);
        item2.setTitle("Item 2");
        item2.setCategory(Category.TEXTBOOKS);
        item2.setPrice(BigDecimal.valueOf(50));
        item2.setUser(user);

        // Create wishlist items
        wishlistItem1 = new WishlistItem();
        wishlistItem1.setId(1);
        wishlistItem1.setItem(item1);
        wishlistItem1.setUser(user);

        wishlistItem2 = new WishlistItem();
        wishlistItem2.setId(2);
        wishlistItem2.setItem(item2);
        wishlistItem2.setUser(user);
    }

    @Test
    @DisplayName("Should throw UserNotFoundException when user is not found")
    void testGetRecommendedItemsForUser_UserNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recommendationService.getRecommendedItemsForUser("test@example.com"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found");
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when user has no wishlist items")
    void testGetRecommendedItemsForUser_NoWishlistItems() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.findByUserId(user.getId())).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> recommendationService.getRecommendedItemsForUser("test@example.com"))
                .isInstanceOf(WishlistItemNotFoundException.class)
                .hasMessage("No wishlist items found for user ID: 1");
    }

    @Test
    @DisplayName("Should calculate similarity correctly")
    void testCalculateSimilarity() {
        // Testing the similarity calculation between two items
        double similarity = recommendationService.calculateSimilarity(item1, item2);

        // Check that the similarity score is between 0 and 1 based on category and price
        assertThat(similarity).isBetween(0.0, 1.0);
    }

    @Test
    @DisplayName("Should return an empty list if no items match the wishlist")
    void testGetRecommendedItemsForUser_NoMatchingItems() {
        // Setting up wishlist with item1 and item2, but no matching items in the database
        List<WishlistItem> wishlistItems = List.of(wishlistItem1, wishlistItem2);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.findByUserId(user.getId())).thenReturn(wishlistItems);
        when(itemRepository.findAll()).thenReturn(Collections.emptyList());

        List<CreateItemResponse> recommendedItems =
                recommendationService.getRecommendedItemsForUser("test@example.com");

        assertThat(recommendedItems).isEmpty(); // No matching items
    }
}
