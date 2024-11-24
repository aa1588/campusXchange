package com.unt.campusxchange.items.service;

import com.unt.campusxchange.items.dto.CreateItemRequest;
import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.dto.PaginationResponse;
import com.unt.campusxchange.items.dto.UpdateItemRequest;
import com.unt.campusxchange.items.entity.Category;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.notification.sse.Notification;
import com.unt.campusxchange.notification.sse.NotificationService;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CreateItemResponse createItem(CreateItemRequest request, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        Item item = new Item();
        item.setTitle(request.title());
        item.setQuantity(request.quantity());
        item.setDescription(request.description());
        item.setPrice(request.price());
        item.setCategory(Category.valueOf(request.category())); // Convert to enum
        item.setUser(user);
        item.setImageUrls(request.imageUrls());
        Item savedItem = itemRepository.save(item);

        /* Test for SSE-Notification System */
        Notification notification = new Notification("Product Added to the Marketplace", Instant.now());

        notificationService.sendNotification("amritadhikari@my.unt.edu", notification);
        /* Test for SSE-Notification System */


        return new CreateItemResponse(
                savedItem.getId(),
                savedItem.getTitle(),
                savedItem.getQuantity(),
                savedItem.getDescription(),
                savedItem.getPrice(),
                savedItem.getCategory().name(),
                savedItem.getUser().getId(),
                savedItem.getImageUrls(),
                savedItem.getCreatedAt(),
                savedItem.getUpdatedAt());
    }

    public PaginationResponse<CreateItemResponse> getAllItems(int page, int size, List<String> selectedCategories) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Item> itemPage;

        if (selectedCategories == null || selectedCategories.isEmpty()) {
            // If no categories are selected, fetch all items
            itemPage = itemRepository.findAll(pageable);
        } else {
            // Fetch items based on selected categories
            itemPage = itemRepository.findByCategoryIn(selectedCategories, pageable);
        }

        List<Item> items = itemPage.getContent(); // Fetch the list of Item objects

        List<CreateItemResponse> itemResponses = items.stream()
                .map(item -> new CreateItemResponse(
                        item.getId(),
                        item.getTitle(),
                        item.getQuantity(),
                        item.getDescription(),
                        item.getPrice(),
                        item.getCategory().name(),
                        item.getUser().getId(),
                        item.getImageUrls(),
                        item.getCreatedAt(),
                        item.getUpdatedAt()))
                .toList();

        return new PaginationResponse<>(
                itemResponses,
                itemPage.getTotalElements(),
                itemPage.getTotalPages(),
                itemPage.getNumber(),
                itemPage.getSize(),
                itemPage.hasNext(),
                itemPage.hasPrevious());
    }

    public CreateItemResponse updateItem(Integer id, UpdateItemRequest request, String email) {
        // Find the existing item
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("Item not found"));

        // Optional: Verify that the user is the owner of the item
        if (!item.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to update this item");
        }

        // Update the item properties
        item.setTitle(request.title());
        item.setQuantity(request.quantity());
        item.setDescription(request.description());
        item.setPrice(request.price());
        item.setCategory(Category.valueOf(request.category())); // Convert to enum
        item.setImageUrls(request.imageUrls());

        // Save the updated item
        Item updatedItem = itemRepository.save(item);

        return new CreateItemResponse(
                updatedItem.getId(),
                updatedItem.getTitle(),
                updatedItem.getQuantity(),
                updatedItem.getDescription(),
                updatedItem.getPrice(),
                updatedItem.getCategory().name(),
                updatedItem.getUser().getId(), // Include only the user ID
                updatedItem.getImageUrls(),
                updatedItem.getCreatedAt(),
                updatedItem.getUpdatedAt());
    }

    public List<CreateItemResponse> getItemsByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        List<Item> items = itemRepository.findByUser(user);

        return items.stream()
                .map(item -> new CreateItemResponse(
                        item.getId(),
                        item.getTitle(),
                        item.getQuantity(),
                        item.getDescription(),
                        item.getPrice(),
                        item.getCategory().toString(),
                        item.getUser().getId(),
                        item.getImageUrls(),
                        item.getCreatedAt(),
                        item.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    public CreateItemResponse getItemById(Integer id) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("Item not found"));
        return new CreateItemResponse(
                item.getId(),
                item.getTitle(),
                item.getQuantity(),
                item.getDescription(),
                item.getPrice(),
                item.getCategory().toString(),
                item.getUser().getId(),
                item.getImageUrls(),
                item.getCreatedAt(),
                item.getUpdatedAt());
    }

    public void deleteItem(String email, Integer itemId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ItemNotFoundException("Item not found"));
        itemRepository.delete(item);
    }
}
