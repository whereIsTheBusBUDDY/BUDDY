package com.ssafy.buddy.member.controller.request;

import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String name;
    private String studentId;
    private String nickname;
    private String email;
    private String password;
    private int favoriteLine;

    public Member toEntity(String password, Role role) {
        return new Member(name, studentId, nickname, email, password, favoriteLine, role);
    }
}
