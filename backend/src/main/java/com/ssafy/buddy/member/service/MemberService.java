package com.ssafy.buddy.member.service;

import com.ssafy.buddy.member.controller.request.SignUpRequest;
import com.ssafy.buddy.member.controller.request.UpdateRequest;
import com.ssafy.buddy.member.controller.response.MemberResponse;
import com.ssafy.buddy.member.domain.Boarding;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.domain.Role;
import com.ssafy.buddy.member.repository.BoardingRepository;
import com.ssafy.buddy.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final BoardingRepository boardingRepository;

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

    @Transactional
    public void updateInfo(Long memberId, UpdateRequest request) {
        Member member = findById(memberId);
        member.update(request.getNickname(), request.getFavoriteLine());
    }

    public boolean isStudentIdDuplicated(String studentId) {
        return memberRepository.existsByStudentId(studentId);
    }

    public boolean checkPassword(Long memberId, String password) {
        Member member = findById(memberId);
        return passwordEncoder.matches(password, member.getPassword());
    }

    @Transactional
    public void resetPassword(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("등록된 이메일이 없습니다."));

        String temporaryPassword = UUID.randomUUID().toString().substring(0, 6);
        member.updatePassword(passwordEncoder.encode(temporaryPassword));

        log.info("email : {}  password : {}", email, temporaryPassword);

        // TODO: emailSender.sendTemporaryPassword(email, temporaryPassword)
    }

    @Transactional
    public void updatePassword(Long memberId, String password) {
        Member member = findById(memberId);
        member.updatePassword(passwordEncoder.encode(password));
    }

    @Transactional
    public void scanQrCode(Long memberId, int busNumber) {
        Boarding boarding = new Boarding(memberId, busNumber);
        boardingRepository.save(boarding);
    }

    private Member findById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원(memberId: " + memberId + ")이 존재하지 않습니다."));
    }
}
