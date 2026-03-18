package com.travelcompanion.controller;

import com.travelcompanion.dto.CompanionDTO;
import com.travelcompanion.service.CompanionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companions")
@RequiredArgsConstructor
public class CompanionController {

    private final CompanionService companionService;

    @GetMapping
    public ResponseEntity<List<CompanionDTO>> getAllCompanions() {
        return ResponseEntity.ok(companionService.getAllCompanions());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CompanionDTO>> searchCompanions(@RequestParam String destination) {
        return ResponseEntity.ok(companionService.searchByDestination(destination));
    }

    @PostMapping
    public ResponseEntity<CompanionDTO> createCompanion(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CompanionDTO dto) {
        return ResponseEntity.ok(companionService.createCompanion(userDetails.getUsername(), dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompanion(@PathVariable Long id) {
        companionService.deleteCompanion(id);
        return ResponseEntity.noContent().build();
    }
}
