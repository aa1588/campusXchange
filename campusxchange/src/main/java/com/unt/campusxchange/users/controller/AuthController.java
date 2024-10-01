package com.unt.campusxchange.users.controller;

import com.unt.campusxchange.users.dto.*;
import com.unt.campusxchange.users.service.AuthService;
import jakarta.validation.Valid;
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

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        Integer i = authService.registerUser(registerRequest);
        return new ResponseEntity<>(new RegisterResponse(i.toString()), HttpStatus.CREATED);
    }

    @GetMapping("/otp/{id}")
    public ResponseEntity<OTPResponse> getOTP(@PathVariable Integer id) {
        // change this controller to support sending OTP in email later
        String otp = authService.getOTP(id);
        return new ResponseEntity<>(new OTPResponse(otp), HttpStatus.OK);
    }

    @PostMapping("/account/activate/{id}")
    public ResponseEntity<ActivateAccountResponse> activateAccount(
            @PathVariable Integer id, @RequestBody ActivateAccountRequest activateAccountRequest) {
        if (authService.activateAccount(id, activateAccountRequest.otp())) {
            return ResponseEntity.ok(new ActivateAccountResponse("SUCCESS", "Account Activated."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ActivateAccountResponse("FAILED", "Account Activation Failed."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        var loginResponse = authService.login(loginRequest);
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
}
