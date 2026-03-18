package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String country;

    @Column(length = 2000)
    private String description;

    private String imageUrl;

    private String bestSeason;

    private Double estimatedCost;

    private Double latitude;

    private Double longitude;

    private String highlights;

    private Double rating;
}
