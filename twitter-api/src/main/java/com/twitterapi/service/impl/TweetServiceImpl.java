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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TweetServiceImpl implements TweetService {

    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    public TweetServiceImpl(TweetRepository tweetRepository, UserRepository userRepository) {
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TweetResponseDto create(Long authUserId, TweetCreateRequestDto dto) {
        User user = userRepository.findById(authUserId)
                .orElseThrow(() -> new NotFoundException("User bulunamadı"));

        Tweet t = new Tweet();
        t.setUser(user);
        t.setContent(dto.content());
        t.setCreatedAt(LocalDateTime.now());

        Tweet saved = tweetRepository.save(t);
        return TweetMapper.toDto(saved);
    }

    @Override
    public List<TweetResponseDto> findByUserId(Long userId) {
        return tweetRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(TweetMapper::toDto)
                .toList();
    }

    @Override
    public TweetResponseDto findById(Long tweetId) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadı"));
        return TweetMapper.toDto(tweet);
    }

    @Override
    public List<TweetResponseDto> findAll() {
        return tweetRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(TweetMapper::toDto)
                .toList();
    }

    @Override
    public TweetResponseDto update(Long authUserId, Long tweetId, TweetUpdateRequestDto dto) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadı"));

        if (tweet.getUser() == null || !tweet.getUser().getId().equals(authUserId)) {
            throw new ForbiddenException("Bu tweet’i güncelleyemezsiniz");
        }

        TweetMapper.updateEntity(tweet, dto);
        Tweet saved = tweetRepository.save(tweet);
        return TweetMapper.toDto(saved);
    }

    @Override
    public void delete(Long authUserId, Long tweetId) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadı"));

        if (tweet.getUser() == null || !tweet.getUser().getId().equals(authUserId)) {
            throw new ForbiddenException("Bu tweet’i silemezsiniz");
        }

        tweetRepository.delete(tweet);
    }
}
