package com.ssafy.buddy.station.controller;

import com.ssafy.buddy.station.domain.Station;
import com.ssafy.buddy.station.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @PutMapping("/stations/{stationId}")
    public ResponseEntity<?> updateStation(@PathVariable int stationId, @RequestParam boolean visited) {
        stationService.updateVisited(stationId, visited);
        return ResponseEntity.ok().build();
    }
}
