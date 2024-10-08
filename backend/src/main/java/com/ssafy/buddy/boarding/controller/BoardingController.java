package com.ssafy.buddy.boarding.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.boarding.service.BoardingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BoardingController {
    private final BoardingService boardingService;

    @PostMapping("/scan")
    public ResponseEntity<String> scanQrCode(@LoginMember Long memberId, @RequestParam("busNumber") int busNumber) {
        boardingService.scanQrCode(memberId, busNumber);
        return ResponseEntity.status(201).body("QR code 인식 : " + busNumber);
    }

    @GetMapping("/boarding")
    public Map<Integer, Long> getBoardingCountByBusNumber() {
        return boardingService.getBoardingCountByBusNumber();
    }

    @PostMapping("/arrive")
    public void isNextStationBookmarked(@RequestParam("stationId") int stationId, @RequestParam("time") int time) {
        boardingService.isNextStationBookmarked(stationId, time);
    }

    @GetMapping("/boarding/count")
    public ResponseEntity<?> getBoardingCount(@RequestParam("busId") int busId) {
        int count = boardingService.countBoardingByBusNumber(busId);
        return ResponseEntity.status(200).body(count);
    }
}
