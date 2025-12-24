package com.twitterapi.dto.response;

import java.time.LocalDateTime;

public record UserResponseDto(
        Long id,
        String username,
        LocalDateTime createdAt
) {
}
