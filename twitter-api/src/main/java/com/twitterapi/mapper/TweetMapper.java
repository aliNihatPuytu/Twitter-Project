package com.twitterapi.mapper;

import com.twitterapi.dto.request.TweetUpdateRequestDto;
import com.twitterapi.dto.response.TweetResponseDto;
import com.twitterapi.entity.Tweet;

import java.time.LocalDateTime;

public class TweetMapper {

    public static TweetResponseDto toDto(Tweet tweet) {
        if (tweet == null) return null;

        int likeCount = tweet.getLikes() == null ? 0 : tweet.getLikes().size();
        int commentCount = tweet.getComments() == null ? 0 : tweet.getComments().size();
        int retweetCount = tweet.getRetweets() == null ? 0 : tweet.getRetweets().size();

        return new TweetResponseDto(
                tweet.getId(),
                tweet.getContent(),
                tweet.getUser() != null ? tweet.getUser().getId() : null,
                tweet.getUser() != null ? tweet.getUser().getUsername() : null,
                tweet.getCreatedAt(),
                tweet.getUpdatedAt(),
                likeCount,
                commentCount,
                retweetCount
        );
    }

    public static void updateEntity(Tweet tweet, TweetUpdateRequestDto dto) {
        if (tweet == null || dto == null) return;
        tweet.setContent(dto.content());
        tweet.setUpdatedAt(LocalDateTime.now());
    }
}
