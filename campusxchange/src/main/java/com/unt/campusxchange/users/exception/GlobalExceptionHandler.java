package com.unt.campusxchange.users.exception;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidationExceptions(MethodArgumentNotValidException ex) {

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation Failed");

        problemDetail.setType(URI.create("https://example.com/problems/validation-error"));

        problemDetail.setTitle("Validation Error");
        problemDetail.setDetail("There were validation errors in your request");
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());

        // Collect field-specific errors
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));

        problemDetail.setProperty("fieldErrors", fieldErrors);

        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(InvalidOTPException.class)
    public ResponseEntity<ProblemDetail> handleInvalidOTPException(InvalidOTPException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Doesn't match Records");
        problemDetail.setType(URI.create("https://example.com/problems/invalid-otp"));
        problemDetail.setTitle("Invalid OTP");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleUserNotFoundException(UserNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "User not found");
        problemDetail.setType(URI.create("https://example.com/problems/user-not-found"));
        problemDetail.setTitle("User Not Found");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }
}

