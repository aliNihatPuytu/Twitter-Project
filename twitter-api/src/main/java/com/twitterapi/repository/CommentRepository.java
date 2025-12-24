package com.twitterapi.repository;

import com.twitterapi.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTweet_IdOrderByCreatedAtAsc(Long tweetId);
}
