package com.koupreng.backend.service.storage;

public record StorageUploadResult(
        String fileUrl,
        String publicId,
        String storageProvider
) {
}
