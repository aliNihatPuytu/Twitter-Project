package com.twitterapi.service;

import com.twitterapi.dto.request.LikeRequestDto;
import com.twitterapi.dto.response.ActionResponseDto;
import com.twitterapi.dto.response.LikeResponseDto;

import java.util.List;

public interface LikeService {
    ActionResponseDto like(Long userId, LikeRequestDto likeRequestDto);
    ActionResponseDto dislike(Long userId, LikeRequestDto likeRequestDto);
    List<LikeResponseDto> findByTweetId(Long tweetId);
}
