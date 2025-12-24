package com.twitterapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
        @Size(max = 30) @NotNull @NotBlank @NotEmpty String username,
        @Size(max = 120) @Email @NotNull @NotBlank @NotEmpty String email,
        @Size(min = 8, max = 100) @NotNull @NotBlank @NotEmpty String password
) {
}
