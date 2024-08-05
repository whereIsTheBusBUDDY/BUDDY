package com.ssafy.buddy.station.controller;

import com.ssafy.buddy.station.domain.Station;
import com.ssafy.buddy.station.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StationController {
    private final StationService stationService;
    @GetMapping("/stations/{busId}")
    public ResponseEntity<?> getStation(@PathVariable int busId) {
        List<Station> station = stationService.findStation(busId);
        return ResponseEntity.ok(station);
    }
}
