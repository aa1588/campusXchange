package com.unt.campusxchange.admin;

import com.unt.campusxchange.items.entity.Category;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.users.dto.UserDTO;
import com.unt.campusxchange.users.entity.AccountStatus;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.repo.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public DashboardStats getDashboardStats() {
        long activeUsers = userRepository.countByAccountStatus(AccountStatus.ACTIVE);
        long inactiveUsers = userRepository.countByAccountStatus(AccountStatus.INACTIVE);
        long frozenUsers = userRepository.countByAccountStatus(AccountStatus.FROZEN);
        long totalUsers = userRepository.count();

        // Item statistics
        long totalItems = itemRepository.count();

        // Fetch all items and calculate the distinct categories
        List<Item> items = itemRepository.findAll();
        Map<Category, Long> itemsCountByCategory = new HashMap<>();
        items.forEach(item -> itemsCountByCategory.put(
                item.getCategory(), itemsCountByCategory.getOrDefault(item.getCategory(), 0L) + 1));

        // Total distinct categories
        long totalCategories = itemsCountByCategory.size();

        // Build and return the dashboard
        return new DashboardStats(
                activeUsers, inactiveUsers, frozenUsers, totalUsers, totalCategories, totalItems, itemsCountByCategory);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getAccountStatus().name());
    }
}
