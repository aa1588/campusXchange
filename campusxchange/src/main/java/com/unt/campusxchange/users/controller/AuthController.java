package com.unt.campusxchange.users.controller;

import com.unt.campusxchange.users.dto.*;
import com.unt.campusxchange.users.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
   private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @GetMapping
    public String test() {
        return "test";
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        logger.info("Registering user with email: {}", registerRequest.email());
        Integer id = authService.registerUser(registerRequest);
        logger.info("User registered successfully with id: {}", id);
        return new ResponseEntity<>(new RegisterResponse(id.toString()), HttpStatus.CREATED);
    }

    @PostMapping("/account/activate/{id}")
    public ResponseEntity<ActivateAccountResponse> activateAccount(
            @PathVariable Integer id, @RequestBody ActivateAccountRequest activateAccountRequest) {
        logger.info("Activating account for user id: {}", id);
        if (authService.activateAccount(id, activateAccountRequest.otp())) {
            logger.info("Account activated successfully for user id: {}", id);
            return ResponseEntity.ok(new ActivateAccountResponse("SUCCESS", "Account Activated."));
        } else {
            logger.warn("Account activation failed for user id: {}", id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ActivateAccountResponse("FAILED", "Account Activation Failed."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.email());
        var loginResponse = authService.login(loginRequest);
        logger.info("User logged in successfully: {}", loginRequest.email());
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
}

