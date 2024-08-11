package com.ssafy.buddy.member.exception;

import com.ssafy.buddy.common.exception.BuddyException;
import com.ssafy.buddy.common.exception.ErrorCode;

public class EmailSendFailException extends BuddyException {
    public EmailSendFailException(String message, Throwable cause) {
        super(cause, ErrorCode.EMAIL_SEND_FAIL, message);
    }
}
