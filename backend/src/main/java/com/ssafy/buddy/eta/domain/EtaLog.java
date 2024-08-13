package com.ssafy.buddy.eta.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "eta_log")
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class EtaLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @Column(name = "bus_line", nullable = false)
    private int busLine;

    @Column(name = "station_id", nullable = false)
    private Long stationId;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    // public 생성자 추가
    public EtaLog(int busLine, Long stationId, LocalDateTime dateTime) {
        this.busLine = busLine;
        this.stationId = stationId;
        this.dateTime = dateTime;
    }
}