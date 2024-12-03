package com.unt.campusxchange.items.repo;

import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.users.entity.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    Page<Item> findByCategoryIn(List<String> categories, Pageable pageable);

    List<Item> findByUser(User user);

    //    Page<Item> findByCategoryInAndQuantityGreaterThan(List<String> categories, int quantity, Pageable pageable);
    //
    //    Page<Item> findByQuantityGreaterThan(int quantity, Pageable pageable);
}
