package com.unt.campusxchange.items.service;

import com.unt.campusxchange.items.dto.CreateItemRequest;
import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.dto.OfferRequest;
import com.unt.campusxchange.items.dto.OfferResponse;
import com.unt.campusxchange.items.dto.PaginationResponse;
import com.unt.campusxchange.items.dto.UpdateItemRequest;
import com.unt.campusxchange.items.entity.Category;
import com.unt.campusxchange.items.entity.Offer;
import com.unt.campusxchange.items.entity.item;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.items.repo.OfferRepository;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final OfferRepository offerRepository; // New repository for offers

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class); // Logger instance

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

        return new PaginationResponse<CreateItemResponse>(
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

    public OfferResponse makeOffer(OfferRequest offerRequest, String email) {
        logger.info("Received offer from user: {} for item ID: {}", email, offerRequest.getItemId());

        Item item = itemRepository.findById(offerRequest.getItemId()).orElseThrow(() -> {
            logger.error("Item not found with ID: {}", offerRequest.getItemId());
            return new ItemNotFoundException("Item not found with ID: " + offerRequest.getItemId());
        });

        Offer offer = new Offer(); // Assuming you have an Offer entity
        offer.setItem(item);
        offer.setMadeBy(email);
        offer.setOfferPrice(offerRequest.getOfferPrice()); // Assuming you have a method to get offer price

        Offer savedOffer = offerRepository.save(offer); // Save the offer
        logger.info("Offer made successfully for item ID: {} by user: {}", offerRequest.getItemId(), email);

        return new OfferResponse(savedOffer.getId(), "Offer made successfully");
    }
}
