package com.ssafy.buddy.member.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "boarding")
@NoArgsConstructor(access = PROTECTED)
public class Boarding {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "bus_number", nullable = false)
    private int busNumber;

    @Column(name = "boarding_time", nullable = false)
    private LocalDateTime boardingTime;

    public Boarding(Long memberId, int busNumber) {
        this.memberId = memberId;
        this.busNumber = busNumber;
        this.boardingTime = LocalDateTime.now();
    }

    public void updateBusNumber(int busNumber) {
        this.busNumber = busNumber;
        this.boardingTime = LocalDateTime.now();
    }
}
