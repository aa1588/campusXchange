package com.unt.campusxchange.users.service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailServiceImpl.class);

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("Attempting to load user by email: {}", email);

        var user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("Email not found: {}", email);
                    return new UsernameNotFoundException("Email Not Found- " + email);
                });

        logger.info("User loaded successfully: {}", email);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), true, true, true, true, getAuthorities(user));
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
         logger.debug("Assigning role to user: {}", user.getEmail());
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()));
    }

    // New method to get items for sale
    public List<String> getItemsForSale() {
        logger.info("Fetching items for sale");
        return List.of("Item 1", "Item 2", "Item 3"); // Sample items
    }
}
