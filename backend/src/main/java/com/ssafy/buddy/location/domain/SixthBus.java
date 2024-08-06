package com.ssafy.buddy.location.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "sixth_bus")
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
public class SixthBus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sixth_bus_id")
    private Long id;

    @Column(name = "sixth_bus_latitude", nullable = false)
    private Double sixthBusLatitude;

    @Column(name = "sixth_bus_longitude", nullable = false)
    private Double sixthBusLongitude;

    @Column(name = "sixth_bus_create_time", nullable = false)
    private Date sixthBusCreateTime;

    public SixthBus(Double sixthBusLatitude, Double sixthBusLongitude, Date sixthBusCreateTime) {
        this.sixthBusLatitude = sixthBusLatitude;
        this.sixthBusLongitude = sixthBusLongitude;
        this.sixthBusCreateTime = sixthBusCreateTime;
    }
}
