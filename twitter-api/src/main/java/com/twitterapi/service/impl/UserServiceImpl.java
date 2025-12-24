package com.twitterapi.service.impl;

import com.twitterapi.dto.response.UserResponseDto;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ForbiddenException;
import com.twitterapi.exceptions.NotFoundException;
import com.twitterapi.mapper.UserMapper;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponseDto findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found, username : " + username));
        return userMapper.toUserResponseDto(user);
    }

    @Override
    public UserResponseDto me(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found, id : " + userId));
        return userMapper.toUserResponseDto(user);
    }

    @Override
    public void deleteUserAsAdmin(Long adminId, Long userId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new NotFoundException("Admin not found, id : " + adminId));

        if (!admin.isAdmin()) {
            throw new ForbiddenException("Only admin can delete users");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found, id : " + userId));

        userRepository.delete(user);
    }

    @Override
    public List<UserResponseDto> findAllUsers(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new NotFoundException("Admin not found, id : " + adminId));

        if (!admin.isAdmin()) {
            throw new ForbiddenException("Only admin can list users");
        }

        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponseDto)
                .toList();
    }
}
