package com.unt.campusxchange.items.controller;

import com.unt.campusxchange.items.dto.CreateItemRequest;
import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.dto.PaginationResponse;
import com.unt.campusxchange.items.dto.UpdateItemRequest;
import com.unt.campusxchange.items.service.ItemService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {
    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<CreateItemResponse> createItem(@RequestBody CreateItemRequest request, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            logger.info("Creating item for user: {}", currentUsername);
            CreateItemResponse createdItem = itemService.createItem(request, currentUsername);
            logger.info("Item created successfully for user: {}", currentUsername);
            return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating item for user: {}, error: {}", principal.getName(), e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<CreateItemResponse>> getAllItems(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "categories", required = false) List<String> selectedCategories) {
        logger.info("Fetching items for page: {}, size: {}, categories: {}", page, size, selectedCategories);
        PaginationResponse<CreateItemResponse> paginationResponse =
                itemService.getAllItems(page, size, selectedCategories);
        logger.info("Returning {} items for the given parameters", paginationResponse.getTotalElements());
        return ResponseEntity.ok(paginationResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CreateItemResponse> updateItem(
            @PathVariable Integer id, @RequestBody UpdateItemRequest request, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            logger.info("Updating item with id: {} for user: {}", id, currentUsername);
            CreateItemResponse updatedItem = itemService.updateItem(id, request, currentUsername);
            logger.info("Item with id: {} updated successfully for user: {}", id, currentUsername);
            return new ResponseEntity<>(updatedItem, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(
                    "Error updating item with id: {} for user: {}, error: {}", id, principal.getName(), e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<CreateItemResponse>> getItemsByUser(Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            List<CreateItemResponse> items = itemService.getItemsByEmail(currentUsername);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreateItemResponse> getItemById(@PathVariable Integer id) {
        try {
            CreateItemResponse itemById = itemService.getItemById(id);
            return new ResponseEntity<>(itemById, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer id, Principal principal) {
        try {
            String currentUsername = principal.getName();
            itemService.deleteItem(currentUsername, id);
            return new ResponseEntity<>("Item deleted for id-" + id, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
