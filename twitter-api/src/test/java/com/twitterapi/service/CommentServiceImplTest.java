package com.twitterapi.service;

import com.twitterapi.entity.Comment;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ForbiddenException;
import com.twitterapi.mapper.CommentMapper;
import com.twitterapi.repository.CommentRepository;
import com.twitterapi.repository.TweetRepository;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.impl.CommentServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CommentServiceImplTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TweetRepository tweetRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Test
    void delete_shouldAllow_whenTweetOwner() {
        User tweetOwner = new User();
        tweetOwner.setId(1L);

        User commentOwner = new User();
        commentOwner.setId(2L);

        Tweet tweet = new Tweet();
        tweet.setUser(tweetOwner);

        Comment comment = new Comment();
        comment.setId(10L);
        comment.setUser(commentOwner);
        comment.setTweet(tweet);

        when(commentRepository.findById(10L)).thenReturn(Optional.of(comment));

        assertDoesNotThrow(() -> commentService.delete(1L, 10L));
        verify(commentRepository).delete(comment);
    }

    @Test
    void delete_shouldThrowForbidden_whenNeitherOwnerNorTweetOwner() {
        User tweetOwner = new User();
        tweetOwner.setId(1L);

        User commentOwner = new User();
        commentOwner.setId(2L);

        Tweet tweet = new Tweet();
        tweet.setUser(tweetOwner);

        Comment comment = new Comment();
        comment.setId(10L);
        comment.setUser(commentOwner);
        comment.setTweet(tweet);

        when(commentRepository.findById(10L)).thenReturn(Optional.of(comment));

        assertThrows(ForbiddenException.class, () -> commentService.delete(3L, 10L));
    }
}
