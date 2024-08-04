package com.ssafy.buddy.location.doamin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "first_bus")
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
public class FirstBus {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "first_bus_id")
    private Long id;

    @Column(name = "first_bus_latitude", nullable = false)
    private Double firstBusLatitude;

    @Column(name = "first_bus_longitude", nullable = false)
    private Double firstBusLongitude;

    @Column(name = "first_bus_create_time", nullable = false)
    private Date firstBusCreateTime;

    public FirstBus(Double firstBusLatitude, Double firstBusLongitude, Date firstBusCreateTime) {
        this.firstBusLatitude = firstBusLatitude;
        this.firstBusLongitude = firstBusLongitude;
        this.firstBusCreateTime = firstBusCreateTime;
    }
}
