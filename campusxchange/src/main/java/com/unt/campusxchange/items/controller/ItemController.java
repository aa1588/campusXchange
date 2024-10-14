package com.unt.campusxchange.items.controller;

import com.unt.campusxchange.items.dto.CreateItemRequest;
import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.dto.PaginationResponse;
import com.unt.campusxchange.items.dto.UpdateItemRequest;
import com.unt.campusxchange.items.service.ItemService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<CreateItemResponse> createItem(@RequestBody CreateItemRequest request, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            CreateItemResponse createdItem = itemService.createItem(request, currentUsername);
            return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<CreateItemResponse>> getAllItems(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "categories", required = false) List<String> selectedCategories) {

        PaginationResponse<CreateItemResponse> paginationResponse =
                itemService.getAllItems(page, size, selectedCategories);
        return ResponseEntity.ok(paginationResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CreateItemResponse> updateItem(
            @PathVariable Integer id, @RequestBody UpdateItemRequest request, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            CreateItemResponse updatedItem = itemService.updateItem(id, request, currentUsername);
            return new ResponseEntity<>(updatedItem, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
