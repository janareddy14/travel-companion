package com.travelcompanion.service;

import com.travelcompanion.dto.CompanionDTO;
import com.travelcompanion.entity.TravelCompanion;
import com.travelcompanion.entity.User;
import com.travelcompanion.repository.TravelCompanionRepository;
import com.travelcompanion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanionService {

    private final TravelCompanionRepository companionRepository;
    private final UserRepository userRepository;

    public List<CompanionDTO> getAllCompanions() {
        return companionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CompanionDTO> searchByDestination(String destination) {
        return companionRepository.findByDestinationNameContainingIgnoreCase(destination).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CompanionDTO createCompanion(String username, CompanionDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TravelCompanion companion = TravelCompanion.builder()
                .user(user)
                .destinationName(dto.getDestinationName())
                .travelDates(dto.getTravelDates())
                .interests(dto.getInterests())
                .bio(dto.getBio())
                .contactInfo(dto.getContactInfo())
                .build();

        companion = companionRepository.save(companion);
        return toDTO(companion);
    }

    public void deleteCompanion(Long id) {
        companionRepository.deleteById(id);
    }

    private CompanionDTO toDTO(TravelCompanion c) {
        return CompanionDTO.builder()
                .id(c.getId())
                .userId(c.getUser().getId())
                .username(c.getUser().getUsername())
                .destinationName(c.getDestinationName())
                .travelDates(c.getTravelDates())
                .interests(c.getInterests())
                .bio(c.getBio())
                .contactInfo(c.getContactInfo())
                .build();
    }
}
