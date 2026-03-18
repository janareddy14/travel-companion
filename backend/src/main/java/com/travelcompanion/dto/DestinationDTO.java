package com.travelcompanion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationDTO {
    private Long id;
    private String name;
    private String country;
    private String description;
    private String imageUrl;
    private String bestSeason;
    private Double estimatedCost;
    private Double latitude;
    private Double longitude;
    private String highlights;
    private Double rating;
}
