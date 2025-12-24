package com.twitterapi.controller;

import com.twitterapi.dto.request.LikeRequestDto;
import com.twitterapi.dto.response.ActionResponseDto;
import com.twitterapi.dto.response.LikeResponseDto;
import com.twitterapi.security.AuthUserDetails;
import com.twitterapi.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/like")
    @ResponseStatus(HttpStatus.CREATED)
    public ActionResponseDto like(@AuthenticationPrincipal AuthUserDetails userDetails,
                                  @Valid @RequestBody LikeRequestDto likeRequestDto) {
        return likeService.like(userDetails.getId(), likeRequestDto);
    }

    @PostMapping("/dislike")
    public ActionResponseDto dislike(@AuthenticationPrincipal AuthUserDetails userDetails,
                                     @Valid @RequestBody LikeRequestDto likeRequestDto) {
        return likeService.dislike(userDetails.getId(), likeRequestDto);
    }

    @GetMapping("/like/byTweetId")
    public List<LikeResponseDto> findByTweetId(@RequestParam(value = "tweetId", required = false) Long tweetId,
                                               @RequestParam(value = "id", required = false) Long id) {
        Long resolved = tweetId != null ? tweetId : id;
        return likeService.findByTweetId(resolved);
    }
}
