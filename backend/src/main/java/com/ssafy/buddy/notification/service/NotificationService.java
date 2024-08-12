package com.ssafy.buddy.notification.service;

import com.ssafy.buddy.boarding.domain.Boarding;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.domain.Role;
import com.ssafy.buddy.boarding.repository.BoardingRepository;
import com.ssafy.buddy.member.repository.MemberRepository;
import com.ssafy.buddy.notification.controller.response.NotificationResponse;
import com.ssafy.buddy.notification.domain.Notification;
import com.ssafy.buddy.notification.domain.NotificationReadStatus;
import com.ssafy.buddy.notification.domain.NotificationType;
import com.ssafy.buddy.notification.repository.NotificationReadStatusRepository;
import com.ssafy.buddy.notification.repository.NotificationRepository;
import com.ssafy.buddy.notification.repository.SseEmitterRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static com.ssafy.buddy.notification.domain.NotificationType.SUGGEST;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SseEmitterRepository sseEmitterRepository;
    private final MemberRepository memberRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationReadStatusRepository notificationReadStatusRepository;
    private final BoardingRepository boardingRepository;

    public SseEmitter subscribe(Long memberId) {
        SseEmitter sseEmitter = new SseEmitter(30_000L);
        sseEmitter.onCompletion(() -> sseEmitterRepository.deleteById(memberId));
        sseEmitter.onTimeout(() -> sseEmitterRepository.deleteById(memberId));
        sendMessage(sseEmitter);
        return sseEmitterRepository.save(memberId, sseEmitter);
    }

    public void sendMessageToAllMembers(NotificationType type, String message) {
        sseEmitterRepository.findAll()
                .forEach(sseEmitter -> sendMessage(sseEmitter, type, message));
    }

    public void sendMessageToMember(NotificationType type, Long receiverId, String suggestion) {
        sseEmitterRepository.findById(receiverId)
                .ifPresent(sseEmitter -> sendMessage(sseEmitter, type, suggestion));
    }

    private void sendMessage(SseEmitter sseEmitter, NotificationType type, String message) {
        try {
            sseEmitter.send(SseEmitter.event()
                    .name(type.toString())
                    .data(message));
        } catch (IOException e) {
            log.warn("알림 보내기 실패!!", e);
        }
    }

    private void sendMessage(SseEmitter sseEmitter) {
        try {
            sseEmitter.send(SseEmitter.event()
                    .name("CONNECT")
                    .data("연결!"));
        } catch (IOException e) {
            log.warn("알림 보내기 실패!!", e);
        }
    }

    public void sendSuggestion(Long memberId, String suggestion) {
        Member member = findByMemberId(memberId);
        Boarding boarding = boardingRepository.findByMemberId(memberId).orElseThrow();
        List<Member> adminList = memberRepository.findAllByFavoriteLineAndRole(boarding.getBusNumber(), Role.ADMIN);

        for (Member admin : adminList) {
            notificationRepository.save(new Notification(admin.getId(), member.getName(), suggestion));
            sendMessageToMember(SUGGEST, admin.getId(), suggestion);
        }
    }

    @Transactional
    public void updateReadStatus(Long memberId, Long notificationId) {
        notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("알림(notificationId: " + notificationId + ")이 존재하지 않습니다."));

        if (!notificationReadStatusRepository.existsByNotificationIdAndMemberId(notificationId, memberId)) {
            notificationReadStatusRepository.save(new NotificationReadStatus(notificationId, memberId));
        }
    }

    public List<NotificationResponse> findNotifications(Long memberId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "timestamp");
        List<Notification> notifications = notificationRepository.findAllByReceiverIdOrReceiverIdIsNull(memberId, sort);

        return notifications.stream()
                .map(notification -> {
                    boolean isRead = notificationReadStatusRepository.existsByNotificationIdAndMemberId(notification.getId(), memberId);
                    return NotificationResponse.from(notification, isRead);
                })
                .collect(Collectors.toList());
    }

    private Member findByMemberId(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원(memberId: " + memberId + ")이 존재하지 않습니다."));
    }
}
