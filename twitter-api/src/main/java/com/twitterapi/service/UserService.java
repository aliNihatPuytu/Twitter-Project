package com.twitterapi.service;

import com.twitterapi.dto.response.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto findByUsername(String username);
    UserResponseDto me(Long userId);
    void deleteUserAsAdmin(Long adminId, Long userId);
    List<UserResponseDto> findAllUsers(Long adminId);
}
