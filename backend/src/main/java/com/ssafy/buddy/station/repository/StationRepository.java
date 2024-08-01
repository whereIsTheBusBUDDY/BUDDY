package com.ssafy.buddy.station.repository;

import com.ssafy.buddy.station.domain.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Integer> {
}
