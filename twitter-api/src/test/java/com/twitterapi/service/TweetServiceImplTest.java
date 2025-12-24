package com.twitterapi.service;

import com.twitterapi.dto.request.TweetUpdateRequestDto;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ForbiddenException;
import com.twitterapi.mapper.TweetMapper;
import com.twitterapi.repository.TweetRepository;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.impl.TweetServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TweetServiceImplTest {

    @Mock
    private TweetRepository tweetRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TweetMapper tweetMapper;

    @InjectMocks
    private TweetServiceImpl tweetService;

    @Test
    void update_shouldThrowForbidden_whenNotOwner() {
        User owner = new User();
        owner.setId(1L);

        Tweet tweet = new Tweet();
        tweet.setId(100L);
        tweet.setUser(owner);

        when(tweetRepository.findById(100L)).thenReturn(Optional.of(tweet));

        assertThrows(ForbiddenException.class, () ->
                tweetService.update(2L, 100L, new TweetUpdateRequestDto("hi"))
        );
    }
}
