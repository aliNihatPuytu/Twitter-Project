package com.twitterapi.mapper;

import com.twitterapi.dto.request.TweetCreateRequestDto;
import com.twitterapi.dto.response.TweetResponseDto;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.User;
import org.springframework.stereotype.Component;

@Component
public class TweetMapper {

    public Tweet toEntity(TweetCreateRequestDto dto, User user) {
        Tweet tweet = new Tweet();
        tweet.setContent(dto.content());
        tweet.setUser(user);
        return tweet;
    }

    public TweetResponseDto toResponseDto(Tweet tweet) {
        return new TweetResponseDto(
                tweet.getId(),
                tweet.getContent(),
                tweet.getUser().getId(),
                tweet.getUser().getUsername(),
                tweet.getCreatedAt(),
                tweet.getUpdatedAt(),
                tweet.getLikes() == null ? 0 : tweet.getLikes().size(),
                tweet.getComments() == null ? 0 : tweet.getComments().size(),
                tweet.getRetweets() == null ? 0 : tweet.getRetweets().size()
        );
    }
}
