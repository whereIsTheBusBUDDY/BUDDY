package com.ssafy.buddy.station.repository;

import com.ssafy.buddy.station.domain.Station;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Integer> {
    List<Station> findAllByBusLine(int busLine);
}
