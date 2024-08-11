package com.ssafy.buddy.common.exception;

public class CustomJsonProcessingException extends RuntimeException {
    public CustomJsonProcessingException(String msg) {
        super(msg);
    }

    public CustomJsonProcessingException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
