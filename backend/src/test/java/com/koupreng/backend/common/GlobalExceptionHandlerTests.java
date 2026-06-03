package com.koupreng.backend.common;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTests {

    @Test
    void methodNotSupportedReturns405InsteadOfGeneric500() {
        MessageService messageService = mock(MessageService.class);
        when(messageService.get("error.method.notSupported")).thenReturn("Request method is not supported");
        GlobalExceptionHandler handler = new GlobalExceptionHandler(messageService);

        ResponseEntity<Map<String, Object>> response = handler.handleMethodNotSupported(
                new HttpRequestMethodNotSupportedException("GET", List.of("POST"))
        );

        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
        assertEquals(405, response.getBody().get("status"));
        assertEquals("Request method is not supported", response.getBody().get("message"));
    }
}
