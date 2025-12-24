package com.twitterapi.dto.response;

import java.time.LocalDateTime;

public record RetweetResponseDto(
        Long id,
        Long tweetId,
        Long userId,
        LocalDateTime createdAt
) {
}
