require('dotenv').config();
const mongoose = require('mongoose');
const { User, Destination, TravelCompanion } = require('../models');

const destinations = [
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Lights beckons with its iconic Eiffel Tower, world-class museums, and exquisite cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    bestSeason: 'Spring (April-June)',
    estimatedCost: 2500,
    latitude: 48.8566,
    longitude: 2.3522,
    highlights: 'Eiffel Tower, Louvre Museum, Notre-Dame, Seine River cruise',
    rating: 4.8
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'A mesmerizing blend of ultramodern and traditional, Tokyo offers neon-lit skyscrapers alongside historic temples.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    bestSeason: 'Spring (March-May)',
    estimatedCost: 3000,
    latitude: 35.6762,
    longitude: 139.6503,
    highlights: 'Shibuya Crossing, Senso-ji Temple, Tokyo Skytree, Tsukiji Fish Market',
    rating: 4.9
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise of lush rice terraces, ancient temples, and stunning beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    bestSeason: 'Dry Season (April-October)',
    estimatedCost: 1500,
    latitude: -8.3405,
    longitude: 115.0920,
    highlights: 'Uluwatu Temple, Ubud Monkey Forest, Mount Batur, Seminyak beaches',
    rating: 4.7
  },
  {
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps offers iconic landmarks, Broadway shows, and incredible food diversity.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    bestSeason: 'Fall (September-November)',
    estimatedCost: 3500,
    latitude: 40.7128,
    longitude: -74.0060,
    highlights: 'Statue of Liberty, Central Park, Times Square, Empire State Building',
    rating: 4.7
  },
  {
    name: 'Santorini',
    country: 'Greece',
    description: 'Iconic white-washed buildings with blue domes overlooking the Aegean Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    bestSeason: 'Summer (June-September)',
    estimatedCost: 2800,
    latitude: 36.3932,
    longitude: 25.4615,
    highlights: 'Oia sunsets, Akrotiri ruins, Red Beach, wine tasting',
    rating: 4.9
  },
  {
    name: 'Dubai',
    country: 'UAE',
    description: 'A futuristic city rising from the desert with record-breaking architecture and luxury shopping.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    bestSeason: 'Winter (November-March)',
    estimatedCost: 3200,
    latitude: 25.2048,
    longitude: 55.2708,
    highlights: 'Burj Khalifa, Dubai Mall, Palm Jumeirah, Desert Safari',
    rating: 4.6
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'Ancient Incan citadel set high in the Andes Mountains, offering breathtaking views and rich history.',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    bestSeason: 'Dry Season (May-October)',
    estimatedCost: 2000,
    latitude: -13.1631,
    longitude: -72.5450,
    highlights: 'Inca Trail, Sun Gate, Temple of the Sun, Sacred Valley',
    rating: 4.8
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    description: 'Tropical nation composed of coral islands, known for its beaches, blue lagoons, and extensive reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    bestSeason: 'Dry Season (November-April)',
    estimatedCost: 4000,
    latitude: 3.2028,
    longitude: 73.2207,
    highlights: 'Overwater bungalows, snorkeling, scuba diving, bioluminescent beaches',
    rating: 4.9
  },
  {
    name: 'Rome',
    country: 'Italy',
    description: 'The Eternal City featuring nearly 3,000 years of globally influential art, architecture, and culture.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    bestSeason: 'Spring (April-June)',
    estimatedCost: 2200,
    latitude: 41.9028,
    longitude: 12.4964,
    highlights: 'Colosseum, Vatican City, Trevi Fountain, Pantheon',
    rating: 4.8
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    description: 'A vibrant port city on South Africa\'s southwest coast, on a peninsula beneath the imposing Table Mountain.',
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
    bestSeason: 'Summer (November-March)',
    estimatedCost: 1800,
    latitude: -33.9249,
    longitude: 18.4241,
    highlights: 'Table Mountain, Robben Island, Cape of Good Hope, Boulders Beach penguins',
    rating: 4.7
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-companion';
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB in seed');
    }

    if (process.argv.includes('--fresh')) {
      console.log('Dropping existing collections...');
      await mongoose.connection.dropDatabase();
    }

    // 1. Create Admin
    const adminExists = await User.findOne({ username: 'admin' });
    let adminId;
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        email: 'admin@travelcompanion.com',
        password: 'admin123',
        role: 'ADMIN',
        bio: 'Platform Administrator'
      });
      await admin.save();
      adminId = admin._id;
      console.log('Admin user created');
    }

    // 2. Create Traveler
    const travelerExists = await User.findOne({ username: 'traveler' });
    let travelerId;
    if (!travelerExists) {
      const traveler = new User({
        username: 'traveler',
        email: 'traveler@example.com',
        password: 'password',
        role: 'USER',
        interests: 'Adventure, Photography, Culture',
        bio: 'Passionate traveler exploring the world!'
      });
      await traveler.save();
      travelerId = traveler._id;
      console.log('Traveler user created');
    }

    // 3. Create Destinations
    const destCount = await Destination.countDocuments();
    if (destCount === 0) {
      await Destination.insertMany(destinations);
      console.log(`${destinations.length} destinations created`);
    }

    // 4. Create Companions
    const compCount = await TravelCompanion.countDocuments();
    if (compCount === 0 && travelerId) {
      const companions = [
        {
          userId: travelerId,
          destinationName: 'Paris',
          travelDates: 'June 2026',
          interests: 'Photography,Art,Food',
          bio: 'Looking for a travel buddy to explore Paris together!',
          budgetMin: 1000,
          budgetMax: 3000
        },
        {
          userId: travelerId,
          destinationName: 'Tokyo',
          travelDates: 'April 2026',
          interests: 'Culture,Technology,Anime',
          bio: 'First time in Japan, would love company!',
          budgetMin: 1500,
          budgetMax: 3500
        },
        {
          userId: travelerId,
          destinationName: 'Bali',
          travelDates: 'July 2026',
          interests: 'Surfing,Yoga,Adventure',
          bio: 'Adventure enthusiast looking for like-minded travelers.',
          budgetMin: 500,
          budgetMax: 2000
        },
        {
          userId: travelerId,
          destinationName: 'Santorini',
          travelDates: 'August 2026',
          interests: 'Photography,Wine,Sunsets',
          bio: 'Planning a relaxing trip to Greek islands.',
          budgetMin: 2000,
          budgetMax: 4000
        }
      ];
      await TravelCompanion.insertMany(companions);
      console.log(`${companions.length} companion profiles created`);
    }

    console.log('Seeding completed successfully');
    if (require.main === module) process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    if (require.main === module) process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
