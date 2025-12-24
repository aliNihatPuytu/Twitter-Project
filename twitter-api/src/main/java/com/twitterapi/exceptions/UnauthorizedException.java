package com.twitterapi.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends TwitterException {
    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
