package com.ssafy.buddy.notification.service;

import com.ssafy.buddy.member.domain.Boarding;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.domain.Role;
import com.ssafy.buddy.member.repository.BoardingRepository;
import com.ssafy.buddy.member.repository.MemberRepository;
import com.ssafy.buddy.notification.controller.response.NotificationResponse;
import com.ssafy.buddy.notification.domain.Notification;
import com.ssafy.buddy.notification.domain.NotificationType;
import com.ssafy.buddy.notification.repository.NotificationRepository;
import com.ssafy.buddy.notification.repository.SseEmitterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SseEmitterRepository sseEmitterRepository;
    private final MemberRepository memberRepository;
    private final NotificationRepository notificationRepository;
    private final BoardingRepository boardingRepository;

    public SseEmitter subscribe(Long memberId) {
        SseEmitter sseEmitter = new SseEmitter(3_000L);
        sseEmitter.onCompletion(() -> sseEmitterRepository.deleteById(memberId));
        sseEmitter.onTimeout(() -> sseEmitterRepository.deleteById(memberId));
        sendMessage(sseEmitter, "연결됨!");
        return sseEmitterRepository.save(memberId, sseEmitter);
    }

    public void sendMessageToAllMembers(NotificationType notificationType) {
        sseEmitterRepository.findAll()
                .forEach(sseEmitter -> sendMessage(sseEmitter, notificationType));
    }

    public void sendMessageToAdmin(Long adminId, String suggestionType) {
        sseEmitterRepository.findById(adminId)
                .ifPresent(sseEmitter -> sendMessage(sseEmitter, suggestionType));
    }

    private void sendMessage(SseEmitter sseEmitter, NotificationType type) {
        try {
            sseEmitter.send(SseEmitter.event()
                    .name(type.toString()));
        } catch (IOException e) {
            log.warn("알림 보내기 실패!!", e);
        }
    }

    private void sendMessage(SseEmitter sseEmitter, String message) {
        try {
            sseEmitter.send(SseEmitter.event()
                    .name(NotificationType.SUGGEST.toString())
                    .data(message));
        } catch (IOException e) {
            log.warn("알림 보내기 실패!!", e);
        }
    }

    public void sendSuggestion(Long memberId, String suggestionType) {
        Boarding boarding = boardingRepository.findByMemberId(memberId).orElseThrow();
        List<Member> adminList = memberRepository.findAllByFavoriteLineAndRole(boarding.getBusNumber(), Role.ADMIN);
        for (Member admin : adminList) {
            sendMessageToAdmin(admin.getId(), suggestionType);
        }
    }

    public List<NotificationResponse> findNotifications(Long memberId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "timestamp");
        List<Notification> notifications = notificationRepository.findAllByReceiverIdOrReceiverIdIsNull(memberId, sort);
        return notifications.stream()
                .map(notification -> new NotificationResponse(notification.getType().name(), notification.getPostId()))
                .collect(Collectors.toList());
    }
}
