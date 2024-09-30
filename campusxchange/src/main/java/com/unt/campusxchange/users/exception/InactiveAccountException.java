package com.unt.campusxchange.users.exception;

public class InactiveAccountException extends RuntimeException {
    public InactiveAccountException(String s) {
        super(s);
    }
}
