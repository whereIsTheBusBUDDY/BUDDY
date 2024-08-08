package com.ssafy.buddy.eta.controller.response;


import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EtaResponse {
    private int busLine; // bus 노선
    private int time; // eta 시간
}
