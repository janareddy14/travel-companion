import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { SimpleFooter } from '../components/layout/Footer';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency, getSampleDestinations } from '../utils/helpers';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const POIS = [
  { name: '🏨 Grand Hotel', offset: [0.005, 0.008], type: 'hotel' },
  { name: '🍽️ Local Restaurant', offset: [-0.003, 0.005], type: 'restaurant' },
  { name: '🎭 Museum', offset: [0.007, -0.004], type: 'attraction' },
  { name: '🏖️ Beach/Park', offset: [-0.006, -0.007], type: 'attraction' },
  { name: '☕ Café District', offset: [0.002, -0.009], type: 'restaurant' },
];

function poiColor(type) {
  if (type === 'hotel') return '#3b82f6';
  if (type === 'restaurant') return '#f59e0b';
  return '#22c55e';
}

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [dest, setDest] = useState(null);
  const [weather, setWeather] = useState(null);
  const [companions, setCompanions] = useState(null);

  useEffect(() => {
    if (!id) { navigate('/destinations'); return; }
    (async () => {
      try {
        const data = await api.get(`/api/destinations/${id}`);
        setDest(data);
      } catch {
        const sample = getSampleDestinations().find((d) => d.id == id);
        if (sample) setDest(sample);
        else showToast('Destination not found', 'error');
      }
    })();
  }, [id, navigate, showToast]);

  useEffect(() => {
    if (!dest?.name) return;
    document.title = `${dest.name} – Travel Companion`;
    // Load weather
    (async () => {
      try {
        const data = await api.get(`/weather/${encodeURIComponent(dest.name)}`);
        setWeather(data);
      } catch {
        setWeather({ mock: true, main: { temp: 25, humidity: 60, feels_like: 25 }, weather: [{ description: 'Clear sky', icon: '01d' }], wind: { speed: 3.5 } });
      }
    })();
    // Load companions
    (async () => {
      try {
        const data = await api.get(`/companions/search?destination=${dest.name}`);
        setCompanions(data);
      } catch {
        setCompanions([]);
      }
    })();
  }, [dest]);

  if (!dest) return <div className="dashboard-page"><div className="container" style={{ textAlign: 'center', padding: '100px 0' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div></div>;

  const highlights = (dest.highlights || '').split(',').map((h) => h.trim()).filter(Boolean);
  const temp = weather?.main?.temp || 25;
  const condition = weather?.weather?.[0]?.description || 'Clear sky';
  const icon = weather?.weather?.[0]?.icon || '01d';
  const humidity = weather?.main?.humidity || 60;
  const wind = weather?.wind?.speed || 3.5;
  const feelsLike = weather?.main?.feels_like || temp;

  return (
    <>
      {/* Hero with background image */}
      <div className="detail-hero" style={{ backgroundImage: `url('${dest.imageUrl}')` }}>
        <div className="detail-hero-overlay">
          <div className="detail-hero-text">
            <h1>{dest.name}</h1>
            <p><i className="fas fa-map-marker-alt"></i> {dest.country}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="detail-content">
        <div className="container">
          <div className="detail-grid">
            {/* Left: Info */}
            <div className="detail-info">
              <h2>About This Destination</h2>
              <p>{dest.description}</p>

              {highlights.length > 0 && (
                <>
                  <h2>Highlights</h2>
                  <div className="detail-tags">
                    {highlights.map((h, i) => <span key={i} className="detail-tag">{h}</span>)}
                  </div>
                </>
              )}

              <h2>Best Time to Visit</h2>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-sun" style={{ color: 'var(--accent)' }}></i> {dest.bestSeason || 'Year Round'}
              </p>

              {dest.latitude && dest.longitude && (
                <>
                  <h2 style={{ marginTop: '32px' }}>Location Map</h2>
                  <div className="map-container">
                    <MapContainer center={[dest.latitude, dest.longitude]} zoom={12} style={{ height: '100%', width: '100%' }}>
                      <TileLayer attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[dest.latitude, dest.longitude]}>
                        <Popup><b>{dest.name}</b></Popup>
                      </Marker>
                      {POIS.map((poi, i) => (
                        <CircleMarker key={i} center={[dest.latitude + poi.offset[0], dest.longitude + poi.offset[1]]} radius={8} fillColor={poiColor(poi.type)} color="#fff" weight={2} fillOpacity={0.8}>
                          <Popup>{poi.name}</Popup>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  </div>
                </>
              )}

              <h2 style={{ marginTop: '32px' }}>Travel Companions Heading Here</h2>
              <div style={{ marginTop: '16px' }}>
                {companions === null ? (
                  <p style={{ color: 'var(--gray)' }}>Loading companions...</p>
                ) : companions.length === 0 ? (
                  <p style={{ color: 'var(--gray)' }}>No travelers are currently heading here. Be the first!</p>
                ) : (
                  companions.map((c, i) => (
                    <div key={i} className="panel fade-in visible" style={{ marginBottom: '16px', padding: '16px' }}>
                      <h4 style={{ margin: '0 0 4px', color: 'var(--text)' }}>{c.username || 'Traveler'}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}><i className="far fa-calendar"></i> {c.travelDates || 'Flexible dates'}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '0.95rem' }}>{c.bio || ''}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div>
              {/* Price Card */}
              <div className="panel" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", marginBottom: '16px' }}>Trip Estimate</h3>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(dest.estimatedCost || 0)}</span>
                  <span style={{ color: 'var(--gray)' }}> / person</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <i className="fas fa-star" style={{ color: 'var(--accent)' }}></i>
                  <span style={{ fontWeight: 600 }}>{dest.rating || 4.5} / 5.0 Rating</span>
                </div>
                <Link to="/trip-planner" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="fas fa-calendar-plus"></i> Plan This Trip
                </Link>
              </div>

              {/* Weather Widget */}
              <div className="panel">
                <h3 style={{ fontFamily: "'Poppins', sans-serif", marginBottom: '16px' }}>Current Weather</h3>
                <div className="weather-widget">
                  <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={condition} style={{ width: '80px' }} />
                  <div className="temp">{Math.round(temp)}°C</div>
                  <div className="condition">{condition.charAt(0).toUpperCase() + condition.slice(1)}</div>
                  <div className="weather-details">
                    <div className="detail">
                      <div className="value"><i className="fas fa-tint"></i> {humidity}%</div>
                      <div className="label">Humidity</div>
                    </div>
                    <div className="detail">
                      <div className="value"><i className="fas fa-wind"></i> {wind} m/s</div>
                      <div className="label">Wind</div>
                    </div>
                    <div className="detail">
                      <div className="value"><i className="fas fa-thermometer-half"></i> {Math.round(feelsLike)}°C</div>
                      <div className="label">Feels Like</div>
                    </div>
                  </div>
                  {weather?.mock && <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '12px' }}>Sample data – configure OpenWeather API key for live weather</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </>
  );
}
