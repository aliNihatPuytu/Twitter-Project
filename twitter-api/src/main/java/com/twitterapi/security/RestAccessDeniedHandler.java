package com.twitterapi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twitterapi.exceptions.TwitterErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException {

        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(HttpStatus.FORBIDDEN.value());
        res.setMessage("Forbidden");
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");
        objectMapper.writeValue(response.getOutputStream(), res);
    }
}
