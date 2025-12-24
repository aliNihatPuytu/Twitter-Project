package com.twitterapi.dto.response;

public record AuthResponseDto(
        String token,
        Long userId,
        String username
) {
}
