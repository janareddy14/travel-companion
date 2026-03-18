package com.travelcompanion.service;

import com.travelcompanion.dto.TripRequest;
import com.travelcompanion.dto.TripResponse;
import com.travelcompanion.entity.*;
import com.travelcompanion.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public List<TripResponse> getUserTrips(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return tripRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TripResponse createTrip(String username, TripRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Destination destination = null;
        if (request.getDestinationId() != null) {
            destination = destinationRepository.findById(request.getDestinationId())
                    .orElse(null);
        }

        Trip trip = Trip.builder()
                .user(user)
                .destination(destination)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .travelType(Trip.TravelType.valueOf(request.getTravelType().toUpperCase()))
                .notes(request.getNotes())
                .status(Trip.TripStatus.PLANNED)
                .build();

        trip = tripRepository.save(trip);
        return toResponse(trip);
    }

    public TripResponse updateTrip(Long id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (request.getDestinationId() != null) {
            Destination destination = destinationRepository.findById(request.getDestinationId())
                    .orElse(null);
            trip.setDestination(destination);
        }

        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());
        trip.setTravelType(Trip.TravelType.valueOf(request.getTravelType().toUpperCase()));
        trip.setNotes(request.getNotes());

        trip = tripRepository.save(trip);
        return toResponse(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }

    public List<TripResponse> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TripResponse toResponse(Trip trip) {
        TripResponse.TripResponseBuilder builder = TripResponse.builder()
                .id(trip.getId())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .budget(trip.getBudget())
                .travelType(trip.getTravelType() != null ? trip.getTravelType().name() : null)
                .status(trip.getStatus() != null ? trip.getStatus().name() : null)
                .notes(trip.getNotes());

        if (trip.getDestination() != null) {
            builder.destinationId(trip.getDestination().getId())
                    .destinationName(trip.getDestination().getName())
                    .destinationCountry(trip.getDestination().getCountry())
                    .destinationImage(trip.getDestination().getImageUrl());
        }

        return builder.build();
    }
}
