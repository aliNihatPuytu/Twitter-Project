package com.twitterapi.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TwitterException.class)
    public ResponseEntity<TwitterErrorResponse> handleException(TwitterException e) {
        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(e.getHttpStatus().value());
        res.setMessage(e.getMessage());
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());
        return new ResponseEntity<>(res, e.getHttpStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<TwitterErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getField() + " " + fe.getDefaultMessage())
                .orElse("Validation error");

        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setMessage(msg);
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<TwitterErrorResponse> handleNotReadable(HttpMessageNotReadableException e) {
        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setMessage("Request body zorunlu. JSON body gönder.");
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<TwitterErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(HttpStatus.METHOD_NOT_ALLOWED.value());
        res.setMessage("Method not allowed");
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());
        return new ResponseEntity<>(res, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<TwitterErrorResponse> handleIntegrity(DataIntegrityViolationException e) {
        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(HttpStatus.CONFLICT.value());
        res.setMessage("Conflict");
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());
        return new ResponseEntity<>(res, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<TwitterErrorResponse> handleException(Exception e) {
        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.setMessage(e.getMessage());
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());
        return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
