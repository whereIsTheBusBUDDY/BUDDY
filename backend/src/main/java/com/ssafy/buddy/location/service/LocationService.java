package com.ssafy.buddy.location.service;

import com.ssafy.buddy.boarding.repository.BoardingRepository;
import com.ssafy.buddy.location.domain.*;
import com.ssafy.buddy.location.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final FirstBusRepository firstBusRepository;
    private final SecondBusRepository secondBusRepository;
    private final ThirdBusRepository thirdBusRepository;
    private final FourthRepository fourthRepository;
    private final FifthBusRepository fifthBusRepository;
    private final SixthBusRepository sixthBusRepository;
    private final BoardingRepository boardingRepository;
    public FirstBus getLatestFirstBusLocation() {
        return firstBusRepository.findFirstBusLastLocation()
                .orElseThrow(() -> new EntityNotFoundException("1호차 위치가 존재하지 않습니다."));
    }

    public SecondBus getLatestSecondBusLocation() {
        return secondBusRepository.findSecondBusLastLocation()
                .orElseThrow(() -> new EntityNotFoundException("2호차 위치가 존재하지 않습니다."));
    }

    public ThirdBus getLatestThirdBusLocation() {
        return thirdBusRepository.findThirdBusLastLocation()
                .orElseThrow(() -> new EntityNotFoundException("3호차 위치가 존재하지 않습니다."));
    }

    public FourthBus getLatestFourthBusLocation() {
        return fourthRepository.findFourthBusLastLocation()
                .orElseThrow(() -> new EntityNotFoundException("4호차 위치가 존재하지 않습니다."));
    }

    public FifthBus getLatestFifthBusLocation() {
        return fifthBusRepository.findFifthBusLastLocation()
                .orElseThrow(() -> new EntityNotFoundException("5호차 위치가 존재하지 않습니다."));
    }

    public SixthBus getLatestSixthBusLocation() {
        return sixthBusRepository.findSixthBusLastLocation()
                .orElseThrow(() -> new EntityNotFoundException("6호차 위치가 존재하지 않습니다."));
    }

    public void deleteFirstBusLocation() {
        firstBusRepository.deleteAll();
    }

    public void deleteSecondBusLocation() {
        secondBusRepository.deleteAll();
    }

    public void deleteThirdBusLocation() {
        thirdBusRepository.deleteAll();
    }

    public void deleteFourthBusLocation() {
        fourthRepository.deleteAll();
    }

    public void deleteFifthBusLocation() {
        fifthBusRepository.deleteAll();
    }

    public void deleteSixthBusLocation() {
        sixthBusRepository.deleteAll();
    }

    @Transactional
    public void DeleteAllBusLocations() {
        firstBusRepository.deleteAll();
        secondBusRepository.deleteAll();
        thirdBusRepository.deleteAll();
        fourthRepository.deleteAll();
        fifthBusRepository.deleteAll();
        sixthBusRepository.deleteAll();
    }
    @Transactional
    public void stopBus(int budId){
        if(budId == 1){
            boardingRepository.deleteBoardingByBusNumber(budId);
            firstBusRepository.deleteAll();
        }else if(budId == 2){
            boardingRepository.deleteBoardingByBusNumber(budId);
            secondBusRepository.deleteAll();
        }else if(budId == 3){
            boardingRepository.deleteBoardingByBusNumber(budId);
            thirdBusRepository.deleteAll();
        }else if(budId == 4){
            boardingRepository.deleteBoardingByBusNumber(budId);
            fourthRepository.deleteAll();
        }else if(budId == 5){
            boardingRepository.deleteBoardingByBusNumber(budId);
            fifthBusRepository.deleteAll();
        }else if(budId == 6){
            boardingRepository.deleteBoardingByBusNumber(budId);
            sixthBusRepository.deleteAll();
        }else {
            throw new IllegalArgumentException("유효하지 않은 버스번호입니다");
        }
    }
}
