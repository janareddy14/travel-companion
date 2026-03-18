package com.travelcompanion.controller;

import com.travelcompanion.dto.TripRequest;
import com.travelcompanion.dto.TripResponse;
import com.travelcompanion.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripResponse>> getMyTrips(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tripService.getUserTrips(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable Long id, @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
}
