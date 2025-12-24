package com.twitterapi.service;

import com.twitterapi.dto.request.TweetCreateRequestDto;
import com.twitterapi.dto.request.TweetUpdateRequestDto;
import com.twitterapi.dto.response.TweetResponseDto;

import java.util.List;

public interface TweetService {
    TweetResponseDto create(Long userId, TweetCreateRequestDto dto);
    List<TweetResponseDto> findByUserId(Long userId);
    TweetResponseDto findById(Long tweetId);
    TweetResponseDto update(Long userId, Long tweetId, TweetUpdateRequestDto dto);
    void delete(Long userId, Long tweetId);
}
