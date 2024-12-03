package com.unt.campusxchange.users.service;

import com.unt.campusxchange.users.dto.UpdateProfileRequest;
import com.unt.campusxchange.users.dto.UserProfileResponse;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getUserProfile(String currentUsername) {
        User user = userRepository
                .findByEmail(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
        UserProfileResponse userProfile =
                new UserProfileResponse(user.getFirstname(), user.getLastname(), user.getEmail(), user.getPhone());
        return userProfile;
    }

    public Integer updateProfile(UpdateProfileRequest updateProfileRequest, String currentUsername) {
        User user = userRepository
                .findByEmail(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
        user.setFirstname(updateProfileRequest.firstname());
        user.setLastname(updateProfileRequest.lastname());
        user.setPhone(updateProfileRequest.phone());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user).getId();
    }

    public Integer resetPassword(String currentUsername, String newPassword) {
        User user = userRepository
                .findByEmail(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user).getId();
    }
}
