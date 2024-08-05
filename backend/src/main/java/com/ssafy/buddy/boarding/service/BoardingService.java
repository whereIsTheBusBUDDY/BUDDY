package com.ssafy.buddy.boarding.service;

import com.ssafy.buddy.boarding.domain.Boarding;
import com.ssafy.buddy.boarding.repository.BoardingRepository;
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
}
