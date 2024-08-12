package com.ssafy.buddy.notification.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "notification_read_status")
@NoArgsConstructor(access = PROTECTED)
public class NotificationReadStatus {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "notification_id", nullable = false)
    private Long notificationId;


    @Column(name = "member_id", nullable = false)
    private Long memberId;

    public NotificationReadStatus(Long notificationId, Long memberId) {
        this.notificationId = notificationId;
        this.memberId = memberId;
    }
}