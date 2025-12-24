package com.twitterapi.exceptions;

import org.springframework.http.HttpStatus;

public class ConflictException extends TwitterException {
    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
