package com.ssafy.buddy.member.controller.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {
    private String nickname;
    private String password;
    private int favoriteLine;
}
