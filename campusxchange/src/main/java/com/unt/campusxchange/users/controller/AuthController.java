package com.unt.campusxchange.users.controller;

import com.unt.campusxchange.users.dto.RegisterRequest;
import com.unt.campusxchange.users.dto.RegisterResponse;
import com.unt.campusxchange.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @GetMapping
    public String test() {
        return "test";
    }

    @PostMapping("register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        Integer i = authService.registerUser(registerRequest);
        return new ResponseEntity<>(
                new RegisterResponse("user registered with ID-" + i.toString()), HttpStatus.CREATED);
    }
}
