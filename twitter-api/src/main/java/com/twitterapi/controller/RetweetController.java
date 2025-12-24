package com.twitterapi.controller;

import com.twitterapi.dto.request.RetweetRequestDto;
import com.twitterapi.dto.response.RetweetInfoResponseDto;
import com.twitterapi.dto.response.RetweetResponseDto;
import com.twitterapi.security.AuthUserDetails;
import com.twitterapi.service.RetweetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/retweet")
public class RetweetController {

    private final RetweetService retweetService;

    public RetweetController(RetweetService retweetService) {
        this.retweetService = retweetService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RetweetResponseDto retweet(@AuthenticationPrincipal AuthUserDetails userDetails,
                                      @Valid @RequestBody RetweetRequestDto dto) {
        return retweetService.retweet(userDetails.getId(), dto);
    }

    @GetMapping("/byTweetId")
    public List<RetweetInfoResponseDto> findByTweetId(@RequestParam(value = "tweetId", required = false) Long tweetId,
                                                      @RequestParam(value = "id", required = false) Long id) {
        Long resolved = tweetId != null ? tweetId : id;
        return retweetService.findByTweetId(resolved);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal AuthUserDetails userDetails,
                       @PathVariable("id") Long id) {
        retweetService.delete(userDetails.getId(), id);
    }
}
