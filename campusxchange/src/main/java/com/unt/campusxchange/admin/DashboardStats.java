package com.unt.campusxchange.admin;

import com.unt.campusxchange.items.entity.Category;
import java.util.Map;

public record DashboardStats(
        long activeUsers,
        long inactiveUsers,
        long frozenUsers,
        long totalUsers,
        long totalCategories,
        long totalItems,
        Map<Category, Long> itemsCountByCategory) {}
