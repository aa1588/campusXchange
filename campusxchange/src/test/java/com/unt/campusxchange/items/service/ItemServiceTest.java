package com.unt.campusxchange.items.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.unt.campusxchange.items.dto.CreateItemRequest;
import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.items.dto.PaginationResponse;
import com.unt.campusxchange.items.dto.UpdateItemRequest;
import com.unt.campusxchange.items.entity.Category;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.notification.sse.NotificationService;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;

public class ItemServiceTest {

    @InjectMocks
    private ItemService itemService;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    private User user;
    private Item item;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1);
        user.setEmail("test@example.com");

        item = new Item();
        item.setId(1);
        item.setTitle("Test Item");
        item.setQuantity(10);
        item.setDescription("Description");
        item.setPrice(BigDecimal.valueOf(100.0));
        item.setCategory(Category.ELECTRONICS);
        item.setUser(user);
        item.setImageUrls(List.of("url1", "url2"));
    }

    @Test
    @DisplayName("Should Create Item for a user")
    void testCreateItem() {
        CreateItemRequest request = new CreateItemRequest(
                "Test Item", 10, "Description", BigDecimal.valueOf(100.0), "ELECTRONICS", List.of("url1", "url2"));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(itemRepository.save(any(Item.class))).thenReturn(item);

        CreateItemResponse response = itemService.createItem(request, "test@example.com");

        assertThat(response).isNotNull();
        assertThat(response.title()).isEqualTo("Test Item");
        assertThat(response.category()).isEqualTo("ELECTRONICS");
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    @DisplayName("Should throw UserNotFound Exception")
    void testCreateItem_UserNotFound() {
        CreateItemRequest request = new CreateItemRequest(
                "Test Item", 10, "Description", BigDecimal.valueOf(100.0), "ELECTRONICS", List.of("url1", "url2"));

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.createItem(request, "unknown@example.com"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found");

        verify(itemRepository, never()).save(any(Item.class));
    }

    @Test
    @DisplayName("Should Return all items available")
    void testGetAllItems() {
        Page<Item> itemPage = new PageImpl<>(List.of(item));

        when(itemRepository.findAll(any(PageRequest.class))).thenReturn(itemPage);

        PaginationResponse<CreateItemResponse> response = itemService.getAllItems(0, 10, null);

        assertThat(response).isNotNull();
        assertThat(response.getTotalElements()).isEqualTo(1);
        assertThat(response.getData().getFirst().title()).isEqualTo("Test Item");
        verify(itemRepository, times(1)).findAll(any(PageRequest.class));
    }

    @Test
    @DisplayName("Should Update Item and return updated item details")
    void testUpdateItem_NotFound() {
        UpdateItemRequest request = new UpdateItemRequest(
                "Updated Title", 5, "Updated Description", BigDecimal.valueOf(200.0), "BOOKS", List.of("url3", "url4"));

        when(itemRepository.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.updateItem(999, request, "test@example.com"))
                .isInstanceOf(ItemNotFoundException.class)
                .hasMessage("Item not found");

        verify(itemRepository, never()).save(any(Item.class));
    }

    @Test
    @DisplayName("Should throw access Denied exception for unauthorized user updating item")
    void testUpdateItem_AccessDenied() {
        UpdateItemRequest request = new UpdateItemRequest(
                "Updated Title", 5, "Updated Description", BigDecimal.valueOf(200.0), "BOOKS", List.of("url3", "url4"));

        User otherUser = new User();
        otherUser.setEmail("other@example.com");

        item.setUser(otherUser);

        when(itemRepository.findById(1)).thenReturn(Optional.of(item));

        assertThatThrownBy(() -> itemService.updateItem(1, request, "test@example.com"))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("You do not have permission to update this item");

        verify(itemRepository, never()).save(any(Item.class));
    }
}
