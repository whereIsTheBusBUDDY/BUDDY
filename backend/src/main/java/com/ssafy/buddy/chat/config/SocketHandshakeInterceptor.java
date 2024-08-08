package com.ssafy.buddy.chat.config;

import com.ssafy.buddy.auth.supports.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;
@Component
@RequiredArgsConstructor
@Slf4j
public class SocketHandshakeInterceptor implements HandshakeInterceptor {
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        URI uri = request.getURI();
        String query = uri.getQuery();
        if(query != null && query.startsWith("token=")) {
            String token = query.substring(6);
            System.out.println("token = " + token);
            if(jwtTokenProvider.validateAccessToken(token)){
                attributes.put("access_token", token);
                return true;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        if(exception == null){
            log.info("Handshake completed successfully");
        }else{
            log.error("Handshake failed", exception);
        }
    }
}
