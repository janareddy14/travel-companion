// ==========================================
// Travel Companion – Trip Planner
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tripPlannerForm');
    if (form) {
        loadDestinationOptions();
        form.addEventListener('submit', handleTripPlan);
    }
});

async function loadDestinationOptions() {
    const select = document.getElementById('tripDestination');
    if (!select) return;

    try {
        const destinations = await api.get('/destinations');
        destinations.forEach(d => {
            const option = document.createElement('option');
            option.value = d.id;
            option.textContent = `${d.name}, ${d.country}`;
            option.dataset.cost = d.estimatedCost;
            option.dataset.lat = d.latitude;
            option.dataset.lng = d.longitude;
            select.appendChild(option);
        });
    } catch (err) {
        // Fallback
        const samples = getSampleDestinations();
        samples.forEach(d => {
            const option = document.createElement('option');
            option.value = d.id;
            option.textContent = `${d.name}, ${d.country}`;
            option.dataset.cost = d.estimatedCost;
            select.appendChild(option);
        });
    }
}

async function handleTripPlan(e) {
    e.preventDefault();

    const destinationId = document.getElementById('tripDestination').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const budget = document.getElementById('budget').value;
    const travelType = document.getElementById('travelType').value;
    const notes = document.getElementById('tripNotes')?.value || '';

    if (!destinationId || !startDate || !endDate) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }

    // Calculate trip details
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
        showToast('End date must be after start date', 'error');
        return;
    }

    const select = document.getElementById('tripDestination');
    const selected = select.options[select.selectedIndex];
    const baseCost = parseFloat(selected.dataset.cost || 1500);

    // Estimate costs
    const accommodation = days * (travelType === 'SOLO' ? 80 : travelType === 'FAMILY' ? 150 : 100);
    const food = days * (travelType === 'SOLO' ? 40 : travelType === 'FAMILY' ? 100 : 60);
    const transport = baseCost * 0.3;
    const activities = days * 50;
    const totalEstimate = accommodation + food + transport + activities;

    // Show result
    const resultCard = document.getElementById('tripResult');
    if (resultCard) {
        document.getElementById('estDays').textContent = days + ' days';
        document.getElementById('estAccommodation').textContent = formatCurrency(accommodation);
        document.getElementById('estFood').textContent = formatCurrency(food);
        document.getElementById('estTransport').textContent = formatCurrency(transport);
        document.getElementById('estActivities').textContent = formatCurrency(activities);
        document.getElementById('estTotal').textContent = formatCurrency(totalEstimate);

        const budgetNum = parseFloat(budget);
        const budgetStatus = document.getElementById('budgetStatus');
        if (budgetStatus) {
            if (budgetNum >= totalEstimate) {
                budgetStatus.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success);"></i> Your budget covers the estimated costs!';
            } else {
                budgetStatus.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> You may need ${formatCurrency(totalEstimate - budgetNum)} more.`;
            }
        }

        resultCard.classList.add('active');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Save trip if logged in
    if (isLoggedIn()) {
        try {
            await api.post('/trips', {
                destinationId: parseInt(destinationId),
                startDate, endDate,
                budget: parseFloat(budget),
                travelType,
                notes
            });
            showToast('Trip saved to your dashboard!');
        } catch (err) {
            showToast('Trip planned! Login to save it.', 'warning');
        }
    } else {
        showToast('Trip planned! Login to save your trips.', 'warning');
    }
}
