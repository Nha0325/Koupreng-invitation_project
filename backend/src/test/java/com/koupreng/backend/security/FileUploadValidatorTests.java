package com.koupreng.backend.security;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.koupreng.backend.common.ApiException;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;

class FileUploadValidatorTests {

    private final ApiSecurityProperties properties = new ApiSecurityProperties();
    private final FileUploadValidator validator = new FileUploadValidator(properties);

    @Test
    void acceptsAllowedPngWithMatchingSignature() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "invite.png",
                "image/png",
                new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A}
        );

        assertDoesNotThrow(() -> validator.validate(file));
    }

    @Test
    void rejectsContentTypeThatDoesNotMatchExtension() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "invite.jpg",
                "image/png",
                new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47}
        );

        ApiException exception = assertThrows(ApiException.class, () -> validator.validate(file));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Uploaded file extension does not match its content type", exception.getMessage());
    }

    @Test
    void rejectsMismatchedSignature() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "invite.pdf",
                "application/pdf",
                new byte[]{0x50, 0x4B, 0x03, 0x04}
        );

        ApiException exception = assertThrows(ApiException.class, () -> validator.validate(file));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Uploaded file content does not match its declared type", exception.getMessage());
    }

    @Test
    void rejectsUnsafeFilename() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "../invite.png",
                "image/png",
                new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47}
        );

        ApiException exception = assertThrows(ApiException.class, () -> validator.validate(file));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Uploaded file name is invalid", exception.getMessage());
    }

    @Test
    void rejectsOversizedFile() {
        properties.getUpload().setMaxFileSizeBytes(3);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "invite.png",
                "image/png",
                new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47}
        );

        ApiException exception = assertThrows(ApiException.class, () -> validator.validate(file));

        assertEquals(HttpStatus.CONTENT_TOO_LARGE, exception.getStatus());
    }
}
