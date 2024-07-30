package com.ssafy.buddy.common.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.ssafy.buddy.common.exception.ErrorCode.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BuddyException.class)
    public ResponseEntity<ErrorResponse> handleBuddyException(BuddyException exception) {
        ErrorResponse response = new ErrorResponse(exception.getCode(), exception.getMessage());
        return new ResponseEntity<>(response, exception.getStatus());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException exception) {
        ErrorResponse response = new ErrorResponse(ENTITY_NOT_FOUND.getCode(), exception.getMessage());
        return new ResponseEntity<>(response, ENTITY_NOT_FOUND.getStatus());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException exception) {
        ErrorResponse response = new ErrorResponse(ILLEGAL_ARGUMENT.getCode(), exception.getMessage());
        return new ResponseEntity<>(response, ILLEGAL_ARGUMENT.getStatus());
    }
}
