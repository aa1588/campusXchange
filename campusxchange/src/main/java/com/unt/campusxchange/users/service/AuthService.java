package com.unt.campusxchange.users.service;

import com.unt.campusxchange.users.dto.RegisterRequest;
import com.unt.campusxchange.users.entity.AccountStatus;
import com.unt.campusxchange.users.entity.ROLE;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.repo.UserRepository;
import com.unt.campusxchange.users.security.JWTProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTProvider jwtProvider;

    private static final SecureRandom random = new SecureRandom();

    private static String generateOTP() {
        // Generate a random 4-digit number between 1000 and 9999
        int otp = random.nextInt(9000) + 1000;
        return String.valueOf(otp);
    }

    public Integer registerUser(RegisterRequest registerRequest) {
        User user = new User();
        user.setFirstname(registerRequest.firstname());
        user.setLastname(registerRequest.lastname());
        user.setEmail(registerRequest.email());
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setPhone(registerRequest.phone());
        user.setRole(ROLE.USER);
        user.setAccountStatus(AccountStatus.INACTIVE);
        user.setOtp(generateOTP());
        return userRepository.save(user).getId();
    }

}
