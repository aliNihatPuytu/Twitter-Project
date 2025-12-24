package com.twitterapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommentUpdateRequestDto(
        @Size(max = 280) @NotNull @NotBlank @NotEmpty String content
) {
}
