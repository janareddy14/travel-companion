package com.travelcompanion.service;

import com.travelcompanion.dto.DestinationDTO;
import com.travelcompanion.entity.Destination;
import com.travelcompanion.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DestinationDTO getDestinationById(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
        return toDTO(destination);
    }

    public List<DestinationDTO> searchDestinations(String query) {
        return destinationRepository.searchDestinations(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DestinationDTO createDestination(DestinationDTO dto) {
        Destination destination = toEntity(dto);
        destination = destinationRepository.save(destination);
        return toDTO(destination);
    }

    public DestinationDTO updateDestination(Long id, DestinationDTO dto) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destination.setName(dto.getName());
        destination.setCountry(dto.getCountry());
        destination.setDescription(dto.getDescription());
        destination.setImageUrl(dto.getImageUrl());
        destination.setBestSeason(dto.getBestSeason());
        destination.setEstimatedCost(dto.getEstimatedCost());
        destination.setLatitude(dto.getLatitude());
        destination.setLongitude(dto.getLongitude());
        destination.setHighlights(dto.getHighlights());
        destination.setRating(dto.getRating());

        destination = destinationRepository.save(destination);
        return toDTO(destination);
    }

    public void deleteDestination(Long id) {
        destinationRepository.deleteById(id);
    }

    private DestinationDTO toDTO(Destination d) {
        return DestinationDTO.builder()
                .id(d.getId())
                .name(d.getName())
                .country(d.getCountry())
                .description(d.getDescription())
                .imageUrl(d.getImageUrl())
                .bestSeason(d.getBestSeason())
                .estimatedCost(d.getEstimatedCost())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                .highlights(d.getHighlights())
                .rating(d.getRating())
                .build();
    }

    private Destination toEntity(DestinationDTO dto) {
        return Destination.builder()
                .name(dto.getName())
                .country(dto.getCountry())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .bestSeason(dto.getBestSeason())
                .estimatedCost(dto.getEstimatedCost())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .highlights(dto.getHighlights())
                .rating(dto.getRating())
                .build();
    }
}
