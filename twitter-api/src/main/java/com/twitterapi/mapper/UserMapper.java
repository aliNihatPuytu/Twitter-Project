package com.twitterapi.mapper;

import com.twitterapi.dto.request.RegisterRequestDto;
import com.twitterapi.dto.response.AuthResponseDto;
import com.twitterapi.dto.response.UserResponseDto;
import com.twitterapi.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequestDto dto, String encodedPassword) {
        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(encodedPassword);
        return user;
    }

    public AuthResponseDto toAuthResponse(String token, User user) {
        return new AuthResponseDto(token, user.getId(), user.getUsername());
    }

    public UserResponseDto toUserResponseDto(User user) {
        return new UserResponseDto(user.getId(), user.getUsername(), user.getCreatedAt());
    }
}
