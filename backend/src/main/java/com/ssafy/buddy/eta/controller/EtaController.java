package com.ssafy.buddy.eta.controller;

import com.ssafy.buddy.eta.controller.request.BusDataRequest;
import com.ssafy.buddy.eta.controller.response.EtaResponse;
import com.ssafy.buddy.eta.service.EtaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EtaController {

    private final EtaService etaService;

    @PostMapping("/eta")//예상 도착 시간 처리 외부 API 호출
    public ResponseEntity<EtaResponse> calculateEta(@RequestBody BusDataRequest busDataRequest) {
        EtaResponse etaResponse = etaService.calculateEta(busDataRequest);
        return ResponseEntity.ok(etaResponse);
    }

    @PostMapping("/gpu/eta")// 예상 도착 시간 처리 GPU 서버 ETA 모델
    public ResponseEntity<EtaResponse> useGpuEta(@RequestBody BusDataRequest busDataRequest) {
        EtaResponse etaResponse = etaService.useGpuEta(busDataRequest);
        return ResponseEntity.ok(etaResponse);
    }
}
