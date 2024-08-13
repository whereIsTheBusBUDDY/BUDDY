package com.ssafy.buddy.eta.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.ssafy.buddy.eta.controller.request.BusDataRequest;
import com.ssafy.buddy.eta.controller.request.BusStopRequest;
import com.ssafy.buddy.eta.controller.response.EtaResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EtaService {

    private final WebClient.Builder webClientBuilder;
    private WebClient webClient;

    @PostConstruct
    public void init() {
        this.webClient = webClientBuilder.build();
    }

    @Value("${NAVER_API_CLIENT_ID}")
    private String clientId;

    @Value("${NAVER_API_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${naver.api.host}")
    private String host;

    @Value("${naver.api.path5}")
    private String path5;

    @Value("${naver.api.path15}")
    private String path15;

    @Value("${naver.api.header1}")
    private String header1;

    @Value("${naver.api.header2}")
    private String header2;

    @Value("${app.fastapi.url}")
    private String fastApiUrl;

    //외부 api 로 eta 계산
    public EtaResponse calculateEta(BusDataRequest busDataRequest) {
        int busLine = busDataRequest.getBusLine();
        String start = busDataRequest.getNowBusLongitude() + "," + busDataRequest.getNowBusLatitude(); // 출발위치
        String goal = busDataRequest.getDetailBusStopLongitude() + "," + busDataRequest.getDetailBusStopLatitude();// 도착위치
        String option = "tracomfort"; //길 찾기 옵션
        String waypoints = createWaypoints(busDataRequest.getRoute());

        String path = (busLine == 3 || busLine == 5) ? path5 : path15;
        String response = fetchEtaResponse(start, goal, waypoints, option, path);

        return processData(response, busLine);
    }

    // 외부 api 이용 하기 경유지 데이터 전 처리
    private String createWaypoints(List<BusStopRequest> route) {
        StringBuilder sb = new StringBuilder();
        for (BusStopRequest stop : route) {
            if (!stop.isVisited()) {
                if (!sb.isEmpty()) {
                    sb.append("|");
                }
                sb.append(String.format("%.6f,%.6f", stop.getBusStopLongitude(), stop.getBusStopLatitude()));
            }
        }
        return sb.toString();
    }
    
    // 외부 api 요청 함수
    private String fetchEtaResponse(String start, String goal, String waypoints, String option, String path) {
        try {
            return webClient.get()
                    .uri(uriBuilder -> {
                        uriBuilder.scheme("https")
                                .host(host)
                                .path(path)
                                .queryParam("start", start)
                                .queryParam("goal", goal)
                                .queryParam("option", option);
                        if (!waypoints.isEmpty()) {
                            uriBuilder.queryParam("waypoints", waypoints);
                        }
                        return uriBuilder.build();
                    })
                    .header(header1, clientId)
                    .header(header2, clientSecret)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(3))
                    .block();
        } catch (Exception e) { // 타임 아웃이나 다른 에러 시 null 반환
            return null;
        }
    }

    // api 요청 받아온 후 데이터 처리
    public EtaResponse processData(String response, int busLine) {
        ObjectMapper mapper = new ObjectMapper();
        EtaResponse etaResponse = new EtaResponse();

        try {
            JsonNode root = mapper.readTree(response);
            JsonNode routeNode = root.get("route");
            JsonNode optionNode = routeNode.path("tracomfort").get(0);
            JsonNode summaryNode = optionNode.path("summary");

            int totalDuration = summaryNode.path("duration").asInt();

            JsonNode waypointsNode = summaryNode.path("waypoints");

            if (waypointsNode.isArray()) {
                for (JsonNode waypoint : waypointsNode) {
                    totalDuration += waypoint.path("duration").asInt();
                }
            }

            int time = totalDuration / 60000;
            etaResponse.setBusLine(busLine);
            etaResponse.setTime(time);
        } catch (JsonProcessingException e) {
            etaResponse.setTime(-1); // json 파싱 오류 시 -1 설정
        }
        return etaResponse;
    }

    //GPU 서버 ETA 모델 활용
    public EtaResponse useGpuEta(BusDataRequest busDataRequest) {
        String yoloUrl = fastApiUrl + "/eta";

        String responseBody = webClient.post()
                .uri(yoloUrl)
                .body(Mono.just(busDataRequest), BusDataRequest.class)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        EtaResponse response = null;
        try {
            response = mapper.readValue(responseBody, EtaResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("GPU 서버에서 JSON 파일이 안 넘어옴", e);
        }
        return response;
    }
}
