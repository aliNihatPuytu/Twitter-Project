package com.twitterapi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        String msg = authException.getMessage();
        if (msg != null && msg.toLowerCase().contains("bad credentials")) {
            msg = "Kullanıcı adı veya şifre yanlış";
        } else if (msg == null || msg.isBlank()) {
            msg = "Yetkisiz erişim";
        }

        objectMapper.writeValue(response.getOutputStream(), Map.of("message", msg));
    }
}
