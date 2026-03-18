package com.travelcompanion.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {
    private Long id;
    private Long destinationId;
    private String destinationName;
    private String destinationCountry;
    private String destinationImage;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double budget;
    private String travelType;
    private String status;
    private String notes;
}
