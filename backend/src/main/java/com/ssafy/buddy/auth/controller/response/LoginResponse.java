package com.ssafy.buddy.auth.controller.response;

import com.ssafy.buddy.member.domain.Member;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String nickname;
    private String accessToken;
    private String refreshToken;

    public static LoginResponse from(Member member, String accessToken, String refreshToken) {
        return new LoginResponse(member.getNickname(), accessToken, refreshToken);
    }
}
