// ==========================================
// Travel Companion – Weather
// ==========================================

async function loadWeather(city) {
    const widget = document.getElementById('weatherWidget');
    if (!widget || !city) return;

    try {
        const data = await api.get(`/weather/${encodeURIComponent(city)}`);
        const temp = data.main?.temp || 25;
        const condition = data.weather?.[0]?.description || 'Clear sky';
        const icon = data.weather?.[0]?.icon || '01d';
        const humidity = data.main?.humidity || 60;
        const wind = data.wind?.speed || 3.5;
        const feelsLike = data.main?.feels_like || temp;

        widget.innerHTML = `
            <div class="weather-widget">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}" style="width: 80px;">
                <div class="temp">${Math.round(temp)}°C</div>
                <div class="condition">${condition.charAt(0).toUpperCase() + condition.slice(1)}</div>
                <div class="weather-details">
                    <div class="detail">
                        <div class="value"><i class="fas fa-tint"></i> ${humidity}%</div>
                        <div class="label">Humidity</div>
                    </div>
                    <div class="detail">
                        <div class="value"><i class="fas fa-wind"></i> ${wind} m/s</div>
                        <div class="label">Wind</div>
                    </div>
                    <div class="detail">
                        <div class="value"><i class="fas fa-thermometer-half"></i> ${Math.round(feelsLike)}°C</div>
                        <div class="label">Feels Like</div>
                    </div>
                </div>
                ${data.mock ? '<p style="font-size: 0.75rem; opacity: 0.6; margin-top: 12px;">Sample data – configure OpenWeather API key for live weather</p>' : ''}
            </div>
        `;
    } catch (err) {
        widget.innerHTML = `
            <div class="weather-widget">
                <div class="temp">25°C</div>
                <div class="condition">Clear Sky</div>
                <div class="weather-details">
                    <div class="detail"><div class="value">60%</div><div class="label">Humidity</div></div>
                    <div class="detail"><div class="value">3.5 m/s</div><div class="label">Wind</div></div>
                </div>
                <p style="font-size: 0.75rem; opacity: 0.6; margin-top: 12px;">Sample data</p>
            </div>
        `;
    }
}
