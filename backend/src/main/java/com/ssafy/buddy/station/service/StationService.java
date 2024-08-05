package com.ssafy.buddy.station.service;

import com.ssafy.buddy.station.domain.Station;
import com.ssafy.buddy.station.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StationService {
    private final StationRepository stationRepository;
    public List<Station> findStation(int busId) {
        return stationRepository.findAllByBusLine(busId);
    }
    @Transactional
    public void updateVisited(int stationId, boolean visited) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new IllegalArgumentException("정류장을 찾을 수 없습니다."));
        station.changeVisited(visited);
        stationRepository.save(station);
    }
}
