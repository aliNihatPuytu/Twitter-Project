package com.twitterapi.service;

import com.twitterapi.dto.request.RegisterRequestDto;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ConflictException;
import com.twitterapi.mapper.UserMapper;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.security.JwtService;
import com.twitterapi.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Spy
    private UserMapper userMapper = new UserMapper();

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_shouldThrowConflict_whenUsernameExists() {
        when(userRepository.existsByUsername("u")).thenReturn(true);

        assertThrows(ConflictException.class, () ->
                authService.register(new RegisterRequestDto("u", "a@a.com", "password123"))
        );
    }

    @Test
    void register_shouldSaveUser_andReturnToken() {
        when(userRepository.existsByUsername("u")).thenReturn(false);
        when(userRepository.existsByEmail("a@a.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("ENC");
        when(jwtService.generateToken(any(), any())).thenReturn("TOKEN");

        AtomicReference<User> saved = new AtomicReference<>();
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(10L);
            saved.set(u);
            return u;
        });

        var res = authService.register(new RegisterRequestDto("u", "a@a.com", "password123"));

        assertEquals("TOKEN", res.token());
        assertEquals(10L, res.userId());
        assertEquals("u", res.username());
        assertEquals("ENC", saved.get().getPassword());
    }
}
