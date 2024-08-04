package com.ssafy.buddy.notification.controller.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private String type;
    private Long postId;
}
