package com.ssafy.buddy.chat.domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatResponse {
    private long userId;
    private String message;
    private String sender;
}
