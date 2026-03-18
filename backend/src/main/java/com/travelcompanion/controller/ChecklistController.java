package com.travelcompanion.controller;

import com.travelcompanion.dto.ChecklistDTO;
import com.travelcompanion.service.ChecklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checklists")
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistService checklistService;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ChecklistDTO>> getChecklist(@PathVariable Long tripId) {
        return ResponseEntity.ok(checklistService.getChecklistByTrip(tripId));
    }

    @PostMapping
    public ResponseEntity<ChecklistDTO> addItem(@RequestBody ChecklistDTO dto) {
        return ResponseEntity.ok(checklistService.addItem(dto));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<ChecklistDTO> toggleItem(@PathVariable Long id) {
        return ResponseEntity.ok(checklistService.toggleItem(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        checklistService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
