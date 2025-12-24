package com.twitterapi.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommentCreateRequestDto(
        @JsonAlias("id") @NotNull Long tweetId,
        @NotNull @NotBlank @Size(max = 280) String content
) {
}
