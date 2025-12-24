package com.twitterapi.mapper;

import com.twitterapi.dto.response.RetweetInfoResponseDto;
import com.twitterapi.dto.response.RetweetResponseDto;
import com.twitterapi.entity.Retweet;
import org.springframework.stereotype.Component;

@Component
public class RetweetMapper {

    public RetweetResponseDto toResponseDto(Retweet retweet) {
        return new RetweetResponseDto(
                retweet.getId(),
                retweet.getTweet().getId(),
                retweet.getUser().getId(),
                retweet.getCreatedAt()
        );
    }

    public RetweetInfoResponseDto toInfoResponseDto(Retweet retweet) {
        return new RetweetInfoResponseDto(
                retweet.getId(),
                retweet.getTweet().getId(),
                retweet.getUser().getId(),
                retweet.getUser().getUsername(),
                retweet.getCreatedAt()
        );
    }
}
