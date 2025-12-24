package com.twitterapi.service;

import com.twitterapi.security.AuthUserDetails;
import com.twitterapi.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    @Test
    void token_shouldContainUsername_andValidate() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "01234567890123456789012345678901");
        ReflectionTestUtils.setField(jwtService, "expirationMillis", 60000L);

        String token = jwtService.generateToken(5L, "user");
        assertEquals("user", jwtService.extractUsername(token));

        AuthUserDetails details = new AuthUserDetails(5L, "user", "p", false);
        assertTrue(jwtService.isTokenValid(token, details));
    }
}
