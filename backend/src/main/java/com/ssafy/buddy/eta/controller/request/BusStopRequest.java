package com.ssafy.buddy.eta.controller.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BusStopRequest {
    private double busStopLongitude; //버스 정류장 경도
    private double busStopLatitude; // 버스 정류장 위도
    private boolean visited; // 방문 여부
}
