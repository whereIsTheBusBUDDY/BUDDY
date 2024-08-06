package com.ssafy.buddy.location.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "third_bus")
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
public class ThirdBus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "third_bus_id")
    private Long id;

    @Column(name = "third_bus_latitude", nullable = false)
    private Double thirdBusLatitude;

    @Column(name = "third_bus_longitude", nullable = false)
    private Double thirdBusLongitude;

    @Column(name = "third_bus_create_time", nullable = false)
    private Date thirdBusCreateTime;

    public ThirdBus(Double thirdBusLatitude, Double thirdBusLongitude, Date thirdBusCreateTime) {
        this.thirdBusLatitude = thirdBusLatitude;
        this.thirdBusLongitude = thirdBusLongitude;
        this.thirdBusCreateTime = thirdBusCreateTime;
    }
}
