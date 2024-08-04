package com.ssafy.buddy.notification.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "notification")
@NoArgsConstructor(access = PROTECTED)
public class Notification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receiver_id")
    private Long receiverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotificationType type;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "post_id")
    private Long postId;

    public Notification(Long receiverId, NotificationType type) {
        this.receiverId = receiverId;
        this.type = type;
        this.timestamp = LocalDateTime.now();
    }

    public Notification(NotificationType type, Long postId) {
        this.type = type;
        this.timestamp = LocalDateTime.now();
        this.postId = postId;
    }
}
