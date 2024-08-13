package com.ssafy.buddy.member.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.buddy.member.controller.request.SignUpRequest;
import com.ssafy.buddy.member.controller.request.UpdateRequest;
import com.ssafy.buddy.member.controller.response.IdcardCheckResponse;
import com.ssafy.buddy.member.controller.response.MemberResponse;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.domain.Role;
import com.ssafy.buddy.member.repository.MemberRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final WebClient.Builder webClientBuilder;
    private WebClient webClient;
    private final EmailSender emailSender;

    private final Map<String, String> temporaryPasswordMap = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        this.webClient = webClientBuilder.build();
    }

    @Value("${app.fastapi.url}")
    private String fastApiUrl;

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

    public boolean isNicknameDuplicated(String nickname) {
        return memberRepository.existsByNickname(nickname);
    }

    public boolean checkPassword(Long memberId, String password) {
        Member member = findById(memberId);
        return passwordEncoder.matches(password, member.getPassword());
    }

    @Transactional
    public void sendPasswordEmail(String email) {
        memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("등록된 이메일이 없습니다."));

        String temporaryPassword = UUID.randomUUID().toString().substring(0, 6);
        String id = UUID.randomUUID().toString();
        temporaryPasswordMap.put(id, temporaryPassword);

        emailSender.sendTemporaryPassword(email, id, temporaryPassword);
    }

    @Transactional
    public void resetPassword(String email, String id) {
        String temporaryPassword = temporaryPasswordMap.get(id);
        if (temporaryPassword == null) throw new IllegalArgumentException("잘못된 id");

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("등록된 이메일이 없습니다."));

        member.updatePassword(passwordEncoder.encode(temporaryPassword));
        temporaryPasswordMap.remove(id);
    }

    @Transactional
    public void updatePassword(Long memberId, String password) {
        Member member = findById(memberId);
        member.updatePassword(passwordEncoder.encode(password));
    }

    public ResponseEntity<IdcardCheckResponse> sendImageToFastApi(MultipartFile image){
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("File is missing");
        }

        String yoloUrl = fastApiUrl + "/yolo";

        String responseBody = webClient.post()
                .uri(yoloUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE)
                .body(BodyInserters.fromMultipartData("file", image.getResource()))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();
        IdcardCheckResponse response = null;
        try {
            response = mapper.readValue(responseBody, IdcardCheckResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(response);
    }

    private Member findById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원(memberId: " + memberId + ")이 존재하지 않습니다."));
    }
}
