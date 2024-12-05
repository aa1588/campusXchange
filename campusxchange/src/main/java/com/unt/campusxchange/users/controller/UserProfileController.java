package com.unt.campusxchange.users.controller;

import com.unt.campusxchange.users.dto.ResetPasswordRequest;
import com.unt.campusxchange.users.dto.UpdateProfileRequest;
import com.unt.campusxchange.users.dto.UserProfileResponse;
import com.unt.campusxchange.users.service.UserProfileService;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        UserProfileResponse userProfile = userProfileService.getUserProfile(currentUsername);
        logger.info("Profile fetched successfully for user: {}", currentUsername);
        return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<Integer> updateProfile(
            @RequestBody @Valid UpdateProfileRequest updateProfileRequest, Principal principal) {
        String currentUsername = principal.getName();
        logger.info("Updating profile for user: {}", currentUsername);
        Integer i = userProfileService.updateProfile(updateProfileRequest, currentUsername);
        logger.info("Profile updated successfully for user: {}, updated records id: {}", currentUsername, i);
        return new ResponseEntity<>(i, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Integer> resetPassword(
            @RequestBody @Valid ResetPasswordRequest resetPasswordRequest, Principal principal) {
        String currentUsername = principal.getName();
        logger.info("Resetting password for user: {}", currentUsername);
        Integer i = userProfileService.resetPassword(currentUsername, resetPasswordRequest.newPassword());
        logger.info("Password reset successfully for user: {}, updated records id: {}", currentUsername, i);
        return new ResponseEntity<>(i, HttpStatus.OK);
    }
}
