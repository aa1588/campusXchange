package com.unt.campusxchange.users.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.unt.campusxchange.users.dto.UpdateProfileRequest;
import com.unt.campusxchange.users.dto.UserProfileResponse;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileService {

     private static final Logger logger = LoggerFactory.getLogger(UserProfileService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getUserProfile(String currentUsername) {
        logger.info("Fetching user profile for username: {}", currentUsername);
        User user = userRepository
                .findByEmail(currentUsername)
                .orElseThrow(() -> {
                    logger.error("User not found for username: {}", currentUsername);
                    return new UserNotFoundException("User not found.");
                });
        UserProfileResponse userProfile =
                new UserProfileResponse(user.getFirstname(), user.getLastname(), user.getEmail(), user.getPhone());
                logger.info("User profile retrieved successfully for username: {}", currentUsername);
        return userProfile;
    }

    public Integer updateProfile(UpdateProfileRequest updateProfileRequest, String currentUsername) {
         logger.info("Updating profile for username: {}", currentUsername);
        User user = userRepository
                .findByEmail(currentUsername)
                .orElseThrow(() -> {
                    logger.error("User not found for username: {}", currentUsername);
                    return new UserNotFoundException("User not found.");
                });
        user.setFirstname(updateProfileRequest.firstname());
        user.setLastname(updateProfileRequest.lastname());
        user.setPhone(updateProfileRequest.phone());
        user.setUpdatedAt(LocalDateTime.now());
         Integer userId = userRepository.save(user).getId();
        logger.info("User profile updated successfully for username: {} with ID: {}", currentUsername, userId);
        return userId;
    }

    public Integer resetPassword(String currentUsername, String newPassword) {
        logger.info("Resetting password for username: {}", currentUsername);
        User user = userRepository
                .findByEmail(currentUsername)
                .orElseThrow(() -> {
                    logger.error("User not found for username: {}", currentUsername);
                    return new UserNotFoundException("User not found.");
                });
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        Integer userId = userRepository.save(user).getId();
        logger.info("Password reset successfully for username: {} with ID: {}", currentUsername, userId);
        return userId;
    }
}
