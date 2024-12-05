package com.unt.campusxchange.wishlist.controller;

import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.wishlist.service.WishlistService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);
    private final WishlistService wishlistService;

    @PostMapping("/add/{itemId}")
    public ResponseEntity<String> addItemToWishList(@PathVariable Integer itemId, Principal principal) {
        logger.info("Adding item with ID {} to wishlist for user {}", itemId, principal.getName());
        try {
            String currentUsername = principal.getName(); // username == email
            wishlistService.addItemToWishlist(currentUsername, itemId);
            logger.info("Item with ID {} added to wishlist for user {}", itemId, currentUsername);
            return new ResponseEntity<>("Item added to wishlist.", HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error adding item with ID {} to wishlist for user {}: {}", itemId, principal.getName(), e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("items/me")
    public ResponseEntity<List<CreateItemResponse>> getUserWishlist(Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            logger.info("Fetching wishlist for user {}", currentUsername);
            List<CreateItemResponse> myWishlist = wishlistService.getMyWishlist(currentUsername);
            logger.info("Fetched {} items in the wishlist for user {}", myWishlist.size(), currentUsername);
            return new ResponseEntity<>(myWishlist, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching wishlist for user {}: {}", principal.getName(), e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<String> deleteWishlistItem(@PathVariable Integer itemId, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            logger.info("Removing item with ID {} from wishlist for user {}", itemId, currentUsername);
            wishlistService.deleteWishlistItem(currentUsername, itemId);
            logger.info("Item with ID {} removed from wishlist for user {}", itemId, currentUsername);
            return new ResponseEntity<>("Item removed from the wishlist.", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error removing item with ID {} from wishlist for user {}: {}", itemId, principal.getName(), e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
