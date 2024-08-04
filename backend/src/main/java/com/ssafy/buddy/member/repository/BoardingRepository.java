package com.ssafy.buddy.member.repository;

import com.ssafy.buddy.member.domain.Boarding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardingRepository extends JpaRepository<Boarding, Long> {
    Optional<Boarding> findByMemberId(Long memberId);
}
