package com.ssafy.buddy.location.controller;

import com.ssafy.buddy.location.domain.*;
import com.ssafy.buddy.location.service.KafkaProducerService;
import com.ssafy.buddy.location.service.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class LocationController {
    private final KafkaProducerService producerService;
    private final LocationService locationService;
    @PostMapping("/start/{busId}")
    public ResponseEntity<?> start(@PathVariable int busId, @RequestBody String location) {
        try{
            producerService.sendMessage(busId, location);
            return ResponseEntity.ok("위치 저장 성공");
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("위치 저장 실패");
        }
    }
    @GetMapping("/stop/{busId}")
    public ResponseEntity<?> stop(@PathVariable int busId) {
        locationService.stopBus(busId);
        return ResponseEntity.ok("운행 종료 성공");
    }

    @GetMapping("/start/check")
    public ResponseEntity<?> startCheck() {
        boolean checkBusStart = locationService.checkBusStart();
        return ResponseEntity.ok(checkBusStart);
    }

    @GetMapping("/location/1")
    public ResponseEntity<?> firstBusLocation() {
        FirstBus firstBusLocation = locationService.getLatestFirstBusLocation();
        return ResponseEntity.ok(firstBusLocation);
    }
    @GetMapping("/location/2")
    public ResponseEntity<?> secondBusLocation() {
        SecondBus secondBusLocation = locationService.getLatestSecondBusLocation();
        return ResponseEntity.ok(secondBusLocation);
    }
    @GetMapping("/location/3")
    public ResponseEntity<?> thirdBusLocation() {
        ThirdBus thirdBusLocation = locationService.getLatestThirdBusLocation();
        return ResponseEntity.ok(thirdBusLocation);
    }
    @GetMapping("/location/4")
    public ResponseEntity<?> fourthBusLocation() {
        FourthBus fourthBusLocation = locationService.getLatestFourthBusLocation();
        return ResponseEntity.ok(fourthBusLocation);
    }
    @GetMapping("/location/5")
    public ResponseEntity<?> fifthBusLocation() {
        FifthBus fifthBusLocation = locationService.getLatestFifthBusLocation();
        return ResponseEntity.ok(fifthBusLocation);
    }
    @GetMapping("/location/6")
    public ResponseEntity<?> sixthBusLocation() {
        SixthBus sixthBusLocation = locationService.getLatestSixthBusLocation();
        return ResponseEntity.ok(sixthBusLocation);
    }
    @DeleteMapping("/location/1")
    public ResponseEntity<?> deleteFirstBusLocation() {
        locationService.deleteFirstBusLocation();
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/location/2")
    public ResponseEntity<?> deleteSecondBusLocation() {
        locationService.deleteSecondBusLocation();
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/location/3")
    public ResponseEntity<?> deleteThirdBusLocation() {
        locationService.deleteThirdBusLocation();
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/location/4")
    public ResponseEntity<?> deleteFourthBusLocation() {
        locationService.deleteFourthBusLocation();
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/location/5")
    public ResponseEntity<?> deleteFifthBusLocation() {
        locationService.deleteFifthBusLocation();
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/location/6")
    public ResponseEntity<?> deleteSixthBusLocation() {
        locationService.deleteSixthBusLocation();
        return ResponseEntity.ok().build();
    }
}
