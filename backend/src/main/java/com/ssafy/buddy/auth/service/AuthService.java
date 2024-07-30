package com.ssafy.buddy.auth.service;

import com.ssafy.buddy.auth.controller.domain.RefreshToken;
import com.ssafy.buddy.auth.controller.request.LoginRequest;
import com.ssafy.buddy.auth.controller.response.LoginResponse;
import com.ssafy.buddy.auth.repository.RefreshTokenRepository;
import com.ssafy.buddy.auth.supports.JwtTokenProvider;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        Member member = memberRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("등록된 이메일이 없습니다"));

        if (passwordEncoder.matches(loginRequest.getPassword(), member.getPassword())) {
            String accessToken = jwtTokenProvider.createAccessToken(member);
            String refreshToken = jwtTokenProvider.createRefreshToken(member);
            refreshTokenRepository.save(new RefreshToken(refreshToken));
            return LoginResponse.from(member, accessToken, refreshToken);
        }
        throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
    }
}
