// ==========================================
// Travel Companion – Map (Leaflet)
// ==========================================

let map = null;

function initMap(containerId, lat = 48.8566, lng = 2.3522, zoom = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clean up existing map
    if (map) { map.remove(); map = null; }

    map = L.map(containerId).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Main marker
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup('<b>Destination</b>').openPopup();

    // Add nearby points of interest (simulated)
    addNearbyPOIs(lat, lng);

    return map;
}

function addNearbyPOIs(lat, lng) {
    if (!map) return;

    const pois = [
        { name: '🏨 Grand Hotel', offset: [0.005, 0.008], type: 'hotel' },
        { name: '🍽️ Local Restaurant', offset: [-0.003, 0.005], type: 'restaurant' },
        { name: '🎭 Museum', offset: [0.007, -0.004], type: 'attraction' },
        { name: '🏖️ Beach/Park', offset: [-0.006, -0.007], type: 'attraction' },
        { name: '☕ Café District', offset: [0.002, -0.009], type: 'restaurant' },
    ];

    pois.forEach(poi => {
        const poiMarker = L.circleMarker([lat + poi.offset[0], lng + poi.offset[1]], {
            radius: 8,
            fillColor: poi.type === 'hotel' ? '#3b82f6' : poi.type === 'restaurant' ? '#f59e0b' : '#22c55e',
            color: '#fff',
            weight: 2,
            fillOpacity: 0.8
        }).addTo(map);
        poiMarker.bindPopup(poi.name);
    });
}

function flyToLocation(lat, lng, zoom = 12) {
    if (map) map.flyTo([lat, lng], zoom, { duration: 1.5 });
}
