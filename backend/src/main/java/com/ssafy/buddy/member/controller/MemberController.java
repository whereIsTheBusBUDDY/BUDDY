package com.ssafy.buddy.member.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.member.controller.request.PasswordRequest;
import com.ssafy.buddy.member.controller.request.SignUpRequest;
import com.ssafy.buddy.member.controller.request.UpdateRequest;
import com.ssafy.buddy.member.controller.response.IdcardCheckResponse;
import com.ssafy.buddy.member.controller.response.MemberResponse;
import com.ssafy.buddy.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @Value("${app.fastapi.url")
    private String fastApiUrl;

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

    @PostMapping("/check-password")
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

    @PostMapping("/upload")
    public ResponseEntity<IdcardCheckResponse> image(@RequestParam("image") MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("File is missing");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", image.getResource());

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            //FastAPI 서버로 요청 전송
            String yoloUrl = fastApiUrl + "/yolo";
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<IdcardCheckResponse> response = restTemplate.exchange(
                    fastApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    IdcardCheckResponse.class
            );

            // FastAPI 응답을 프론트엔드로 반환
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error uploading image", e);
        }
    }
}
