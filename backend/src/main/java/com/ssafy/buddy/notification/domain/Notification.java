package com.ssafy.buddy.notification.domain;

import com.ssafy.buddy.station.domain.Station;
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

    @Column(name = "board_id")
    private Long boardId;

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "station_name")
    private String stationName;

    @Column(name = "bus_number")
    private int busNumber;

    @Column(name = "suggestion")
    private String suggestion;

    // 도착
    public Notification(Long receiverId, Station station) {
        this.receiverId = receiverId;
        this.stationName = station.getStationName();
        this.busNumber = station.getBusLine();
        this.type = NotificationType.ARRIVE;
        this.timestamp = LocalDateTime.now();
    }

    // 공지사항
    public Notification(Long boardId) {
        this.boardId = boardId;
        this.type = NotificationType.NOTICE;
        this.timestamp = LocalDateTime.now();
    }

    // 건의
    public Notification(Long receiverId, String senderName, String suggestion) {
        this.receiverId = receiverId;
        this.senderName = senderName;
        this.suggestion = suggestion;
        this.type = NotificationType.SUGGEST;
        this.timestamp = LocalDateTime.now();
    }
}
