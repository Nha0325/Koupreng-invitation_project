package com.koupreng.backend.service.storage;

import com.koupreng.backend.enums.MediaType;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    StorageUploadResult upload(MultipartFile file, MediaType mediaType, Long invitationId);

    void delete(String publicId, MediaType mediaType);

    String providerName();
}
