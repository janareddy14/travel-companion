package com.travelcompanion.config;

import com.travelcompanion.entity.*;
import com.travelcompanion.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@travelcompanion.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .bio("Platform Administrator")
                    .build();
            userRepository.save(admin);
        }

        // Create demo user
        if (!userRepository.existsByUsername("traveler")) {
            User user = User.builder()
                    .username("traveler")
                    .email("traveler@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(User.Role.USER)
                    .interests("Adventure, Photography, Culture")
                    .bio("Passionate traveler exploring the world!")
                    .build();
            userRepository.save(user);
        }

        // Seed destinations
        if (destinationRepository.count() == 0) {
            destinationRepository.save(Destination.builder()
                    .name("Paris").country("France")
                    .description("The City of Lights beckons with its iconic Eiffel Tower, world-class museums like the Louvre, charming cafés, and exquisite cuisine. Stroll along the Seine, explore Montmartre, and experience the romance that makes Paris one of the most visited cities in the world.")
                    .imageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800")
                    .bestSeason("Spring (April-June)")
                    .estimatedCost(2500.0).latitude(48.8566).longitude(2.3522)
                    .highlights("Eiffel Tower, Louvre Museum, Notre-Dame, Champs-Élysées, Montmartre")
                    .rating(4.8).build());

            destinationRepository.save(Destination.builder()
                    .name("Tokyo").country("Japan")
                    .description("A mesmerizing blend of ultramodern and traditional, Tokyo offers neon-lit skyscrapers alongside historic temples. Discover the bustling Shibuya crossing, serene Meiji Shrine, world-renowned sushi, and the cutting-edge technology that defines this incredible metropolis.")
                    .imageUrl("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800")
                    .bestSeason("Spring (March-May)")
                    .estimatedCost(3000.0).latitude(35.6762).longitude(139.6503)
                    .highlights("Shibuya Crossing, Senso-ji Temple, Mount Fuji, Akihabara, Tsukiji Market")
                    .rating(4.9).build());

            destinationRepository.save(Destination.builder()
                    .name("Bali").country("Indonesia")
                    .description("A tropical paradise of lush rice terraces, ancient temples, and stunning beaches. Bali offers a unique blend of spirituality, adventure, and relaxation with its world-class surfing, vibrant art scene, and warm Balinese hospitality.")
                    .imageUrl("https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800")
                    .bestSeason("Dry Season (April-October)")
                    .estimatedCost(1500.0).latitude(-8.3405).longitude(115.0920)
                    .highlights("Ubud Rice Terraces, Tanah Lot Temple, Seminyak Beach, Mount Batur, Uluwatu")
                    .rating(4.7).build());

            destinationRepository.save(Destination.builder()
                    .name("New York").country("USA")
                    .description("The city that never sleeps offers iconic landmarks, Broadway shows, incredible food diversity, and world-class shopping. From Central Park to Times Square, the Statue of Liberty to Brooklyn Bridge, NYC is a cultural melting pot unlike any other.")
                    .imageUrl("https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800")
                    .bestSeason("Fall (September-November)")
                    .estimatedCost(3500.0).latitude(40.7128).longitude(-74.0060)
                    .highlights("Statue of Liberty, Central Park, Times Square, Brooklyn Bridge, Metropolitan Museum")
                    .rating(4.7).build());

            destinationRepository.save(Destination.builder()
                    .name("Santorini").country("Greece")
                    .description("Iconic white-washed buildings with blue domes perched on volcanic cliffs overlooking the Aegean Sea. Santorini offers breathtaking sunsets, volcanic beaches, ancient ruins, and some of the finest wines in the Mediterranean.")
                    .imageUrl("https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800")
                    .bestSeason("Summer (June-September)")
                    .estimatedCost(2800.0).latitude(36.3932).longitude(25.4615)
                    .highlights("Oia Sunset, Red Beach, Akrotiri, Wine Tasting, Caldera Cruise")
                    .rating(4.9).build());

            destinationRepository.save(Destination.builder()
                    .name("Dubai").country("UAE")
                    .description("A futuristic city rising from the desert, Dubai amazes with its record-breaking architecture, luxury shopping, golden beaches, and thrilling desert adventures. Experience the Burj Khalifa, Palm Jumeirah, and the vibrant souks.")
                    .imageUrl("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800")
                    .bestSeason("Winter (November-March)")
                    .estimatedCost(3200.0).latitude(25.2048).longitude(55.2708)
                    .highlights("Burj Khalifa, Palm Jumeirah, Desert Safari, Dubai Mall, Gold Souk")
                    .rating(4.6).build());

            destinationRepository.save(Destination.builder()
                    .name("Machu Picchu").country("Peru")
                    .description("The legendary lost city of the Incas sits majestically atop the Andes Mountains. This UNESCO World Heritage Site offers breathtaking views, fascinating history, and one of the most iconic trekking experiences in the world.")
                    .imageUrl("https://images.unsplash.com/photo-1587595431973-160d0d163571?w=800")
                    .bestSeason("Dry Season (May-October)")
                    .estimatedCost(2000.0).latitude(-13.1631).longitude(-72.5450)
                    .highlights("Inca Trail, Sun Gate, Temple of the Sun, Huayna Picchu, Sacred Valley")
                    .rating(4.8).build());

            destinationRepository.save(Destination.builder()
                    .name("Maldives").country("Maldives")
                    .description("Crystal-clear turquoise waters, pristine white-sand beaches, and luxurious overwater bungalows make the Maldives the ultimate tropical escape. Dive into vibrant coral reefs, enjoy world-class spa treatments, and witness stunning bioluminescent shores.")
                    .imageUrl("https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800")
                    .bestSeason("Dry Season (November-April)")
                    .estimatedCost(4000.0).latitude(3.2028).longitude(73.2207)
                    .highlights("Overwater Villas, Snorkeling, Bioluminescent Beach, Whale Shark Diving, Spa Retreats")
                    .rating(4.9).build());

            destinationRepository.save(Destination.builder()
                    .name("Rome").country("Italy")
                    .description("The Eternal City is an open-air museum of ancient ruins, Renaissance art, and vibrant street life. From the Colosseum to Vatican City, every corner tells a story spanning thousands of years of Western civilization.")
                    .imageUrl("https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800")
                    .bestSeason("Spring (April-June)")
                    .estimatedCost(2200.0).latitude(41.9028).longitude(12.4964)
                    .highlights("Colosseum, Vatican City, Trevi Fountain, Pantheon, Roman Forum")
                    .rating(4.8).build());

            destinationRepository.save(Destination.builder()
                    .name("Cape Town").country("South Africa")
                    .description("Where mountains meet the ocean, Cape Town offers stunning landscapes, diverse wildlife, award-winning vineyards, and a vibrant cultural scene. Table Mountain, the Cape of Good Hope, and Robben Island are just the beginning.")
                    .imageUrl("https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800")
                    .bestSeason("Summer (November-March)")
                    .estimatedCost(1800.0).latitude(-33.9249).longitude(18.4241)
                    .highlights("Table Mountain, Cape of Good Hope, Robben Island, V&A Waterfront, Wine Route")
                    .rating(4.7).build());
        }
    }
}
