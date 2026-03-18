package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private Double budget;

    @Enumerated(EnumType.STRING)
    private TravelType travelType;

    private String notes;

    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.PLANNED;

    public enum TravelType {
        SOLO, COUPLE, FAMILY, ADVENTURE, GROUP, BUSINESS
    }

    public enum TripStatus {
        PLANNED, ONGOING, COMPLETED, CANCELLED
    }
}
