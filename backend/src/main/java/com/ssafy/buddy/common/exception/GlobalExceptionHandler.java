package com.ssafy.buddy.common.exception;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.ssafy.buddy.common.exception.ErrorCode.*;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BuddyException.class)
    public ResponseEntity<ErrorResponse> handleBuddyException(BuddyException exception) {
        ErrorResponse response = new ErrorResponse(exception.getCode(), exception.getMessage());
        log.error("BuddyException!!", exception);
        return new ResponseEntity<>(response, exception.getStatus());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException exception) {
        ErrorResponse response = new ErrorResponse(ENTITY_NOT_FOUND.getCode(), exception.getMessage());
        log.error("EntityNotFoundException!!", exception);
        return new ResponseEntity<>(response, ENTITY_NOT_FOUND.getStatus());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException exception) {
        ErrorResponse response = new ErrorResponse(ILLEGAL_ARGUMENT.getCode(), exception.getMessage());
        log.error("IllegalArgumentException!!", exception);
        return new ResponseEntity<>(response, ILLEGAL_ARGUMENT.getStatus());
    }

    @ExceptionHandler(CustomJsonProcessingException.class)
    public ResponseEntity<ErrorResponse> handleCustomJsonProcessingException(CustomJsonProcessingException exception) {
        ErrorResponse response = new ErrorResponse(JSON_MAPPING_WRONG.getCode(), exception.getMessage());
        log.error("CustomJsonProcessingException!!", exception);
        return new ResponseEntity<>(response, JSON_MAPPING_WRONG.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception) {
        ErrorResponse response = new ErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR.getCode(), exception.getMessage());
        log.error("Exception!!", exception);
        return new ResponseEntity<>(response, ErrorCode.INTERNAL_SERVER_ERROR.getStatus());
    }

}
