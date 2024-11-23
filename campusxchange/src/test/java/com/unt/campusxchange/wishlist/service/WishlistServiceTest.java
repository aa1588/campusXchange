package com.unt.campusxchange.wishlist.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import com.unt.campusxchange.wishlist.entity.WishlistItem;
import com.unt.campusxchange.wishlist.exception.WishlistItemNotFoundException;
import com.unt.campusxchange.wishlist.repo.WishlistRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class WishlistServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private WishlistRepository wishlistRepository;

    @InjectMocks
    private WishlistService wishlistService;

    private User user;
    private Item item;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1);
        user.setEmail("test@example.com");

        item = new Item();
        item.setId(1);
        item.setTitle("Test Item");
        item.setPrice(new BigDecimal("10.00"));
    }

    @Test
    @DisplayName("Add Item to  WishList Success")
    void testAddItemToWishlist_Success() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));

        // Call method
        wishlistService.addItemToWishlist(email, itemId);

        // Verify that save was called once with a WishlistItem object
        verify(wishlistRepository, times(1)).save(any(WishlistItem.class));
    }

    @Test
    @DisplayName("Add Item to  WishList Item or Throw UserNotFound Exception")
    void testAddItemToWishlist_UserNotFound() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior: user not found
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Assert that UserNotFoundException is thrown
        assertThrows(UserNotFoundException.class, () -> {
            wishlistService.addItemToWishlist(email, itemId);
        });
    }

    @Test
    @DisplayName("Add Item to  WishList Item or Throw ItemNotFound Exception")
    void testAddItemToWishlist_ItemNotFound() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior: item not found
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(itemRepository.findById(itemId)).thenReturn(Optional.empty());

        // Assert that ItemNotFoundException is thrown
        assertThrows(ItemNotFoundException.class, () -> {
            wishlistService.addItemToWishlist(email, itemId);
        });
    }

    @Test
    @DisplayName("Add Item to  WishList Item or Throw UserAndItemNotFound Exception")
    void testAddItemToWishlist_UserAndItemNotFound() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior: user not found
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Assert that UserNotFoundException is thrown
        assertThrows(UserNotFoundException.class, () -> {
            wishlistService.addItemToWishlist(email, itemId);
        });

        // Verify that the userRepository.findByEmail() method was called
        verify(userRepository, times(1)).findByEmail(email);

        // Verify that itemRepository.findById() is not called
        verify(itemRepository, never()).findById(itemId);
    }

    @Test
    @DisplayName("Get my  WishList Item or Throw UserNotFound Exception")
    void testGetMyWishlist_UserNotFound() {
        // Given
        String email = "test@example.com";

        // Mock behavior: user not found
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Assert that UserNotFoundException is thrown
        assertThrows(UserNotFoundException.class, () -> {
            wishlistService.getMyWishlist(email);
        });
    }

    @Test
    @DisplayName("Delete WishList Item Success")
    void testDeleteWishlistItem_Success() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior: user found
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Mock behavior: item found
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));

        // Mock behavior: wishlist item found
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setItem(item);
        when(wishlistRepository.findByUserIdAndItemId(user.getId(), item.getId()))
                .thenReturn(Optional.of(wishlistItem));

        // Call method
        wishlistService.deleteWishlistItem(email, itemId);

        // Verify that the wishlist item was deleted
        verify(wishlistRepository, times(1)).delete(wishlistItem);
    }

    @Test
    @DisplayName("Delete WishList Item or Throw UserNotFound Exception")
    void testDeleteWishlistItem_UserNotFound() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior: user not found
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Assert that UserNotFoundException is thrown
        assertThrows(UserNotFoundException.class, () -> {
            wishlistService.deleteWishlistItem(email, itemId);
        });
    }

    @Test
    @DisplayName("Delete WishList Item or Throw ItemNotFound Exception")
    void testDeleteWishlistItem_ItemNotFound() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior: user found
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Mock behavior: item not found
        when(itemRepository.findById(itemId)).thenReturn(Optional.empty());

        // Assert that ItemNotFoundException is thrown
        assertThrows(ItemNotFoundException.class, () -> {
            wishlistService.deleteWishlistItem(email, itemId);
        });
    }

    @Test
    @DisplayName("Delete WishList Item or Throw WishlistItemNotFound Exception")
    void testDeleteWishlistItem_WishlistItemNotFound() {
        // Given
        String email = "test@example.com";
        Integer itemId = 1;

        // Mock behavior: user found
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Mock behavior: item found
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));

        // Mock behavior: wishlist item not found
        when(wishlistRepository.findByUserIdAndItemId(user.getId(), item.getId()))
                .thenReturn(Optional.empty());

        // Assert that WishlistItemNotFoundException is thrown
        assertThrows(WishlistItemNotFoundException.class, () -> {
            wishlistService.deleteWishlistItem(email, itemId);
        });
    }
}
