package com.unt.campusxchange.users.service;

import com.unt.campusxchange.notification.EmailService;
import com.unt.campusxchange.users.dto.LoginRequest;
import com.unt.campusxchange.users.dto.LoginResponse;
import com.unt.campusxchange.users.dto.RegisterRequest;
import com.unt.campusxchange.users.entity.AccountStatus;
import com.unt.campusxchange.users.entity.ROLE;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.InactiveAccountException;
import com.unt.campusxchange.users.exception.InvalidOTPException;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import com.unt.campusxchange.users.security.JWTProvider;
import java.security.SecureRandom;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTProvider jwtProvider;
    private final EmailService emailService;

    private static final SecureRandom random = new SecureRandom();

    public static String generateOTP() {
        // Generate a random 4-digit number between 1000 and 9999
        int otp = random.nextInt(9000) + 1000;
        logger.info("Generated OTP: {}", otp);
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
        var otp = generateOTP();
        user.setOtp(otp);
        emailService.sendEmailWithOTP(registerRequest.email(), otp);
        return userRepository.save(user).getId();
    }

    public String getOTP(Integer id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return user.get().getOtp();
        }
        throw new UserNotFoundException("User Not found with given id: " + id);
    }

    public boolean activateAccount(Integer id, String otp) {
        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with given id: " + id));

        if (!user.getOtp().equals(otp)) {
            throw new InvalidOTPException("Provided OTP " + otp + " doesn't match our records");
        }

        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(user);
        return true;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
        // check if the user account is active
        Optional<User> user = userRepository.findByEmail(loginRequest.email());
        if (user.isPresent() && user.get().getAccountStatus().equals(AccountStatus.ACTIVE)) {
            String token = jwtProvider.createToken(authentication);
            return new LoginResponse("SUCCESS", token);
        }
        throw new InactiveAccountException("Can't login because account is INACTIVE.");
    }
}
