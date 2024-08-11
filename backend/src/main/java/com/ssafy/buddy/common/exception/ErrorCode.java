package com.ssafy.buddy.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    EXPIRED_ACCESS_TOKEN("4000", "AccessToken 만료", HttpStatus.UNAUTHORIZED),
    EXPIRED_REFRESH_TOKEN("4001", "RefreshToken 만료", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN("4002", "유효하지 않은 토큰", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED("4003", "접근 권한이 없음", HttpStatus.FORBIDDEN),
    ENTITY_NOT_FOUND("4004", "엔티티 없음", HttpStatus.BAD_REQUEST),
    ILLEGAL_ARGUMENT("4005", "적절하지 않은 인자", HttpStatus.BAD_REQUEST),
    MISSING_TOKEN("4006", "토큰 없음", HttpStatus.UNAUTHORIZED),
    JSON_MAPPING_WRONG("4007", "Json 파싱 실패", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus status;
}
