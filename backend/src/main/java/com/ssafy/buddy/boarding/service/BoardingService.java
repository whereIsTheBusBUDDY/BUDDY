package com.ssafy.buddy.boarding.service;

import com.ssafy.buddy.boarding.domain.Boarding;
import com.ssafy.buddy.boarding.repository.BoardingRepository;
import com.ssafy.buddy.bookmark.repository.BookmarkRepository;
import com.ssafy.buddy.notification.domain.Notification;
import com.ssafy.buddy.notification.domain.NotificationType;
import com.ssafy.buddy.notification.repository.NotificationRepository;
import com.ssafy.buddy.notification.service.NotificationService;
import com.ssafy.buddy.station.domain.Station;
import com.ssafy.buddy.station.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardingService {
    private final BoardingRepository boardingRepository;
    private final StationRepository stationRepository;
    private final BookmarkRepository bookmarkRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Transactional
    public void scanQrCode(Long memberId, int busNumber) {
        boardingRepository.findByMemberId(memberId)
                .ifPresentOrElse(
                        boarding -> boarding.updateBusNumber(busNumber),
                        () -> boardingRepository.save(new Boarding(memberId, busNumber))
                );
    }

    public Map<Integer, Long> getBoardingCountByBusNumber() {
        List<Object[]> results = boardingRepository.countBoardingByBusNumber();

        Map<Integer, Long> boardingCountByBusNumber = new HashMap<>();
        for (Object[] result : results) {
            Integer busNumber = (Integer) result[0];
            Long count = (Long) result[1];
            boardingCountByBusNumber.put(busNumber, count);
        }

        for (int i = 1; i <= 6; i++) {
            boardingCountByBusNumber.putIfAbsent(i, 0L);
        }

        return boardingCountByBusNumber;
    }

    public void isNextStationBookmarked(int stationId, int time) {
        Station currentStation = stationRepository.findById(stationId).orElseThrow();
        int currentBusLine = currentStation.getBusLine();

        int nextStationId;
        if (time == 1) nextStationId = stationId + 1;
        else nextStationId = stationId - 1;

        Station nextStation = stationRepository.findById(nextStationId).orElse(null);
        if (nextStation == null || nextStation.getBusLine() != currentBusLine) return;

        List<Long> memberIds = bookmarkRepository.findMemberIdsByStationId(nextStationId);
        for (Long memberId : memberIds) {
            notificationRepository.save(new Notification(memberId, currentStation));
            notificationService.sendMessageToMember(NotificationType.ARRIVE, memberId, currentStation.getStationName());
        }
    }

    public int countBoardingByBusNumber(int busNumber) {
        return boardingRepository.countBoardingByBusNumber(busNumber);
    }
}
