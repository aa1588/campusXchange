package com.unt.campusxchange.users.exception;

import com.unt.campusxchange.QA.exception.ItemOwnershipRequiredException;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.offers.exception.OfferNotFoundException;
import com.unt.campusxchange.wishlist.exception.WishlistItemNotFoundException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
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

    @ExceptionHandler(InactiveAccountException.class)
    public ResponseEntity<ProblemDetail> handleInactiveAccountException(InactiveAccountException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Inactive Account");
        problemDetail.setType(URI.create("https://example.com/problems/inactive-account"));
        problemDetail.setTitle("Inactive Account");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDeniedException(AccessDeniedException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Access Denied");
        problemDetail.setType(URI.create("https://example.com/problems/access-denied"));
        problemDetail.setTitle("Access Denied");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(InvalidBearerTokenException.class)
    public ResponseEntity<ProblemDetail> handleInvalidBearerTokenException(InvalidBearerTokenException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Invalid Bearer");
        problemDetail.setType(URI.create("https://example.com/problems/invalid-bearer"));
        problemDetail.setTitle("Invalid Bearer");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleItemNotFoundException(ItemNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Item not found");
        problemDetail.setType(URI.create("https://example.com/problems/item-not-found"));
        problemDetail.setTitle("Item Not Found");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(WishlistItemNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleWishlistItemNotFoundException(WishlistItemNotFoundException ex) {
        ProblemDetail problemDetail =
                ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Wishlist item not found");
        problemDetail.setType(URI.create("https://example.com/problems/item-not-found"));
        problemDetail.setTitle("Wishlist Item Not Found");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(ItemOwnershipRequiredException.class)
    public ResponseEntity<ProblemDetail> handleItemOwnershipRequiredException(ItemOwnershipRequiredException ex) {
        ProblemDetail problemDetail =
                ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Item ownership required.");
        problemDetail.setType(URI.create("https://example.com/problems/item-ownership-required"));
        problemDetail.setTitle("Item Ownership Required");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(OfferNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleOfferNotFoundException(OfferNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "OfferNotFound");
        problemDetail.setType(URI.create("https://example.com/problems/offer-not-found"));
        problemDetail.setTitle("OfferNotFound");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(MailAuthenticationException.class)
    public ResponseEntity<ProblemDetail> handleMailAuthenticationException(MailAuthenticationException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED, "Mail authentication error"
        );
        problemDetail.setType(URI.create("https://example.com/problems/mail-authentication"));
        problemDetail.setTitle("Mail Authentication");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.BAD_REQUEST.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT, "Data Integrity violation"
        );
        problemDetail.setType(URI.create("https://example.com/problems/data-integrity-violation"));
        problemDetail.setTitle("Data Integrity Violation");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("status", HttpStatus.CONFLICT.value());
        Map<String, String> fieldErrors = new HashMap<>();
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(problemDetail);
    }

}
