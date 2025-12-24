package com.twitterapi.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequestException extends TwitterException {
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
