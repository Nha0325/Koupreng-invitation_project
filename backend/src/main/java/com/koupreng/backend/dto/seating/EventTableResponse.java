package com.koupreng.backend.dto.seating;

import com.koupreng.backend.entity.invitation.EventTable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTableResponse {

    private Long id;
    private Long invitationId;
    private String tableName;
    private String tableLabel;
    private Integer capacity;
    private Integer assignedSeats;
    private Integer remainingSeats;
    private Integer sortOrder;
    private String notes;

    public static EventTableResponse from(EventTable table, int assignedSeats) {
        Integer tableCapacity = table.getCapacity();
        int capacity = tableCapacity == null ? 0 : tableCapacity;
        return EventTableResponse.builder()
                .id(table.getId())
                .invitationId(table.getInvitation() == null ? null : table.getInvitation().getId())
                .tableName(table.getTableName())
                .tableLabel(table.getTableLabel())
                .capacity(tableCapacity)
                .assignedSeats(assignedSeats)
                .remainingSeats(Math.max(0, capacity - assignedSeats))
                .sortOrder(table.getSortOrder())
                .notes(table.getNotes())
                .build();
    }
}
