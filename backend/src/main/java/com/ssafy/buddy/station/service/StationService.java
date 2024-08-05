package com.ssafy.buddy.station.service;

import com.ssafy.buddy.station.domain.Station;
import com.ssafy.buddy.station.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StationService {
    private final StationRepository stationRepository;
    public List<Station> findStation(int busId) {
        return stationRepository.findAllByBusLine(busId);
    }
}
