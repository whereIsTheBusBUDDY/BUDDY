package com.ssafy.buddy.chat.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatMessage {
    private int chatRoomId;
    private String message;
    private String sender;
    private Date creationDate;
}
