package com.twitterapi.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

public record RetweetRequestDto(
        @JsonAlias("id") @NotNull Long tweetId
) {
}
