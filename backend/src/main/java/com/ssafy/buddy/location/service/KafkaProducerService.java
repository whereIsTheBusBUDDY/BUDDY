package com.ssafy.buddy.location.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private static final String TOPIC_PREFIX = "bus-";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    public void sendMessage(int busId, Object message) {
        String topic = TOPIC_PREFIX + busId + "-location";
        kafkaTemplate.send(topic, message);
    }
}
