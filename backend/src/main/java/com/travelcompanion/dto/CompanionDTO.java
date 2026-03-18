package com.travelcompanion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanionDTO {
    private Long id;
    private Long userId;
    private String username;
    private String destinationName;
    private String travelDates;
    private String interests;
    private String bio;
    private String contactInfo;
}
