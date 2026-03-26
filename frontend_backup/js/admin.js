// ==========================================
// Travel Companion – Admin Dashboard
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('adminPage')) {
        if (!requireAuth()) return;
        const user = getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            showToast('Admin access required', 'error');
            setTimeout(() => window.location.href = 'index.html', 1000);
            return;
        }
        loadAdminDashboard();
        initAdminTabs();
    }
});

function initAdminTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.style.display = 'block';
        });
    });
}

async function loadAdminDashboard() {
    await Promise.all([loadAdminStats(), loadAdminUsers(), loadAdminDestinations(), loadAdminTrips()]);
}

async function loadAdminStats() {
    try {
        const stats = await api.get('/admin/stats');
        document.getElementById('adminUsers').textContent = stats.totalUsers || 0;
        document.getElementById('adminDestinations').textContent = stats.totalDestinations || 0;
        document.getElementById('adminTrips').textContent = stats.totalTrips || 0;
    } catch (err) {
        // fallback
    }
}

async function loadAdminUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    try {
        const users = await api.get('/admin/users');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td><strong>${u.username}</strong></td>
                <td>${u.email}</td>
                <td><span class="trip-status ${u.role === 'ADMIN' ? 'ongoing' : 'planned'}">${u.role}</span></td>
                <td>${u.createdAt ? formatDate(u.createdAt) : 'N/A'}</td>
                <td>
                    ${u.role !== 'ADMIN' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>` : ''}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray);">Unable to load users</td></tr>';
    }
}

async function loadAdminDestinations() {
    const tbody = document.getElementById('destinationsTableBody');
    if (!tbody) return;

    try {
        const destinations = await api.get('/destinations');
        tbody.innerHTML = destinations.map(d => `
            <tr>
                <td>${d.id}</td>
                <td><strong>${d.name}</strong></td>
                <td>${d.country}</td>
                <td>${formatCurrency(d.estimatedCost || 0)}</td>
                <td>${d.bestSeason || 'N/A'}</td>
                <td><span class="card-rating"><i class="fas fa-star"></i> ${d.rating || 'N/A'}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteAdminDestination(${d.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--gray);">Unable to load destinations</td></tr>';
    }
}

async function loadAdminTrips() {
    const tbody = document.getElementById('tripsTableBody');
    if (!tbody) return;

    try {
        const trips = await api.get('/admin/trips');
        tbody.innerHTML = trips.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>${t.destinationName || 'N/A'}</td>
                <td>${formatDate(t.startDate)} – ${formatDate(t.endDate)}</td>
                <td>${formatCurrency(t.budget || 0)}</td>
                <td><span class="trip-status ${(t.status || 'planned').toLowerCase()}">${t.status || 'PLANNED'}</span></td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray);">Unable to load trips</td></tr>';
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        await api.delete(`/admin/users/${id}`);
        showToast('User deleted');
        loadAdminUsers();
        loadAdminStats();
    } catch (err) {
        showToast('Failed to delete user', 'error');
    }
}

async function deleteAdminDestination(id) {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    try {
        await api.delete(`/admin/destinations/${id}`);
        showToast('Destination deleted');
        loadAdminDestinations();
        loadAdminStats();
    } catch (err) {
        showToast('Failed to delete destination', 'error');
    }
}

// Add destination modal
function showAddDestinationModal() {
    const modal = document.getElementById('addDestinationModal');
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

async function handleAddDestination(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('destName').value,
        country: document.getElementById('destCountry').value,
        description: document.getElementById('destDescription').value,
        imageUrl: document.getElementById('destImage').value,
        bestSeason: document.getElementById('destSeason').value,
        estimatedCost: parseFloat(document.getElementById('destCost').value),
        latitude: parseFloat(document.getElementById('destLat').value) || 0,
        longitude: parseFloat(document.getElementById('destLng').value) || 0,
        rating: parseFloat(document.getElementById('destRating').value) || 4.5
    };

    try {
        showLoading();
        await api.post('/admin/destinations', data);
        showToast('Destination added successfully!');
        closeModal('addDestinationModal');
        loadAdminDestinations();
        loadAdminStats();
        e.target.reset();
    } catch (err) {
        showToast('Failed to add destination', 'error');
    } finally {
        hideLoading();
    }
}
