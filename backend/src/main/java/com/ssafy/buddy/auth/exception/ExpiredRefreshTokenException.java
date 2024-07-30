package com.ssafy.buddy.auth.exception;

import com.ssafy.buddy.common.exception.BuddyException;

import static com.ssafy.buddy.common.exception.ErrorCode.EXPIRED_REFRESH_TOKEN;

public class ExpiredRefreshTokenException extends BuddyException {
    public ExpiredRefreshTokenException() {
        super(EXPIRED_REFRESH_TOKEN);
    }

    public ExpiredRefreshTokenException(String message) {
        super(EXPIRED_REFRESH_TOKEN.getCode(), message, EXPIRED_REFRESH_TOKEN.getStatus());
    }
}
