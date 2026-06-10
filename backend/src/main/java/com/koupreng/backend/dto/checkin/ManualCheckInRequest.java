package com.koupreng.backend.dto.checkin;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ManualCheckInRequest {

    @Size(max = 1000)
    private String note;
}
