package com.ssafy.buddy.notification.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.notification.controller.response.NotificationResponse;
import com.ssafy.buddy.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping(value = "/subscribe" , produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@LoginMember Long memberId) {
        return notificationService.subscribe(memberId);
    }

    @PostMapping("/suggestions")
    public void sendSuggestion(@LoginMember Long memberId, @RequestParam("type") String type) {
        notificationService.sendSuggestion(memberId, type);
    }

    @GetMapping("/notifications")
    public List<NotificationResponse> findNotifications(@LoginMember Long memberId) {
        return notificationService.findNotifications(memberId);
    }
}
