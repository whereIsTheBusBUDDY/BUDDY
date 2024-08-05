package com.ssafy.buddy.member.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.member.controller.request.PasswordRequest;
import com.ssafy.buddy.member.controller.request.SignUpRequest;
import com.ssafy.buddy.member.controller.request.UpdateRequest;
import com.ssafy.buddy.member.controller.response.MemberResponse;
import com.ssafy.buddy.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/sign-up")
    public ResponseEntity<Void> signUp(@Valid @RequestBody SignUpRequest request) {
        Long memberId = memberService.signUp(request);
        return ResponseEntity.created(URI.create("/members/" + memberId)).build();
    }

    @PostMapping("/admin")
    public ResponseEntity<Void> registerAdmin(@Valid @RequestBody SignUpRequest request) {
        Long memberId = memberService.registerAdmin(request);
        return ResponseEntity.created(URI.create("/members/" + memberId)).build();
    }

    @GetMapping("/members/me")
    public MemberResponse findInfo(@LoginMember Long memberId) {
        return memberService.findInfo(memberId);
    }

    @PutMapping("/members/me")
    public void updateInfo(@LoginMember Long memberId, @RequestBody UpdateRequest request) {
        memberService.updateInfo(memberId, request);
    }

    @GetMapping("/check-studentId")
    public boolean isStudentIdDuplicated(@RequestParam("studentId") String studentId) {
        return memberService.isStudentIdDuplicated(studentId);
    }

    @GetMapping("/check-password")
    public boolean checkPassword(@LoginMember Long memberId, @RequestBody PasswordRequest request) {
        return memberService.checkPassword(memberId, request.getPassword());
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestParam("email") String email) {
        memberService.resetPassword(email);
    }

    @PutMapping("/update-password")
    public void updatePassword(@LoginMember Long memberId, @RequestBody PasswordRequest request) {
        memberService.updatePassword(memberId, request.getPassword());
    }

    @PostMapping("/scan")
    public void scanQrCode(@LoginMember Long memberId, @RequestParam("busNumber") int busNumber) {
        memberService.scanQrCode(memberId, busNumber);
    }
}
