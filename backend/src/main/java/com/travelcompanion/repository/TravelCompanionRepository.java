package com.travelcompanion.repository;

import com.travelcompanion.entity.TravelCompanion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TravelCompanionRepository extends JpaRepository<TravelCompanion, Long> {
    List<TravelCompanion> findByUserId(Long userId);
    List<TravelCompanion> findByDestinationNameContainingIgnoreCase(String destination);
}
