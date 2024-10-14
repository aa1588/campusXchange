package com.unt.campusxchange.items.service;

import com.unt.campusxchange.items.entity.Category;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    public List<String> getAllCategories() {
        return Arrays.stream(Category.values()).map(Category::name).collect(Collectors.toList());
    }
}
