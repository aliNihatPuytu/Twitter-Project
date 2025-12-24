package com.twitterapi.service;

import com.twitterapi.dto.request.RetweetRequestDto;
import com.twitterapi.dto.response.RetweetInfoResponseDto;
import com.twitterapi.dto.response.RetweetResponseDto;

import java.util.List;

public interface RetweetService {
    RetweetResponseDto retweet(Long userId, RetweetRequestDto dto);
    void delete(Long userId, Long retweetId);
    List<RetweetInfoResponseDto> findByTweetId(Long tweetId);
}
