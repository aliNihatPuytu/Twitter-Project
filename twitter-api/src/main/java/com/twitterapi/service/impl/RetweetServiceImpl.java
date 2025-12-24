package com.twitterapi.service.impl;

import com.twitterapi.dto.request.RetweetRequestDto;
import com.twitterapi.dto.response.RetweetInfoResponseDto;
import com.twitterapi.dto.response.RetweetResponseDto;
import com.twitterapi.entity.Retweet;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ForbiddenException;
import com.twitterapi.exceptions.NotFoundException;
import com.twitterapi.mapper.RetweetMapper;
import com.twitterapi.repository.RetweetRepository;
import com.twitterapi.repository.TweetRepository;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.RetweetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RetweetServiceImpl implements RetweetService {

    private final RetweetRepository retweetRepository;
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;
    private final RetweetMapper retweetMapper;

    @Override
    public RetweetResponseDto retweet(Long userId, RetweetRequestDto retweetRequestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

        Tweet tweet = tweetRepository.findById(retweetRequestDto.tweetId())
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadı"));

        if (retweetRepository.findByTweetAndUser(tweet, user).isPresent()) {
            throw new ForbiddenException("Tweet zaten retweet edildi");
        }

        Retweet retweet = new Retweet();
        retweet.setTweet(tweet);
        retweet.setUser(user);

        Retweet saved = retweetRepository.save(retweet);
        return retweetMapper.toResponseDto(saved);
    }

    @Override
    public void delete(Long userId, Long retweetId) {
        Retweet retweet = retweetRepository.findById(retweetId)
                .orElseThrow(() -> new NotFoundException("Retweet bulunamadı"));

        if (!retweet.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Bu retweet'i silme yetkiniz yok");
        }

        retweetRepository.delete(retweet);
    }

    @Override
    public List<RetweetInfoResponseDto> findByTweetId(Long tweetId) {
        tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found, id : " + tweetId));
        return retweetRepository.findByTweet_IdOrderByCreatedAtDesc(tweetId)
                .stream()
                .map(retweetMapper::toInfoResponseDto)
                .toList();
    }
}
