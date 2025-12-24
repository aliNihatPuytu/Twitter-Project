package com.twitterapi.service;

import com.twitterapi.dto.request.LikeRequestDto;
import com.twitterapi.dto.response.ActionResponseDto;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.TweetLike;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.NotFoundException;
import com.twitterapi.repository.TweetLikeRepository;
import com.twitterapi.repository.TweetRepository;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.impl.LikeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LikeServiceImplTest {

    @Mock
    TweetLikeRepository tweetLikeRepository;

    @Mock
    TweetRepository tweetRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    LikeServiceImpl likeService;

    @Test
    void like_shouldCreateLike_whenNotLiked() {
        Long userId = 1L;
        Long tweetId = 10L;

        User user = new User();
        user.setId(userId);

        Tweet tweet = new Tweet();
        tweet.setId(tweetId);

        LikeRequestDto dto = new LikeRequestDto(tweetId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(tweetRepository.findById(tweetId)).thenReturn(Optional.of(tweet));
        when(tweetLikeRepository.findByTweetAndUser(tweet, user)).thenReturn(Optional.empty());

        ActionResponseDto res = likeService.like(userId, dto);

        assertEquals("Tweet beğenildi", res.message());
        verify(tweetLikeRepository).save(org.mockito.ArgumentMatchers.any(TweetLike.class));
    }

    @Test
    void like_shouldReturnAlreadyLiked_whenLikedBefore() {
        Long userId = 1L;
        Long tweetId = 10L;

        User user = new User();
        user.setId(userId);

        Tweet tweet = new Tweet();
        tweet.setId(tweetId);

        LikeRequestDto dto = new LikeRequestDto(tweetId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(tweetRepository.findById(tweetId)).thenReturn(Optional.of(tweet));
        when(tweetLikeRepository.findByTweetAndUser(tweet, user)).thenReturn(Optional.of(new TweetLike()));

        ActionResponseDto res = likeService.like(userId, dto);

        assertEquals("Tweet zaten beğenildi", res.message());
    }

    @Test
    void dislike_shouldRemoveLike_whenExists() {
        Long userId = 1L;
        Long tweetId = 10L;

        User user = new User();
        user.setId(userId);

        Tweet tweet = new Tweet();
        tweet.setId(tweetId);

        TweetLike like = new TweetLike();
        like.setId(99L);
        like.setTweet(tweet);
        like.setUser(user);

        LikeRequestDto dto = new LikeRequestDto(tweetId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(tweetRepository.findById(tweetId)).thenReturn(Optional.of(tweet));
        when(tweetLikeRepository.findByTweetAndUser(tweet, user)).thenReturn(Optional.of(like));

        ActionResponseDto res = likeService.dislike(userId, dto);

        assertEquals("Like kaldırıldı", res.message());
        verify(tweetLikeRepository).delete(like);
    }

    @Test
    void dislike_shouldThrow_whenLikeNotFound() {
        Long userId = 1L;
        Long tweetId = 10L;

        User user = new User();
        user.setId(userId);

        Tweet tweet = new Tweet();
        tweet.setId(tweetId);

        LikeRequestDto dto = new LikeRequestDto(tweetId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(tweetRepository.findById(tweetId)).thenReturn(Optional.of(tweet));
        when(tweetLikeRepository.findByTweetAndUser(tweet, user)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> likeService.dislike(userId, dto));
    }
}
