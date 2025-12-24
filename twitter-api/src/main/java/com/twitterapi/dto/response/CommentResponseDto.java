package com.twitterapi.dto.response;

import java.time.LocalDateTime;

public record CommentResponseDto(
        Long id,
        Long tweetId,
        String content,
        Long userId,
        String username,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
