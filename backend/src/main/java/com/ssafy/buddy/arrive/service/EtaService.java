package com.ssafy.buddy.arrive.service;

import com.ssafy.buddy.arrive.controller.request.BusDataRequest;
import com.ssafy.buddy.arrive.controller.response.EtaResponse;

public interface EtaService {
    EtaResponse calculateEta(BusDataRequest busDataRequest);
}
