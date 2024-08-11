package com.ssafy.buddy.eta.controller.response;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EtaResponse {
    @JsonProperty("bus_line")
    private int busLine; // bus 노선

    @JsonProperty("predicted_time")
    private int time; // eta 시간
}
