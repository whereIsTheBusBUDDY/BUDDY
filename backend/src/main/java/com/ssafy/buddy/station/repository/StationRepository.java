package com.ssafy.buddy.station.repository;

import com.ssafy.buddy.station.domain.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Integer> {
    List<Station> findAllByBusLine(int busLine);
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Station s SET s.visited = false WHERE s.busLine = :busLine")
    void updateVisited(int busLine);
}
