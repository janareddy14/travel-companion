package com.travelcompanion.repository;

import com.travelcompanion.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByCountryContainingIgnoreCase(String country);
    List<Destination> findByNameContainingIgnoreCase(String name);

    @Query("SELECT d FROM Destination d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.country) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Destination> searchDestinations(String query);
}
