package com.ssafy.buddy;

import com.jayway.jsonpath.JsonPath;
import com.ssafy.buddy.auth.controller.request.LoginRequest;
import com.ssafy.buddy.member.controller.request.SignUpRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class MemberAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("회원가입한다")
    void signUp() throws Exception {
        signUp("kimssafy@gmail.com", "password")
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/members/")));
    }

    @Test
    @DisplayName("중복된 이메일로 회원가입을 시도한다")
    void signUpWithDuplicateEmail() throws Exception {
        signUp("kimssafy@gmail.com", "password");
        signUp("kimssafy@gmail.com", "password")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("이미 등록된 이메일입니다."));
    }

    @Test
    @DisplayName("내 정보를 조회한다")
    void findMyInfo() throws Exception {
        String accessToken = signUpAndLogin("kimssafy@gmail.com", "password");

        mockMvc.perform(get("/members/me")
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("싸피싸피"))
                .andExpect(jsonPath("$.favoriteLine").value(3));
    }

    @Test
    @DisplayName("북마크를 등록하고 조회한다")
    void addBookmark() throws Exception {
        String accessToken = signUpAndLogin("kimssafy@gmail.com", "password");

        // 28번 정류장 북마크 등록
        mockMvc.perform(post("/bookmarks")
                        .header("Authorization", "Bearer " + accessToken)
                .param("stationId", "28"))
                .andExpect(status().isOk());

        // 북마크 조회
        mockMvc.perform(get("/bookmarks")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].stationId").value(28))
                .andExpect(jsonPath("$[0].stationName").value("한밭대 뚜레주르"))
                .andExpect(jsonPath("$[0].bookmarked").value(true));
    }

    @Test
    @DisplayName("버스 선택해서 정거장을 조회한다")
    void checkRouteWithBookmark() throws Exception {
        String accessToken = signUpAndLogin("kimssafy@gmail.com", "password");

        // 28번 정류장 등록 (4호차)
        mockMvc.perform(post("/bookmarks")
                        .header("Authorization", "Bearer " + accessToken)
                        .param("stationId", "28"));

        // 4호차 정류장 조회. 28번 정류장만 bookmarked true
        mockMvc.perform(get("/routes")
                        .header("Authorization", "Bearer " + accessToken)
                        .param("busId", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(10))
                .andExpect(jsonPath("$[?(@.stationId == 28)].bookmarked").value(true));
    }

    private ResultActions signUp(String email, String password) throws Exception {
        var request = new SignUpRequest("김싸피", "1133555", "싸피싸피", email, password, 3);
        return mockMvc.perform(post("/sign-up")
                        .content(objectMapper.writeValueAsString(request))
                        .contentType(MediaType.APPLICATION_JSON));
    }

    private String signUpAndLogin(String email, String password) throws Exception {
        signUp(email, password);

        var loginResponse = mockMvc.perform(post("/login")
                        .content(objectMapper.writeValueAsString(new LoginRequest(email, password)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse().getContentAsString();

        return JsonPath.read(loginResponse, "$.accessToken");
    }
}
