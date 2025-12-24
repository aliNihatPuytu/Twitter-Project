package com.twitterapi.service.impl;

import com.twitterapi.dto.request.TweetCreateRequestDto;
import com.twitterapi.dto.request.TweetUpdateRequestDto;
import com.twitterapi.dto.response.TweetResponseDto;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ForbiddenException;
import com.twitterapi.exceptions.NotFoundException;
import com.twitterapi.mapper.TweetMapper;
import com.twitterapi.repository.TweetRepository;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.TweetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TweetServiceImpl implements TweetService {

    @Autowired
    private final TweetRepository tweetRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final TweetMapper tweetMapper;

    @Override
    public TweetResponseDto create(Long userId, TweetCreateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found, id : " + userId));

        Tweet tweet = tweetMapper.toEntity(dto, user);
        tweetRepository.save(tweet);
        return tweetMapper.toResponseDto(tweet);
    }

    @Override
    public List<TweetResponseDto> findByUserId(Long userId) {
        return tweetRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(tweetMapper::toResponseDto)
                .toList();
    }

    @Override
    public TweetResponseDto findById(Long tweetId) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found, id : " + tweetId));
        return tweetMapper.toResponseDto(tweet);
    }

    @Override
    public TweetResponseDto update(Long userId, Long tweetId, TweetUpdateRequestDto dto) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found, id : " + tweetId));

        if (!tweet.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Only tweet owner can update");
        }

        tweet.setContent(dto.content());
        tweetRepository.save(tweet);
        return tweetMapper.toResponseDto(tweet);
    }

    @Override
    public void delete(Long userId, Long tweetId) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found, id : " + tweetId));

        if (!tweet.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Only tweet owner can delete");
        }

        tweetRepository.delete(tweet);
    }
}
