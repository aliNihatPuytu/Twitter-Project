package com.twitterapi.exceptions;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TwitterErrorResponse {
    private int status;
    private String message;
    private long timestamp;
    private LocalDateTime localDateTime;
}
