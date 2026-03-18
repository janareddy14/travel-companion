package com.travelcompanion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistDTO {
    private Long id;
    private Long tripId;
    private String itemName;
    private boolean completed;
}
