package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "travel_companions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelCompanion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String destinationName;

    private String travelDates;

    private String interests;

    @Column(length = 1000)
    private String bio;

    private String contactInfo;
}
