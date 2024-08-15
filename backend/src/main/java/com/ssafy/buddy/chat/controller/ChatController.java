package com.ssafy.buddy.chat.controller;

import com.ssafy.buddy.chat.domain.ChatMessage;
import com.ssafy.buddy.chat.domain.response.ChatResponse;
import com.ssafy.buddy.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequiredArgsConstructor
public class ChatController {
    @MessageMapping("/{roomId}")
    @SendTo("/room/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable int roomId, ChatResponse message) {
        return new ChatMessage(roomId, message.getMessage(), message.getSender(), new Date(), message.getUserId());
    }
}
