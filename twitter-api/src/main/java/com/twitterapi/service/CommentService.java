package com.twitterapi.service;

import com.twitterapi.dto.request.CommentCreateRequestDto;
import com.twitterapi.dto.request.CommentUpdateRequestDto;
import com.twitterapi.dto.response.CommentResponseDto;

import java.util.List;

public interface CommentService {
    CommentResponseDto create(Long userId, CommentCreateRequestDto dto);
    CommentResponseDto update(Long userId, Long commentId, CommentUpdateRequestDto dto);
    void delete(Long userId, Long commentId);
    List<CommentResponseDto> findByTweetId(Long tweetId);
}
