package com.ssafy.buddy.boarding.repository;

import com.ssafy.buddy.boarding.domain.Boarding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BoardingRepository extends JpaRepository<Boarding, Long> {
    Optional<Boarding> findByMemberId(Long memberId);

    @Query("select busNumber, count(*) from Boarding GROUP BY busNumber")
    List<Object[]> countBoardingByBusNumber();
    void deleteBoardingByBusNumber(int busNumber);
}
