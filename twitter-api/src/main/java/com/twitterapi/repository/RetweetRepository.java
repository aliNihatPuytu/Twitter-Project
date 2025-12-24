package com.twitterapi.repository;

import com.twitterapi.entity.Retweet;
import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RetweetRepository extends JpaRepository<Retweet, Long> {

    Optional<Retweet> findByTweet_IdAndUser_Id(Long tweetId, Long userId);

    Optional<Retweet> findByTweetAndUser(Tweet tweet, User user);

    List<Retweet> findByTweet_IdOrderByCreatedAtDesc(Long tweetId);
}
