package com.ssafy.buddy.auth.controller;

import com.ssafy.buddy.auth.controller.request.LoginRequest;
import com.ssafy.buddy.auth.controller.response.LoginResponse;
import com.ssafy.buddy.auth.controller.response.RefreshResponse;
import com.ssafy.buddy.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public RefreshResponse refresh(@RequestParam("refreshToken") String refreshToken) {
        return authService.refresh(refreshToken);
    }

    @PostMapping("/out")
    public void logout(@RequestParam("refreshToken") String refreshToken) {
        authService.logout(refreshToken);
    }
}
