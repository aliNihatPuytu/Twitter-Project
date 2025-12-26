package com.twitterapi.service.impl;

import com.twitterapi.dto.request.LoginRequestDto;
import com.twitterapi.dto.request.RegisterRequestDto;
import com.twitterapi.dto.response.AuthResponseDto;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ConflictException;
import com.twitterapi.mapper.UserMapper;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.security.JwtService;
import com.twitterapi.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            JwtService jwtService,
            UserMapper userMapper
    ) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    @Override
    public AuthResponseDto register(RegisterRequestDto dto) {
        if (userRepository.existsByUsername(dto.username())) {
            throw new ConflictException("Bu username zaten kullanılıyor");
        }
        if (userRepository.existsByEmail(dto.email())) {
            throw new ConflictException("Bu email zaten kullanılıyor");
        }

        String encodedPassword = passwordEncoder.encode(dto.password());
        User user = userMapper.toEntity(dto, encodedPassword);

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getId(), saved.getUsername());
        return userMapper.toAuthResponse(token, saved);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        String identifier = dto.username();
        String resolvedUsername = identifier;

        if (identifier != null && identifier.contains("@")) {
            resolvedUsername = userRepository.findByEmail(identifier)
                    .map(User::getUsername)
                    .orElse(identifier);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(resolvedUsername, dto.password())
        );

        Object principal = authentication.getPrincipal();
        if (principal instanceof com.twitterapi.security.AuthUserDetails details) {
            String token = jwtService.generateToken(details.getId(), details.getUsername());
            User u = new User();
            u.setId(details.getId());
            u.setUsername(details.getUsername());
            return userMapper.toAuthResponse(token, u);
        }

        User user = userRepository.findByUsername(resolvedUsername)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(user.getId(), user.getUsername());
        return userMapper.toAuthResponse(token, user);
    }
}