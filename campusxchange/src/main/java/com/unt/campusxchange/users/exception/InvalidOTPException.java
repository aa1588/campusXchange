package com.unt.campusxchange.users.exception;

public class InvalidOTPException extends RuntimeException {
    public InvalidOTPException(String s) {
        super(s);
    }
}
