import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FullFooter } from '../components/layout/Footer';
import api from '../services/api';
import { getSampleDestinations } from '../utils/helpers';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get('/api/destinations');
        setDestinations(data.slice(0, 6));
      } catch {
        setDestinations(getSampleDestinations());
      }
    })();
  }, []);

  const handleSearch = () => {
    if (heroSearch) {
      window.location.href = `/destinations?search=${encodeURIComponent(heroSearch)}`;
    } else {
      window.location.href = '/destinations';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Explore The World With <span className="highlight">Travel Companion</span></h1>
            <p>Plan unforgettable trips, discover stunning destinations, find travel buddies, and create memories that last a lifetime. Your adventure starts here.</p>
            <div className="hero-buttons">
              <Link to="/destinations" className="btn btn-primary btn-lg"><i className="fas fa-compass"></i> Explore Destinations</Link>
              <Link to="/trip-planner" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}><i className="fas fa-map-marked-alt"></i> Plan a Trip</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="number">500+</span>
                <span className="label">Destinations</span>
              </div>
              <div className="hero-stat">
                <span className="number">10K+</span>
                <span className="label">Happy Travelers</span>
              </div>
              <div className="hero-stat">
                <span className="number">50+</span>
                <span className="label">Countries</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <h3><i className="fas fa-search"></i> Quick Search</h3>
              <div className="search-group">
                <div className="search-input">
                  <i className="fas fa-map-marker-alt"></i>
                  <input type="text" placeholder="Where do you want to go?" value={heroSearch} onChange={(e) => setHeroSearch(e.target.value)} />
                </div>
                <div className="search-input">
                  <i className="far fa-calendar"></i>
                  <input type="date" />
                </div>
                <div className="search-input">
                  <i className="fas fa-users"></i>
                  <select>
                    <option>Solo Travel</option>
                    <option>Couple</option>
                    <option>Family</option>
                    <option>Group Adventure</option>
                  </select>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSearch}>
                  <i className="fas fa-search"></i> Search Destinations
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="section section-light">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Discover the world's most breathtaking places handpicked for you</p>
          <div className="destinations-grid">
            {destinations.map((d) => (
              <Link key={d.id} to={`/destinations/${d.id}`} className="card fade-in visible" style={{ display: 'block', textDecoration: 'none' }}>
                <div className="card-image">
                  <img src={d.imageUrl} alt={d.name} loading="lazy" />
                  <span className="card-badge">{d.bestSeason || 'Year Round'}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{d.name}</h3>
                  <p className="card-location"><i className="fas fa-map-marker-alt"></i> {d.country}</p>
                  <p className="card-description">{d.description || ''}</p>
                  <div className="card-footer">
                    <span className="card-price">From ${d.estimatedCost || '---'}</span>
                    <span className="card-rating"><i className="fas fa-star"></i> {d.rating || '4.5'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/destinations" className="btn btn-primary"><i className="fas fa-th"></i> View All Destinations</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Travel Companion?</h2>
          <p className="section-subtitle">Everything you need for the perfect trip, all in one place</p>
          <div className="features-grid">
            <div className="feature-card fade-in visible">
              <div className="feature-icon"><i className="fas fa-map-marked-alt"></i></div>
              <h3>Trip Planner</h3>
              <p>Plan your perfect trip with smart cost estimates and itinerary suggestions</p>
            </div>
            <div className="feature-card fade-in visible">
              <div className="feature-icon"><i className="fas fa-users"></i></div>
              <h3>Find Companions</h3>
              <p>Connect with fellow travelers heading to the same destination</p>
            </div>
            <div className="feature-card fade-in visible">
              <div className="feature-icon"><i className="fas fa-cloud-sun"></i></div>
              <h3>Weather Forecast</h3>
              <p>Check real-time weather conditions at your destination</p>
            </div>
            <div className="feature-card fade-in visible">
              <div className="feature-icon"><i className="fas fa-map"></i></div>
              <h3>Interactive Maps</h3>
              <p>Explore destinations with detailed interactive maps and POIs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready for Your Next Adventure?</h2>
          <p>Join thousands of travelers who plan their trips with Travel Companion</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg"><i className="fas fa-rocket"></i> Get Started Free</Link>
            <Link to="/destinations" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>Browse Destinations</Link>
          </div>
        </div>
      </section>

      <FullFooter />
    </>
  );
}
