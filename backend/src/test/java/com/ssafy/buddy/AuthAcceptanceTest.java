package com.ssafy.buddy;

import com.jayway.jsonpath.JsonPath;
import com.ssafy.buddy.auth.controller.request.LoginRequest;
import com.ssafy.buddy.member.controller.request.SignUpRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AuthAcceptanceTest extends AcceptanceTest {

    @Test
    @DisplayName("로그인한다")
    void login() throws Exception {
        signUp("kimssafy@gmail.com", "password");

        mockMvc.perform(post("/login")
                .content(objectMapper.writeValueAsString(new LoginRequest("kimssafy@gmail.com", "password")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").exists())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    @DisplayName("등록하지 않은 이메일로 로그인한다")
    void loginWithNonExistingEmail() throws Exception {
        signUp("kimssafy@gmail.com", "password");

        login("leessafy@gmail.com", "password")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("4005"))
                .andExpect(jsonPath("$.message").value("등록된 이메일이 없습니다"));
    }

    @Test
    @DisplayName("잘못된 비밀번호로 로그인한다")
    void loginWithIncorrectPassword() throws Exception {
        signUp("kimssafy@gmail.com", "password");

        login("kimssafy@gmail.com", "pass")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("4005"))
                .andExpect(jsonPath("$.message").value("비밀번호가 틀렸습니다."));
    }

    @Test
    @DisplayName("토큰을 재발급한다")
    void refreshToken() throws Exception {
        signUp("kimssafy@gmail.com", "password");

        String refreshToken = JsonPath.read(
                login("kimssafy@gmail.com", "password").andReturn().getResponse().getContentAsString(),
                "$.refreshToken");

        mockMvc.perform(post("/refresh")
                        .param("refreshToken", refreshToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }


    private void signUp(String email, String password) throws Exception {
        var request = new SignUpRequest("김싸피", "1133555", "싸피싸피", email, password, 3);
        mockMvc.perform(post("/sign-up")
                        .content(objectMapper.writeValueAsString(request))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    private ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(post("/login")
                .content(objectMapper.writeValueAsString(new LoginRequest(email, password)))
                .contentType(MediaType.APPLICATION_JSON));
    }
}
