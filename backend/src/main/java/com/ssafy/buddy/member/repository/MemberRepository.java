package com.ssafy.buddy.member.repository;

import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Boolean existsByEmail(String email);
    Boolean existsByStudentId(String studentId);
    Boolean existsByNickname(String nickname);
    Optional<Member> findByEmail(String email);
    List<Member> findAllByFavoriteLineAndRole(int busNumber, Role role);
}
