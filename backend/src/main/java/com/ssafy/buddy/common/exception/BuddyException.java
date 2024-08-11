package com.ssafy.buddy.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BuddyException extends RuntimeException {
    private final String code;
    private final String message;
    private final HttpStatus status;

    public BuddyException(ErrorCode errorCode) {
        this(errorCode, errorCode.getMessage());
    }

    public BuddyException(ErrorCode errorCode, String message) {
        this(null, errorCode, message);
    }

    public BuddyException(Throwable cause, ErrorCode errorCode) {
        this(cause, errorCode.getCode(), errorCode.getMessage(), errorCode.getStatus());
    }

    public BuddyException(Throwable cause, ErrorCode errorCode, String message) {
        this(cause, errorCode.getCode(), message, errorCode.getStatus());
    }

    public BuddyException(Throwable cause, String code, String message, HttpStatus status) {
        super(message, cause);
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
