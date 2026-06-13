package com.koupreng.backend.security;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import com.koupreng.backend.common.ApiException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUploadValidator {

    private static final Pattern SAFE_FILENAME = Pattern.compile("[\\p{Alnum}][\\p{Alnum} ._-]{0,180}");
    private static final Map<String, byte[][]> SIGNATURES = Map.of(
            "image/jpeg", new byte[][]{{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF}},
            "image/png", new byte[][]{{(byte) 0x89, 0x50, 0x4E, 0x47}},
            "application/pdf", new byte[][]{{0x25, 0x50, 0x44, 0x46}}
    );
    private static final Map<String, Set<String>> EXTENSION_CONTENT_TYPES = Map.of(
            ".jpg", Set.of("image/jpeg"),
            ".jpeg", Set.of("image/jpeg"),
            ".png", Set.of("image/png"),
            ".webp", Set.of("image/webp"),
            ".pdf", Set.of("application/pdf")
    );

    private final ApiSecurityProperties.Upload properties;

    public FileUploadValidator(ApiSecurityProperties apiSecurityProperties) {
        this.properties = apiSecurityProperties.getUpload();
    }

    public void validate(MultipartFile file) {
        if (!properties.isEnabled()) {
            return;
        }

        if (file == null || file.isEmpty()) {
            throw badRequest("Uploaded file is empty");
        }

        if (file.getSize() > properties.getMaxFileSizeBytes()) {
            throw new ApiException(HttpStatus.CONTENT_TOO_LARGE, "Uploaded file is too large");
        }

        String filename = safeFilename(file.getOriginalFilename());
        String extension = extension(filename);
        if (!properties.getAllowedExtensions().contains(extension)) {
            throw badRequest("Uploaded file extension is not allowed");
        }

        String contentType = normalizedContentType(file.getContentType());
        if (!properties.getAllowedContentTypes().contains(contentType)) {
            throw badRequest("Uploaded file type is not allowed");
        }

        if (!contentTypeMatchesExtension(extension, contentType)) {
            throw badRequest("Uploaded file extension does not match its content type");
        }

        if (properties.isVerifySignatures() && !hasExpectedSignature(file, contentType)) {
            throw badRequest("Uploaded file content does not match its declared type");
        }
    }

    private String safeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            throw badRequest("Uploaded file name is required");
        }

        String filename = originalFilename.trim();
        if (filename.contains("/") || filename.contains("\\") || filename.contains("..")) {
            throw badRequest("Uploaded file name is invalid");
        }

        if (!SAFE_FILENAME.matcher(filename).matches()) {
            throw badRequest("Uploaded file name contains unsupported characters");
        }

        return filename;
    }

    private String extension(String filename) {
        int index = filename.lastIndexOf('.');
        if (index < 0 || index == filename.length() - 1) {
            throw badRequest("Uploaded file extension is required");
        }
        return filename.substring(index).toLowerCase(Locale.ROOT);
    }

    private String normalizedContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            throw badRequest("Uploaded file content type is required");
        }
        return contentType.trim().toLowerCase(Locale.ROOT);
    }

    private boolean hasExpectedSignature(MultipartFile file, String contentType) {
        byte[] header = readHeader(file);
        if ("image/webp".equals(contentType)) {
            return isWebp(header);
        }

        byte[][] allowedSignatures = SIGNATURES.get(contentType);
        if (allowedSignatures == null) {
            return false;
        }

        for (byte[] signature : allowedSignatures) {
            if (startsWith(header, signature)) {
                return true;
            }
        }
        return false;
    }

    private boolean contentTypeMatchesExtension(String extension, String contentType) {
        Set<String> allowedContentTypes = EXTENSION_CONTENT_TYPES.get(extension);
        return allowedContentTypes != null && allowedContentTypes.contains(contentType);
    }

    private byte[] readHeader(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            return inputStream.readNBytes(16);
        } catch (IOException exception) {
            throw badRequest("Uploaded file could not be read");
        }
    }

    private boolean startsWith(byte[] value, byte[] prefix) {
        if (value.length < prefix.length) {
            return false;
        }

        for (int index = 0; index < prefix.length; index++) {
            if (value[index] != prefix[index]) {
                return false;
            }
        }
        return true;
    }

    private boolean isWebp(byte[] value) {
        return value.length >= 12
                && value[0] == 0x52
                && value[1] == 0x49
                && value[2] == 0x46
                && value[3] == 0x46
                && value[8] == 0x57
                && value[9] == 0x45
                && value[10] == 0x42
                && value[11] == 0x50;
    }

    private ApiException badRequest(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}
