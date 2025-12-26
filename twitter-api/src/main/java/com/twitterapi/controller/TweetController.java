package com.twitterapi.controller;

import com.twitterapi.dto.request.TweetCreateRequestDto;
import com.twitterapi.dto.request.TweetUpdateRequestDto;
import com.twitterapi.dto.response.TweetResponseDto;
import com.twitterapi.security.AuthUserDetails;
import com.twitterapi.service.TweetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tweet")
public class TweetController {

    @Autowired
    private TweetService tweetService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TweetResponseDto create(@AuthenticationPrincipal AuthUserDetails userDetails,
                                   @Valid @RequestBody TweetCreateRequestDto dto) {
        return tweetService.create(userDetails.getId(), dto);
    }

    @GetMapping("/findByUserId")
    public List<TweetResponseDto> findByUserId(@RequestParam("userId") Long userId) {
        return tweetService.findByUserId(userId);
    }

    @GetMapping("/findById")
    public TweetResponseDto findById(@RequestParam(value = "id", required = false) Long id,
                                     @RequestParam(value = "tweetId", required = false) Long tweetId) {
        Long resolved = id != null ? id : tweetId;
        return tweetService.findById(resolved);
    }

    @GetMapping("/all")
    public List<TweetResponseDto> findAll() {
        return tweetService.findAll();
    }

    @PutMapping("/{id}")
    public TweetResponseDto update(@AuthenticationPrincipal AuthUserDetails userDetails,
                                   @PathVariable("id") Long id,
                                   @Valid @RequestBody TweetUpdateRequestDto dto) {
        return tweetService.update(userDetails.getId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal AuthUserDetails userDetails,
                       @PathVariable("id") Long id) {
        tweetService.delete(userDetails.getId(), id);
    }
}
