package com.twitterapi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twitterapi.exceptions.TwitterErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {

        TwitterErrorResponse res = new TwitterErrorResponse();
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.setMessage("Devam etmek için giriş yap");
        res.setTimestamp(System.currentTimeMillis());
        res.setLocalDateTime(LocalDateTime.now());

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        objectMapper.writeValue(response.getOutputStream(), res);
    }
}
