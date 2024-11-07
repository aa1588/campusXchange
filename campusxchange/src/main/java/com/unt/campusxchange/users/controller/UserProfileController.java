package com.unt.campusxchange.users.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unt.campusxchange.users.dto.ResetPasswordRequest;
import com.unt.campusxchange.users.dto.UpdateProfileRequest;
import com.unt.campusxchange.users.dto.UserProfileResponse;
import com.unt.campusxchange.users.service.UserProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profiles")
public class UserProfileController {

private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
        String currentUsername = principal.getName(); // username == email
         logger.info("Fetching profile for user: {}", currentUsername);

        try {
            UserProfileResponse userProfile = userProfileService.getUserProfile(currentUsername);
            logger.debug("Successfully fetched profile for user: {}", currentUsername);
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching profile for user {}: {}", currentUsername, e.getMessage(), e);
            throw e; // Re-throwing the exception or handle as needed
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Integer> updateProfile(
            @RequestBody @Valid UpdateProfileRequest updateProfileRequest, Principal principal) {
        String currentUsername = principal.getName();
        logger.info("Updating profile for user: {}", currentUsername);

        try {
            Integer result = userProfileService.updateProfile(updateProfileRequest, currentUsername);
            logger.debug("Profile updated for user {}: result={}", currentUsername, result);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error updating profile for user {}: {}", currentUsername, e.getMessage(), e);
            throw e; // Re-throwing or handling exception
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Integer> resetPassword(
            @RequestBody @Valid ResetPasswordRequest resetPasswordRequest, Principal principal) {
        String currentUsername = principal.getName();
         logger.info("Resetting password for user: {}", currentUsername);

        try {
            Integer result = userProfileService.resetPassword(currentUsername, resetPasswordRequest.newPassword());
            logger.debug("Password reset result for user {}: {}", currentUsername, result);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error resetting password for user {}: {}", currentUsername, e.getMessage(), e);
            throw e; // Re-throwing or handling exception
        }
    }
}
