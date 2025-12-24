package com.twitterapi.service;

import com.twitterapi.dto.request.RetweetRequestDto;
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
import com.twitterapi.service.impl.RetweetServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RetweetServiceImplTest {

    @Mock
    RetweetRepository retweetRepository;

    @Mock
    TweetRepository tweetRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    RetweetMapper retweetMapper;

    @InjectMocks
    RetweetServiceImpl retweetService;

    @Test
    void retweet_shouldCreateRetweet_whenNotRetweeted() {
        Long userId = 1L;
        Long tweetId = 10L;

        User user = new User();
        user.setId(userId);

        Tweet tweet = new Tweet();
        tweet.setId(tweetId);

        RetweetRequestDto dto = new RetweetRequestDto(tweetId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(tweetRepository.findById(tweetId)).thenReturn(Optional.of(tweet));
        when(retweetRepository.findByTweetAndUser(tweet, user)).thenReturn(Optional.empty());

        Retweet saved = new Retweet();
        saved.setId(100L);
        saved.setTweet(tweet);
        saved.setUser(user);
        saved.setCreatedAt(LocalDateTime.now());

        when(retweetRepository.save(any(Retweet.class))).thenReturn(saved);

        RetweetResponseDto mapped = new RetweetResponseDto(saved.getId(), tweetId, userId, saved.getCreatedAt());
        when(retweetMapper.toResponseDto(saved)).thenReturn(mapped);

        RetweetResponseDto res = retweetService.retweet(userId, dto);

        assertEquals(100L, res.id());
        assertEquals(tweetId, res.tweetId());
        assertEquals(userId, res.userId());
    }

    @Test
    void retweet_shouldThrow_whenAlreadyRetweeted() {
        Long userId = 1L;
        Long tweetId = 10L;

        User user = new User();
        user.setId(userId);

        Tweet tweet = new Tweet();
        tweet.setId(tweetId);

        RetweetRequestDto dto = new RetweetRequestDto(tweetId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(tweetRepository.findById(tweetId)).thenReturn(Optional.of(tweet));
        when(retweetRepository.findByTweetAndUser(tweet, user)).thenReturn(Optional.of(new Retweet()));

        assertThrows(ForbiddenException.class, () -> retweetService.retweet(userId, dto));
    }

    @Test
    void delete_shouldDelete_whenOwner() {
        Long userId = 1L;
        Long retweetId = 200L;

        User owner = new User();
        owner.setId(userId);

        Retweet retweet = new Retweet();
        retweet.setId(retweetId);
        retweet.setUser(owner);

        when(retweetRepository.findById(retweetId)).thenReturn(Optional.of(retweet));

        retweetService.delete(userId, retweetId);

        verify(retweetRepository).delete(retweet);
    }

    @Test
    void delete_shouldThrow_whenNotOwner() {
        Long userId = 1L;
        Long retweetId = 200L;

        User other = new User();
        other.setId(999L);

        Retweet retweet = new Retweet();
        retweet.setId(retweetId);
        retweet.setUser(other);

        when(retweetRepository.findById(retweetId)).thenReturn(Optional.of(retweet));

        assertThrows(ForbiddenException.class, () -> retweetService.delete(userId, retweetId));
    }

    @Test
    void delete_shouldThrow_whenNotFound() {
        when(retweetRepository.findById(200L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> retweetService.delete(1L, 200L));
    }
}
