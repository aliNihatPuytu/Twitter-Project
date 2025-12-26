package com.twitterapi.service;

import com.twitterapi.dto.request.LoginRequestDto;
import com.twitterapi.dto.request.RegisterRequestDto;
import com.twitterapi.dto.response.AuthResponseDto;

public interface AuthService {
    AuthResponseDto register(RegisterRequestDto dto);
    AuthResponseDto login(LoginRequestDto dto);
}
