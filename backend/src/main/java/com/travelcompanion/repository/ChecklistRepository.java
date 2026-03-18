package com.travelcompanion.repository;

import com.travelcompanion.entity.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChecklistRepository extends JpaRepository<ChecklistItem, Long> {
    List<ChecklistItem> findByTripId(Long tripId);
}
