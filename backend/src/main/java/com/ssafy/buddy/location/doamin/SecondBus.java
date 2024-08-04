package com.ssafy.buddy.location.doamin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "second_bus")
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
public class SecondBus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "second_bus_id")
    private Long id;

    @Column(name = "second_bus_latitude", nullable = false)
    private Double secondBusLatitude;

    @Column(name = "second_bus_longitude", nullable = false)
    private Double secondBusLongitude;

    @Column(name = "second_bus_create_time", nullable = false)
    private Date secondBusCreateTime;

    public SecondBus(Double secondBusLatitude, Double secondBusLongitude, Date secondBusCreateTime) {
        this.secondBusLatitude = secondBusLatitude;
        this.secondBusLongitude = secondBusLongitude;
        this.secondBusCreateTime = secondBusCreateTime;
    }
}
