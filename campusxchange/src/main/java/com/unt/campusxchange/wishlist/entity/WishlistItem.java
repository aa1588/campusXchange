package com.unt.campusxchange.wishlist.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.users.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wishlist_items")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    @JsonBackReference
    private Item item;
}
