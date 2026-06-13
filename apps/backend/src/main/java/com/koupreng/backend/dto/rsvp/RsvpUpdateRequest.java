package com.koupreng.backend.dto.rsvp;

import com.koupreng.backend.enums.RsvpStatus;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class RsvpUpdateRequest {

    private RsvpStatus responseStatus;

    @Min(value = 0, message = "Attendee count must be zero or greater")
    private Integer attendeeCount;

    private String message;
}
