package com.ssafy.buddy.station.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "station")
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class Station {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "station_name", nullable = false)
    private String stationName;

    @Column(name = "bus_line", nullable = false)
    private int busLine;

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longitude", nullable = false)
    private double longitude;
}
