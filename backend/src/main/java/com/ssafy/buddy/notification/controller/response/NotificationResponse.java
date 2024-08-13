package com.ssafy.buddy.notification.controller.response;

import com.ssafy.buddy.notification.domain.Notification;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private String type;
    private Long boardId;
    private String stationName;
    private Integer busNumber;
    private String senderName;
    private String suggestion;
    private String timestamp;
    private Boolean isRead;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("y.M.d HH:mm");

    public static NotificationResponse from(Notification notification, boolean isRead) {
        return new NotificationResponse(
                notification.getId(), notification.getType().name(), notification.getBoardId(),
                notification.getStationName(), notification.getBusNumber(), notification.getSenderName(),
                notification.getSuggestion(), notification.getTimestamp().format(FORMATTER), isRead
        );
    }
}
