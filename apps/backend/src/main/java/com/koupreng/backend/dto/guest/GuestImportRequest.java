package com.koupreng.backend.dto.guest;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GuestImportRequest {

    private List<GuestRequest> guests = new ArrayList<>();
}
