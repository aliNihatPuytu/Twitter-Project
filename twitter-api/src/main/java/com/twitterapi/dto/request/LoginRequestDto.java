package com.twitterapi.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record LoginRequestDto(
        @JsonAlias({"usernameOrEmail", "identifier", "email"})
        @NotNull @NotBlank @NotEmpty String username,
        @NotNull @NotBlank @NotEmpty String password
) {
}
