import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { SimpleFooter } from '../components/layout/Footer';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { getSampleDestinations } from '../utils/helpers';

const SEASONS = ['all', 'spring', 'summer', 'fall', 'winter', 'dry'];

export default function Destinations() {
  const [allDestinations, setAllDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get('/api/destinations');
        setAllDestinations(data);
      } catch {
        setAllDestinations(getSampleDestinations());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const sp = searchParams.get('search');
    if (sp) setSearch(sp);
  }, [searchParams]);

  const doFilter = useCallback(() => {
    let result = allDestinations.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'all' || (d.bestSeason || '').toLowerCase().includes(activeFilter);
      return matchesSearch && matchesFilter;
    });
    setFiltered(result);
  }, [allDestinations, search, activeFilter]);

  useEffect(() => { doFilter(); }, [doFilter]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const btn = e.currentTarget;
    const icon = btn.querySelector('i');
    btn.classList.toggle('active');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    showToast(btn.classList.contains('active') ? 'Added to favorites!' : 'Removed from favorites');
  };

  return (
    <>
      <PageHeader title="Explore Destinations" subtitle="Find your next dream destination from around the world" />

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}></i>
              <input type="text" className="form-control" placeholder="Search destinations by name or country..." style={{ paddingLeft: '44px' }} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="filter-bar">
            {SEASONS.map((s) => (
              <button key={s} className={`filter-btn${activeFilter === s ? ' active' : ''}`} onClick={() => setActiveFilter(s)}>
                {s === 'all' ? 'All' : s === 'dry' ? 'Dry Season' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="destinations-grid">
            {loading ? (
              Array(6).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-card"></div>)
            ) : filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
                <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}></i>
                <p>No destinations found</p>
              </div>
            ) : (
              filtered.map((d) => (
                <Link key={d.id} to={`/destinations/${d.id}`} className="card fade-in visible" style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="card-image">
                    <img src={d.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} alt={d.name} loading="lazy" />
                    <span className="card-badge">{d.bestSeason || 'Year Round'}</span>
                    <button className="card-favorite" onClick={toggleFavorite}>
                      <i className="far fa-heart"></i>
                    </button>
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
              ))
            )}
          </div>
        </div>
      </section>

      <SimpleFooter />
    </>
  );
}
