// ==========================================
// Travel Companion – Companions
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('companionsGrid');
    if (grid) loadCompanions();

    const form = document.getElementById('companionForm');
    if (form) form.addEventListener('submit', handleCreateCompanion);

    const searchInput = document.getElementById('companionSearch');
    if (searchInput) searchInput.addEventListener('input', handleCompanionSearch);
});

async function loadCompanions() {
    const grid = document.getElementById('companionsGrid');
    try {
        const companions = await api.get('/companions');
        renderCompanions(companions);
    } catch (err) {
        renderCompanions(getSampleCompanions());
    }
}

async function handleCompanionSearch(e) {
    const query = e.target.value.trim();
    const grid = document.getElementById('companionsGrid');
    try {
        const companions = query
            ? await api.get(`/companions/search?destination=${query}`)
            : await api.get('/companions');
        renderCompanions(companions);
    } catch (err) {
        const all = getSampleCompanions();
        const filtered = query ? all.filter(c => c.destinationName.toLowerCase().includes(query.toLowerCase())) : all;
        renderCompanions(filtered);
    }
}

function renderCompanions(companions) {
    const grid = document.getElementById('companionsGrid');
    if (!grid) return;

    if (companions.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--gray);"><i class="fas fa-users" style="font-size: 3rem; margin-bottom: 16px; display: block;"></i><p>No travel companions found</p></div>';
        return;
    }

    grid.innerHTML = companions.map(c => `
        <div class="companion-card fade-in visible">
            <div class="companion-avatar">${(c.username || 'U')[0].toUpperCase()}</div>
            <h3>${c.username || 'Traveler'}</h3>
            <p class="destination"><i class="fas fa-map-marker-alt"></i> ${c.destinationName}</p>
            <p style="color: var(--gray); font-size: 0.9rem;"><i class="far fa-calendar"></i> ${c.travelDates || 'Flexible dates'}</p>
            <p style="color: var(--gray); font-size: 0.9rem; margin-top: 8px;">${c.bio || ''}</p>
            <div class="interests">
                ${(c.interests || '').split(',').map(i => `<span class="interest-tag">${i.trim()}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

async function handleCreateCompanion(e) {
    e.preventDefault();
    if (!requireAuth()) return;

    const data = {
        destinationName: document.getElementById('compDestination').value,
        travelDates: document.getElementById('compDates').value,
        interests: document.getElementById('compInterests').value,
        bio: document.getElementById('compBio').value,
    };

    try {
        showLoading();
        await api.post('/companions', data);
        showToast('Profile created successfully!');
        e.target.reset();
        loadCompanions();
    } catch (err) {
        showToast('Please login to create a profile', 'error');
    } finally {
        hideLoading();
    }
}

function getSampleCompanions() {
    return [
        { id: 1, username: 'Alex', destinationName: 'Paris', travelDates: 'June 2026', interests: 'Photography,Art,Food', bio: 'Looking for a travel buddy to explore Paris together!' },
        { id: 2, username: 'Sarah', destinationName: 'Tokyo', travelDates: 'April 2026', interests: 'Culture,Technology,Anime', bio: 'First time in Japan, would love company!' },
        { id: 3, username: 'Marco', destinationName: 'Bali', travelDates: 'July 2026', interests: 'Surfing,Yoga,Adventure', bio: 'Adventure enthusiast looking for like-minded travelers.' },
        { id: 4, username: 'Priya', destinationName: 'Santorini', travelDates: 'August 2026', interests: 'Photography,Wine,Sunsets', bio: 'Planning a relaxing trip to Greek islands.' },
    ];
}
