package com.ssafy.buddy.notification.repository;

import com.ssafy.buddy.notification.domain.NotificationReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationReadStatusRepository extends JpaRepository<NotificationReadStatus, Long> {
    boolean existsByNotificationIdAndMemberId(Long notificationId, Long memberId);
}
