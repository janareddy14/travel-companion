package com.travelcompanion.service;

import com.travelcompanion.dto.ChecklistDTO;
import com.travelcompanion.entity.ChecklistItem;
import com.travelcompanion.entity.Trip;
import com.travelcompanion.repository.ChecklistRepository;
import com.travelcompanion.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChecklistService {

    private final ChecklistRepository checklistRepository;
    private final TripRepository tripRepository;

    public List<ChecklistDTO> getChecklistByTrip(Long tripId) {
        return checklistRepository.findByTripId(tripId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ChecklistDTO addItem(ChecklistDTO dto) {
        Trip trip = tripRepository.findById(dto.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        ChecklistItem item = ChecklistItem.builder()
                .trip(trip)
                .itemName(dto.getItemName())
                .completed(false)
                .build();

        item = checklistRepository.save(item);
        return toDTO(item);
    }

    public ChecklistDTO toggleItem(Long id) {
        ChecklistItem item = checklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist item not found"));
        item.setCompleted(!item.isCompleted());
        item = checklistRepository.save(item);
        return toDTO(item);
    }

    public void deleteItem(Long id) {
        checklistRepository.deleteById(id);
    }

    private ChecklistDTO toDTO(ChecklistItem item) {
        return ChecklistDTO.builder()
                .id(item.getId())
                .tripId(item.getTrip().getId())
                .itemName(item.getItemName())
                .completed(item.isCompleted())
                .build();
    }
}
