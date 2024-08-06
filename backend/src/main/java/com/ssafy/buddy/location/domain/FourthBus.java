package com.ssafy.buddy.location.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "fourth_bus")
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
public class FourthBus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fourth_bus_id")
    private Long id;

    @Column(name = "fourth_bus_latitude", nullable = false)
    private Double fourthBusLatitude;

    @Column(name = "fourth_bus_longitude", nullable = false)
    private Double fourthBusLongitude;

    @Column(name = "fourth_bus_create_time", nullable = false)
    private Date fourthBusCreateTime;

    public FourthBus(Double fourthBusLatitude, Double fourthBusLongitude, Date fourthBusCreateTime) {
        this.fourthBusLatitude = fourthBusLatitude;
        this.fourthBusLongitude = fourthBusLongitude;
        this.fourthBusCreateTime = fourthBusCreateTime;
    }
}
