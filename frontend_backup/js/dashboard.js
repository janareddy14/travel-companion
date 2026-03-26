// ==========================================
// Travel Companion – User Dashboard
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboardPage')) {
        if (!requireAuth()) return;
        loadDashboard();
    }
});

async function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    // Set username
    document.querySelectorAll('.dash-username').forEach(el => el.textContent = user.username);
    document.querySelectorAll('.dash-email').forEach(el => el.textContent = user.email);

    // Load trips
    await loadUserTrips();
}

async function loadUserTrips() {
    const container = document.getElementById('myTrips');
    if (!container) return;

    try {
        const trips = await api.get('/trips');
        if (trips.length === 0) {
            container.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 32px;">No trips yet. <a href="trip-planner.html" style="color: var(--primary);">Plan your first trip!</a></p>';
            return;
        }

        container.innerHTML = trips.map(t => `
            <div class="trip-item">
                <img src="${t.destinationImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}" alt="${t.destinationName || 'Trip'}">
                <div class="trip-info" style="flex: 1;">
                    <h4>${t.destinationName || 'Unknown Destination'}</h4>
                    <p>${t.destinationCountry || ''}</p>
                    <p><i class="far fa-calendar"></i> ${formatDate(t.startDate)} → ${formatDate(t.endDate)}</p>
                    <p><i class="fas fa-tag"></i> ${t.travelType || 'N/A'} | Budget: ${formatCurrency(t.budget || 0)}</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                    <span class="trip-status ${(t.status || 'planned').toLowerCase()}">${t.status || 'PLANNED'}</span>
                    <button class="btn btn-danger btn-sm" onclick="deleteTrip(${t.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        // Update stats
        const totalEl = document.getElementById('statTrips');
        if (totalEl) totalEl.textContent = trips.length;

        const countriesEl = document.getElementById('statCountries');
        if (countriesEl) {
            const countries = new Set(trips.map(t => t.destinationCountry).filter(Boolean));
            countriesEl.textContent = countries.size;
        }
    } catch (err) {
        container.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 32px;">Unable to load trips. Make sure the backend is running.</p>';
    }
}

async function deleteTrip(id) {
    if (!confirm('Delete this trip?')) return;
    try {
        await api.delete(`/trips/${id}`);
        showToast('Trip deleted');
        loadUserTrips();
    } catch (err) {
        showToast('Failed to delete trip', 'error');
    }
}

// Checklist management
async function loadChecklist(tripId) {
    const container = document.getElementById('checklistItems');
    if (!container) return;

    try {
        const items = await api.get(`/checklists/trip/${tripId}`);
        renderChecklist(items);
    } catch (err) {
        renderChecklist(getDefaultChecklist());
    }
}

function renderChecklist(items) {
    const container = document.getElementById('checklistItems');
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="checklist-item ${item.completed ? 'completed' : ''}">
            <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleChecklistItem(${item.id})">
            <label>${item.itemName}</label>
        </div>
    `).join('');
}

async function toggleChecklistItem(id) {
    try {
        await api.put(`/checklists/${id}/toggle`);
    } catch (err) {
        // Toggle locally if backend fails
    }
}

async function addChecklistItem() {
    const input = document.getElementById('newChecklistItem');
    const tripId = document.getElementById('checklistTripId')?.value;
    if (!input?.value.trim()) return;

    try {
        await api.post('/checklists', { tripId: parseInt(tripId), itemName: input.value.trim() });
        input.value = '';
        loadChecklist(tripId);
        showToast('Item added!');
    } catch (err) {
        showToast('Failed to add item', 'error');
    }
}

function getDefaultChecklist() {
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
