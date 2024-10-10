package com.unt.campusxchange.users.controller;

import com.unt.campusxchange.users.dto.ResetPasswordRequest;
import com.unt.campusxchange.users.dto.UpdateProfileRequest;
import com.unt.campusxchange.users.dto.UserProfileResponse;
import com.unt.campusxchange.users.service.UserProfileService;
import java.security.Principal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
        String currentUsername = principal.getName(); // username == email
        UserProfileResponse userProfile = userProfileService.getUserProfile(currentUsername);
        return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<Integer> updateProfile(
            @RequestBody @Valid UpdateProfileRequest updateProfileRequest, Principal principal) {
        String currentUsername = principal.getName();
        Integer i = userProfileService.updateProfile(updateProfileRequest, currentUsername);
        return new ResponseEntity<>(i, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Integer> resetPassword(@RequestBody @Valid ResetPasswordRequest resetPasswordRequest, Principal principal){
        String currentUsername = principal.getName();
        Integer i = userProfileService.resetPassword(currentUsername, resetPasswordRequest.newPassword());
        return new ResponseEntity<>(i, HttpStatus.OK);
    }
}
