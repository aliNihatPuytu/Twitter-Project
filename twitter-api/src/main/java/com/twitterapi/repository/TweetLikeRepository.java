package com.twitterapi.repository;

import com.twitterapi.entity.Tweet;
import com.twitterapi.entity.TweetLike;
import com.twitterapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TweetLikeRepository extends JpaRepository<TweetLike, Long> {
    Optional<TweetLike> findByTweetAndUser(Tweet tweet, User user);
    Optional<TweetLike> findByTweet_IdAndUser_Id(Long tweetId, Long userId);
    List<TweetLike> findByTweet_IdOrderByCreatedAtDesc(Long tweetId);
}
