package com.ssafy.buddy.arrive.controller;

import com.ssafy.buddy.arrive.controller.request.BusDataRequest;
import com.ssafy.buddy.arrive.controller.response.EtaResponse;
import com.ssafy.buddy.arrive.service.EtaServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EtaController {

    private final EtaServiceImpl etaService;

    @PostMapping("/eta")//예상 도착 시간 처리
    public ResponseEntity<EtaResponse> calculateEta(@RequestBody BusDataRequest busDataRequest) {
        EtaResponse etaResponse = etaService.calculateEta(busDataRequest);
        return ResponseEntity.ok(etaResponse);

    }

}
