import { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import { SimpleFooter } from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import { getSampleCompanions } from '../utils/helpers';

export default function Companions() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const [companions, setCompanions] = useState([]);
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [interests, setInterests] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadCompanions(); }, []);

  const loadCompanions = async () => {
    try {
      const data = await api.get('/api/companions');
      setCompanions(data);
    } catch {
      setCompanions(getSampleCompanions());
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    try {
      const data = query
        ? await api.get(`/companions/search?destination=${query}`)
        : await api.get('/companions');
      setCompanions(data);
    } catch {
      const all = getSampleCompanions();
      const filtered = query ? all.filter((c) => c.destinationName.toLowerCase().includes(query.toLowerCase())) : all;
      setCompanions(filtered);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Please login to create a profile', 'warning');
      return;
    }

    try {
      setLoading(true);
      await api.post('/companions', {
        destinationName: destination,
        travelDates: dates,
        interests, bio,
      });
      showToast('Profile created successfully!');
      setDestination(''); setDates(''); setInterests(''); setBio('');
      loadCompanions();
    } catch {
      showToast('Please login to create a profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Find Travel Companions" subtitle="Connect with fellow travelers heading to your destination" />

      <section className="section">
        <div className="container">
          {/* Search */}
          <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}></i>
              <input type="text" className="form-control" placeholder="Search by destination..." style={{ paddingLeft: '44px' }} value={search} onChange={(e) => handleSearch(e.target.value)} />
            </div>
          </div>

          {/* Create Profile */}
          {isLoggedIn && (
            <div className="panel" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
              <h3 className="panel-title"><i className="fas fa-user-plus" style={{ color: 'var(--primary)' }}></i> Create Your Travel Profile</h3>
              <form onSubmit={handleCreate}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Destination</label>
                    <input type="text" className="form-control" placeholder="Where are you going?" required value={destination} onChange={(e) => setDestination(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Travel Dates</label>
                    <input type="text" className="form-control" placeholder="e.g., June 2026" required value={dates} onChange={(e) => setDates(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Interests</label>
                  <input type="text" className="form-control" placeholder="e.g., Photography, Adventure, Food" value={interests} onChange={(e) => setInterests(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea className="form-control" placeholder="Tell potential companions about yourself..." value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <i className="fas fa-paper-plane"></i> {loading ? 'Creating...' : 'Create Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Grid */}
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Travelers Looking for Companions</h2>
          <p className="section-subtitle">Connect with these amazing travelers</p>
          <div className="grid-3">
            {companions.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
                <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}></i>
                <p>No travel companions found</p>
              </div>
            ) : (
              companions.map((c) => (
                <div key={c.id} className="companion-card fade-in visible">
                  <div className="companion-avatar">{(c.username || 'U')[0].toUpperCase()}</div>
                  <h3>{c.username || 'Traveler'}</h3>
                  <p className="destination"><i className="fas fa-map-marker-alt"></i> {c.destinationName}</p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}><i className="far fa-calendar"></i> {c.travelDates || 'Flexible dates'}</p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginTop: '8px' }}>{c.bio || ''}</p>
                  <div className="interests">
                    {(c.interests || '').split(',').filter(Boolean).map((i, idx) => (
                      <span key={idx} className="interest-tag">{i.trim()}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <SimpleFooter />
    </>
  );
}
