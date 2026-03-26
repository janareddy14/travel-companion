export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function getSampleDestinations() {
  return [
    { id: 1, name: 'Paris', country: 'France', description: 'The City of Lights beckons with its iconic Eiffel Tower, world-class museums, and exquisite cuisine.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', bestSeason: 'Spring', estimatedCost: 2500, latitude: 48.8566, longitude: 2.3522, rating: 4.8 },
    { id: 2, name: 'Tokyo', country: 'Japan', description: 'A mesmerizing blend of ultramodern and traditional, Tokyo offers neon-lit skyscrapers alongside historic temples.', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', bestSeason: 'Spring', estimatedCost: 3000, latitude: 35.6762, longitude: 139.6503, rating: 4.9 },
    { id: 3, name: 'Bali', country: 'Indonesia', description: 'A tropical paradise of lush rice terraces, ancient temples, and stunning beaches.', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', bestSeason: 'Dry Season', estimatedCost: 1500, latitude: -8.3405, longitude: 115.0920, rating: 4.7 },
    { id: 4, name: 'New York', country: 'USA', description: 'The city that never sleeps offers iconic landmarks, Broadway shows, and incredible food diversity.', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', bestSeason: 'Fall', estimatedCost: 3500, latitude: 40.7128, longitude: -74.0060, rating: 4.7 },
    { id: 5, name: 'Santorini', country: 'Greece', description: 'Iconic white-washed buildings with blue domes overlooking the Aegean Sea.', imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', bestSeason: 'Summer', estimatedCost: 2800, latitude: 36.3932, longitude: 25.4615, rating: 4.9 },
    { id: 6, name: 'Dubai', country: 'UAE', description: 'A futuristic city rising from the desert with record-breaking architecture and luxury shopping.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', bestSeason: 'Winter', estimatedCost: 3200, latitude: 25.2048, longitude: 55.2708, rating: 4.6 },
  ];
}

export function getSampleCompanions() {
  return [
    { id: 1, username: 'Alex', destinationName: 'Paris', travelDates: 'June 2026', interests: 'Photography,Art,Food', bio: 'Looking for a travel buddy to explore Paris together!' },
    { id: 2, username: 'Sarah', destinationName: 'Tokyo', travelDates: 'April 2026', interests: 'Culture,Technology,Anime', bio: 'First time in Japan, would love company!' },
    { id: 3, username: 'Marco', destinationName: 'Bali', travelDates: 'July 2026', interests: 'Surfing,Yoga,Adventure', bio: 'Adventure enthusiast looking for like-minded travelers.' },
    { id: 4, username: 'Priya', destinationName: 'Santorini', travelDates: 'August 2026', interests: 'Photography,Wine,Sunsets', bio: 'Planning a relaxing trip to Greek islands.' },
  ];
}

export function getDefaultChecklist() {
  return [
    { id: 1, itemName: '✈️ Book flights', completed: false },
    { id: 2, itemName: '🏨 Reserve accommodation', completed: false },
    { id: 3, itemName: '📋 Check passport validity', completed: false },
    { id: 4, itemName: '💊 Pack medicines', completed: false },
    { id: 5, itemName: '👕 Pack clothes', completed: false },
    { id: 6, itemName: '📱 Download offline maps', completed: false },
    { id: 7, itemName: '💳 Notify bank about travel', completed: false },
    { id: 8, itemName: '📷 Charge camera & batteries', completed: false },
  ];
}
