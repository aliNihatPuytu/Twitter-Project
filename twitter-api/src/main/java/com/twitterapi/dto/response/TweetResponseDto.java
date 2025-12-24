package com.twitterapi.dto.response;

import java.time.LocalDateTime;

public record TweetResponseDto(
        Long id,
        String content,
        Long userId,
        String username,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        int likeCount,
        int commentCount,
        int retweetCount
) {
}
