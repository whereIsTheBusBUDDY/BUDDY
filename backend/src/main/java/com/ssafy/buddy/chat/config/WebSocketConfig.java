package com.ssafy.buddy.chat.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final SocketHandshakeInterceptor socketHandshakeInterceptor;
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setApplicationDestinationPrefixes("/send-chat"); //클라이언트가 서버로 메세지 보낼 URL 접두사
        config.enableSimpleBroker("/room"); //topic으로 메세지 전달
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")//SocketJS 연결 주소
                .setAllowedOriginPatterns("*")
                .addInterceptors(socketHandshakeInterceptor)
                .withSockJS();
    }
}
