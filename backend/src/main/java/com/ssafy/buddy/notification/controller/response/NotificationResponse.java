package com.ssafy.buddy.notification.controller.response;

import com.ssafy.buddy.notification.domain.Notification;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private String type;
    private Long boardId;
    private String stationName;
    private Integer busNumber;
    private String senderName;
    private String suggestion;

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getType().name(), notification.getBoardId(), notification.getStationName(),
                notification.getBusNumber(), notification.getSenderName(), notification.getSuggestion()
        );
    }
}
