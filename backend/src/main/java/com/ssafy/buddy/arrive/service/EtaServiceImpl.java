package com.ssafy.buddy.arrive.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.buddy.arrive.controller.request.BusDataRequest;
import com.ssafy.buddy.arrive.controller.request.BusStopRequest;
import com.ssafy.buddy.arrive.controller.response.EtaResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EtaServiceImpl  implements  EtaService{

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

    @Value("${naver.api.path}")
    private String path;

    @Value("${naver.api.header1}")
    private String header1;

    @Value("${naver.api.header2}")
    private String header2;


    public EtaResponse calculateEta(BusDataRequest busDataRequest) {

        String start = busDataRequest.getNowBusLongitude() + "," + busDataRequest.getNowBusLatitude(); // 출발위치
        String goal = busDataRequest.getDetailBusStopLongitude() + "," + busDataRequest.getDetailBusStopLatitude();// 도착위치
        String option = "tracomfort"; //길 찾기 옵션
        String response;

        // 경유지 생성 (방문 여부가 false인 경유지들만)
        List<BusStopRequest> route = busDataRequest.getRoute();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < route.size(); i++) {
            BusStopRequest stop = route.get(i);
            if (!stop.isVisited()) {
                if (sb.length() > 0) {
                    sb.append("|");
                }
                sb.append(String.format("%.6f,%.6f", stop.getBusStopLongitude(), stop.getBusStopLatitude()));
            }
        }

        String waypoints = sb.toString();
        if (waypoints.equals("")) { // 경유지 없을 때
            response = webClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host(host)
                            .path(path)
                            .queryParam("start", start)
                            .queryParam("goal", goal)
                            .queryParam("option", option)
                            .build())
                    .header(header1, clientId)
                    .header(header2, clientSecret)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // 블로킹 방식으로 동작
        } else {
            response = webClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host(host)
                            .path(path)
                            .queryParam("start", start)
                            .queryParam("goal", goal)
                            .queryParam("waypoints", waypoints)
                            .queryParam("option", option)
                            .build())
                    .header(header1, clientId)
                    .header(header2, clientSecret)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // 블로킹 방식으로 동작
        }
        return processData(response, busDataRequest.getBusLine());
    }


    public EtaResponse processData(String response, int busLine) {
        ObjectMapper mapper = new ObjectMapper();
        EtaResponse etaResponse = new EtaResponse();

        try {
            //json에서 해당 하는 값으로 접근
            JsonNode root = mapper.readTree(response);
            JsonNode routeNode = root.get("route");
            JsonNode optionNode = routeNode.path("tracomfort").get(0);
            JsonNode summaryNode = optionNode.path("summary");
            JsonNode goalNode = summaryNode.path("goal");

            int totalDuration = goalNode.path("duration").asInt();

            JsonNode waypointsNode = summaryNode.path("waypoints");

            if (waypointsNode.isArray()) {
                for (JsonNode waypoint : waypointsNode) {
                    totalDuration += waypoint.path("duration").asInt();
                }
            }
            //
            int time = totalDuration / 60000;
            etaResponse.setBusLine(busLine);
            etaResponse.setTime(time);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return etaResponse;
    }
}
