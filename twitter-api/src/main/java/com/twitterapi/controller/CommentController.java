package com.twitterapi.controller;

import com.twitterapi.dto.request.CommentCreateRequestDto;
import com.twitterapi.dto.request.CommentUpdateRequestDto;
import com.twitterapi.dto.response.CommentResponseDto;
import com.twitterapi.security.AuthUserDetails;
import com.twitterapi.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponseDto create(@AuthenticationPrincipal AuthUserDetails userDetails,
                                     @Valid @RequestBody CommentCreateRequestDto dto) {
        return commentService.create(userDetails.getId(), dto);
    }

    @GetMapping("/byTweetId")
    public List<CommentResponseDto> findByTweetId(@RequestParam(value = "tweetId", required = false) Long tweetId,
                                                  @RequestParam(value = "id", required = false) Long id) {
        Long resolved = tweetId != null ? tweetId : id;
        return commentService.findByTweetId(resolved);
    }

    @PutMapping("/{id}")
    public CommentResponseDto update(@AuthenticationPrincipal AuthUserDetails userDetails,
                                     @PathVariable("id") Long id,
                                     @Valid @RequestBody CommentUpdateRequestDto dto) {
        return commentService.update(userDetails.getId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal AuthUserDetails userDetails,
                       @PathVariable("id") Long id) {
        commentService.delete(userDetails.getId(), id);
    }
}
