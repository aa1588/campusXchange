package com.unt.campusxchange.wishlist.controller;

import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.wishlist.service.WishlistService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add/{itemId}")
    public ResponseEntity<String> addItemToWishList(@PathVariable Integer itemId, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            wishlistService.addItemToWishlist(currentUsername, itemId);
            return new ResponseEntity<>("Item added to wishlist.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("items/me")
    public ResponseEntity<List<CreateItemResponse>> getUserWishlist(Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            List<CreateItemResponse> myWishlist = wishlistService.getMyWishlist(currentUsername);
            return new ResponseEntity<>(myWishlist, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<String> deleteWishlistItem(@PathVariable Integer itemId, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            wishlistService.deleteWishlistItem(currentUsername, itemId);
            return new ResponseEntity<>("Item removed from the wishlist.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
