package com.ssafy.buddy.notification.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class SseEmitterRepository {

    private final Map<Long, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    public SseEmitter save(Long id, SseEmitter sseEmitter) {
        sseEmitters.put(id, sseEmitter);
        return sseEmitter;
    }

    public Optional<SseEmitter> findById(Long id) {
        return Optional.ofNullable(sseEmitters.get(id));
    }

    public List<SseEmitter> findAll() {
        return new ArrayList<>(sseEmitters.values());
    }

    public void deleteById(Long id) {
        sseEmitters.remove(id);
    }
}
