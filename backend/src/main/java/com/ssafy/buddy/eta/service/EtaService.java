package com.ssafy.buddy.eta.service;

import com.ssafy.buddy.eta.controller.request.BusDataRequest;
import com.ssafy.buddy.eta.controller.response.EtaResponse;

public interface EtaService {
    EtaResponse calculateEta(BusDataRequest busDataRequest);
}
