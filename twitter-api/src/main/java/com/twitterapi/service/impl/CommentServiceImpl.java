package com.twitterapi.service.impl;

import com.twitterapi.dto.request.CommentCreateRequestDto;
import com.twitterapi.dto.request.CommentUpdateRequestDto;
import com.twitterapi.dto.response.CommentResponseDto;
import com.twitterapi.entity.Comment;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.User;
import com.twitterapi.exceptions.ForbiddenException;
import com.twitterapi.exceptions.NotFoundException;
import com.twitterapi.mapper.CommentMapper;
import com.twitterapi.repository.CommentRepository;
import com.twitterapi.repository.TweetRepository;
import com.twitterapi.repository.UserRepository;
import com.twitterapi.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Override
    public CommentResponseDto create(Long userId, CommentCreateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found, id : " + userId));

        Tweet tweet = tweetRepository.findById(dto.tweetId())
                .orElseThrow(() -> new NotFoundException("Tweet not found, id : " + dto.tweetId()));

        Comment comment = new Comment();
        comment.setContent(dto.content());
        comment.setUser(user);
        comment.setTweet(tweet);

        commentRepository.save(comment);
        return commentMapper.toResponseDto(comment);
    }

    @Override
    public CommentResponseDto update(Long userId, Long commentId, CommentUpdateRequestDto dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Comment not found, id : " + commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Only comment owner can update");
        }

        comment.setContent(dto.content());
        commentRepository.save(comment);
        return commentMapper.toResponseDto(comment);
    }

    @Override
    public void delete(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Comment not found, id : " + commentId));

        boolean isCommentOwner = comment.getUser().getId().equals(userId);
        boolean isTweetOwner = comment.getTweet().getUser().getId().equals(userId);

        if (!isCommentOwner && !isTweetOwner) {
            throw new ForbiddenException("Only comment owner or tweet owner can delete");
        }

        commentRepository.delete(comment);
    }

    @Override
    public List<CommentResponseDto> findByTweetId(Long tweetId) {
        tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found, id : " + tweetId));
        return commentRepository.findByTweet_IdOrderByCreatedAtAsc(tweetId)
                .stream()
                .map(commentMapper::toResponseDto)
                .toList();
    }
}
