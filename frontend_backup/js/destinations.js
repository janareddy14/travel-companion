// ==========================================
// Travel Companion – Destinations
// ==========================================

let allDestinations = [];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('destinationsGrid');
    if (grid) loadDestinations();

    const searchInput = document.getElementById('destinationSearch');
    if (searchInput) searchInput.addEventListener('input', filterDestinations);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterDestinations();
        });
    });
});

async function loadDestinations() {
    const grid = document.getElementById('destinationsGrid');
    try {
        // Show skeleton loading
        grid.innerHTML = Array(6).fill('<div class="skeleton skeleton-card"></div>').join('');
        allDestinations = await api.get('/destinations');
        renderDestinations(allDestinations);
    } catch (err) {
        // Fallback to sample data if backend is not running
        allDestinations = getSampleDestinations();
        renderDestinations(allDestinations);
    }
}

function renderDestinations(destinations) {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;

    if (destinations.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--gray);"><i class="fas fa-search" style="font-size: 3rem; margin-bottom: 16px; display: block;"></i><p>No destinations found</p></div>';
        return;
    }

    grid.innerHTML = destinations.map(d => `
        <a href="destination-detail.html?id=${d.id}" class="card fade-in visible" style="display: block; text-decoration: none;">
            <div class="card-image">
                <img src="${d.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}" alt="${d.name}" loading="lazy">
                <span class="card-badge">${d.bestSeason || 'Year Round'}</span>
                <button class="card-favorite" onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite(this)">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="card-body">
                <h3 class="card-title">${d.name}</h3>
                <p class="card-location"><i class="fas fa-map-marker-alt"></i> ${d.country}</p>
                <p class="card-description">${d.description || ''}</p>
                <div class="card-footer">
                    <span class="card-price">From $${d.estimatedCost || '---'}</span>
                    <span class="card-rating"><i class="fas fa-star"></i> ${d.rating || '4.5'}</span>
                </div>
            </div>
        </a>
    `).join('');
}

function filterDestinations() {
    const search = (document.getElementById('destinationSearch')?.value || '').toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

    let filtered = allDestinations.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(search) || d.country.toLowerCase().includes(search);
        const matchesFilter = activeFilter === 'all' || d.bestSeason?.toLowerCase().includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

    renderDestinations(filtered);
}

// ViewDestination function removed as we now use anchor tags

function toggleFavorite(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    showToast(btn.classList.contains('active') ? 'Added to favorites!' : 'Removed from favorites');
}

// Fallback sample data
function getSampleDestinations() {
    return [
        { id: 1, name: 'Paris', country: 'France', description: 'The City of Lights beckons with its iconic Eiffel Tower, world-class museums, and exquisite cuisine.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', bestSeason: 'Spring', estimatedCost: 2500, latitude: 48.8566, longitude: 2.3522, rating: 4.8 },
        { id: 2, name: 'Tokyo', country: 'Japan', description: 'A mesmerizing blend of ultramodern and traditional, Tokyo offers neon-lit skyscrapers alongside historic temples.', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', bestSeason: 'Spring', estimatedCost: 3000, latitude: 35.6762, longitude: 139.6503, rating: 4.9 },
        { id: 3, name: 'Bali', country: 'Indonesia', description: 'A tropical paradise of lush rice terraces, ancient temples, and stunning beaches.', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', bestSeason: 'Dry Season', estimatedCost: 1500, latitude: -8.3405, longitude: 115.0920, rating: 4.7 },
        { id: 4, name: 'New York', country: 'USA', description: 'The city that never sleeps offers iconic landmarks, Broadway shows, and incredible food diversity.', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', bestSeason: 'Fall', estimatedCost: 3500, latitude: 40.7128, longitude: -74.0060, rating: 4.7 },
        { id: 5, name: 'Santorini', country: 'Greece', description: 'Iconic white-washed buildings with blue domes overlooking the Aegean Sea.', imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', bestSeason: 'Summer', estimatedCost: 2800, latitude: 36.3932, longitude: 25.4615, rating: 4.9 },
        { id: 6, name: 'Dubai', country: 'UAE', description: 'A futuristic city rising from the desert with record-breaking architecture and luxury shopping.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', bestSeason: 'Winter', estimatedCost: 3200, latitude: 25.2048, longitude: 55.2708, rating: 4.6 }
    ];
}
