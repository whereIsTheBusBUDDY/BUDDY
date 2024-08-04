package com.ssafy.buddy.location.controller;

import com.ssafy.buddy.location.doamin.*;
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

}
