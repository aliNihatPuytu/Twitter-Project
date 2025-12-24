package com.twitterapi.controller;

import com.twitterapi.dto.request.LoginRequestDto;
import com.twitterapi.dto.request.RegisterRequestDto;
import com.twitterapi.dto.response.AuthResponseDto;
import com.twitterapi.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponseDto register(@Valid @RequestBody RegisterRequestDto dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    public AuthResponseDto login(@Valid @RequestBody LoginRequestDto dto) {
        return authService.login(dto);
    }
}
