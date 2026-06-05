package com.koupreng.backend.dto.guest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestImportErrorResponse {

    private int rowNumber;
    private String reason;
}
