package com.ssafy.buddy.arrive.controller.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class BusDataRequest {
    private double nowBusLongitude; // 현재 버스 경도
    private double nowBusLatitude; // 현재 버스 위도
    private int busLine;
    private double detailBusStopLongitude; // 상세보기 누른 버스 정류장 경도
    private double detailBusStopLatitude; // 상세보기 누른 버스 정류장 위도
    private List<BusStopRequest> route;
}
