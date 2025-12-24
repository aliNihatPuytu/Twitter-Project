package com.twitterapi.dto.response;

import java.time.LocalDateTime;

public record LikeResponseDto(
        Long id,
        Long tweetId,
        Long userId,
        String username,
        LocalDateTime createdAt
) {
}
