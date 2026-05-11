package com.koupreng.backend.common;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> handleApiException(ApiException exception) {
        HttpStatus status = exception == null ? HttpStatus.INTERNAL_SERVER_ERROR : exception.getStatus();
        return error(status, messageOrDefault(exception, "Request could not be processed"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fields = new LinkedHashMap<>();
        for (FieldError error : exception.getBindingResult().getFieldErrors()) {
            fields.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = errorBody(HttpStatus.BAD_REQUEST, "Validation failed");
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler({BadCredentialsException.class, AccessDeniedException.class})
    public ResponseEntity<Map<String, Object>> handleSecurity(RuntimeException exception) {
        HttpStatus status = exception instanceof AccessDeniedException
                ? HttpStatus.FORBIDDEN
                : HttpStatus.UNAUTHORIZED;
        return error(status, messageOrDefault(exception, "Authentication required"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception exception) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(errorBody(status, message));
    }

    private Map<String, Object> errorBody(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return body;
    }

    private String messageOrDefault(Exception exception, String defaultMessage) {
        if (exception == null || exception.getMessage() == null || exception.getMessage().isBlank()) {
            return defaultMessage;
        }
        return exception.getMessage();
    }
}
