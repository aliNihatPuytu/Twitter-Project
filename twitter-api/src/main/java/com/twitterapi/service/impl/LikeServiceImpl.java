package com.twitterapi.service.impl;

import com.twitterapi.dto.request.LikeRequestDto;
import com.twitterapi.dto.response.ActionResponseDto;
import com.twitterapi.dto.response.LikeResponseDto;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.TweetLike;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.NotFoundException;
import com.twitterapi.mapper.LikeMapper;
import com.twitterapi.repository.TweetLikeRepository;
import com.twitterapi.repository.TweetRepository;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;
    private final TweetLikeRepository tweetLikeRepository;
    private final LikeMapper likeMapper;

    @Override
    @Transactional
    public ActionResponseDto like(Long userId, LikeRequestDto likeRequestDto) {
        Tweet tweet = tweetRepository.findById(likeRequestDto.tweetId())
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadı"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

        if (tweetLikeRepository.findByTweetAndUser(tweet, user).isPresent()) {
            return new ActionResponseDto("Tweet zaten beğenildi");
        }

        TweetLike like = new TweetLike();
        like.setTweet(tweet);
        like.setUser(user);
        tweetLikeRepository.save(like);

        return new ActionResponseDto("Tweet beğenildi");
    }

    @Override
    @Transactional
    public ActionResponseDto dislike(Long userId, LikeRequestDto likeRequestDto) {
        Tweet tweet = tweetRepository.findById(likeRequestDto.tweetId())
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadı"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

        TweetLike like = tweetLikeRepository.findByTweetAndUser(tweet, user)
                .orElseThrow(() -> new NotFoundException("Like bulunamadı"));

        tweetLikeRepository.delete(like);

        return new ActionResponseDto("Like kaldırıldı");
    }

    @Override
    public List<LikeResponseDto> findByTweetId(Long tweetId) {
        tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found, id : " + tweetId));

        return tweetLikeRepository.findByTweet_IdOrderByCreatedAtDesc(tweetId)
                .stream()
                .map(likeMapper::toResponseDto)
                .toList();
    }
}
