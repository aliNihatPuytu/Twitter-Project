package com.twitterapi.mapper;

import com.twitterapi.dto.response.LikeResponseDto;
import com.twitterapi.entity.TweetLike;
import org.springframework.stereotype.Component;

@Component
public class LikeMapper {

    public LikeResponseDto toResponseDto(TweetLike like) {
        return new LikeResponseDto(
                like.getId(),
                like.getTweet().getId(),
                like.getUser().getId(),
                like.getUser().getUsername(),
                like.getCreatedAt()
        );
    }
}
