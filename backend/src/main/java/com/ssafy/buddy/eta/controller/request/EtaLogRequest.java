package com.ssafy.buddy.eta.controller.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EtaLogRequest {
    private int busLine;
    private Long stationId;
}
