package com.ssafy.buddy.location.doamin;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "fifth_bus")
@NoArgsConstructor(access = PROTECTED)
public class FifthBus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fifth_bus_id")
    private Long id;

    @Column(name = "fifth_bus_latitude", nullable = false)
    private Double fifthBusLatitude;

    @Column(name = "fifth_bus_longitude", nullable = false)
    private Double fifthBusLongitude;

    @Column(name = "fifth_bus_create_time", nullable = false)
    private Date fifthBusCreateTime;

    public FifthBus(Double fifthBusLatitude, Double fifthBusLongitude, Date fifthBusCreateTime) {
        this.fifthBusLatitude = fifthBusLatitude;
        this.fifthBusLongitude = fifthBusLongitude;
        this.fifthBusCreateTime = fifthBusCreateTime;
    }
}
