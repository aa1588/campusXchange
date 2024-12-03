package com.unt.campusxchange.items.exception;

public class ItemNotFoundException extends RuntimeException {
    public ItemNotFoundException(String itemNotFound) {
        super(itemNotFound);
    }
}
