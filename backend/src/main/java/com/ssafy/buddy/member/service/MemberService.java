package com.ssafy.buddy.member.service;

import com.ssafy.buddy.member.controller.request.SignUpRequest;
import com.ssafy.buddy.member.controller.response.MemberResponse;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.domain.Role;
import com.ssafy.buddy.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long signUp(SignUpRequest request) {
        return saveMember(request, Role.USER);
    }

    @Transactional
    public Long registerAdmin(SignUpRequest request) {
        return saveMember(request, Role.ADMIN);
    }

    private Long saveMember(SignUpRequest request, Role role) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        return memberRepository.save(request.toEntity(encodedPassword, role)).getId();
    }

    public MemberResponse findInfo(Long memberId) {
        Member member = findById(memberId);
        return MemberResponse.from(member);
    }

    private Member findById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원(memberId: " + memberId + ")이 존재하지 않습니다."));
    }
}
