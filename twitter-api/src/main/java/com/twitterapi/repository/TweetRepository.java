package com.twitterapi.repository;

import com.twitterapi.entity.Tweet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TweetRepository extends JpaRepository<Tweet, Long> {
    List<Tweet> findByUser_IdOrderByCreatedAtDesc(Long userId);
    List<Tweet> findAllByOrderByCreatedAtDesc();
}
