package com.koupreng.backend.common;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String message) {
        this(status, defaultCode(status), message);
    }

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code == null || code.isBlank() ? defaultCode(status) : code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    private static String defaultCode(HttpStatus status) {
        if (status == null) {
            return "INTERNAL_ERROR";
        }
        return switch (status) {
            case BAD_REQUEST -> "REQUEST_INVALID";
            case UNAUTHORIZED -> "AUTH_UNAUTHORIZED";
            case FORBIDDEN -> "AUTH_FORBIDDEN";
            case NOT_FOUND -> "RESOURCE_NOT_FOUND";
            case CONFLICT -> "RESOURCE_CONFLICT";
            case TOO_MANY_REQUESTS -> "RATE_LIMITED";
            default -> "API_ERROR";
        };
    }
}
