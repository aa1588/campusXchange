package com.unt.campusxchange.wishlist.service;

import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import com.unt.campusxchange.wishlist.entity.WishlistItem;
import com.unt.campusxchange.wishlist.exception.WishlistItemNotFoundException;
import com.unt.campusxchange.wishlist.repo.WishlistRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public void addItemToWishlist(String email, Integer id) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("Item not found"));
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setUser(user);
        wishlistItem.setItem(item);
        wishlistRepository.save(wishlistItem);
    }

    public List<CreateItemResponse> getMyWishlist(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        return wishlistRepository.findByUserId(user.getId()).stream()
                .map(wishlistItem -> {
                    Item item = wishlistItem.getItem();
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
                })
                .collect(Collectors.toList());
    }

    public void deleteWishlistItem(String email, Integer itemId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ItemNotFoundException("Item not found"));

        WishlistItem wishlistItem = wishlistRepository
                .findByUserIdAndItemId(user.getId(), item.getId())
                .orElseThrow(() -> new WishlistItemNotFoundException("Item not found in wishlist"));

        wishlistRepository.delete(wishlistItem);
    }
}
