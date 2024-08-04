package com.ssafy.buddy.notification.repository;

import com.ssafy.buddy.notification.domain.Notification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByReceiverIdOrReceiverIdIsNull(Long memberId, Sort sort);
}
