package com.ssafy.buddy.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BuddyException extends RuntimeException {
    private final String code;
    private final String message;
    private final HttpStatus status;

    public BuddyException(ErrorCode errorCode) {
        this(errorCode.getCode(), errorCode.getMessage(), errorCode.getStatus());
    }

    public BuddyException(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
