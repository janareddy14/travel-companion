import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SimpleFooter } from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import { formatDate, formatCurrency, getDefaultChecklist } from '../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [trips, setTrips] = useState([]);
  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem('checklist') || 'null') || getDefaultChecklist());
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await api.get('/api/trips');
      setTrips(data);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.del(`/trips/${id}`);
      showToast('Trip deleted');
      loadTrips();
    } catch {
      showToast('Failed to delete trip', 'error');
    }
  };

  const toggleCheckItem = (i) => {
    const items = [...checklist];
    items[i] = { ...items[i], completed: !items[i].completed };
    setChecklist(items);
    localStorage.setItem('checklist', JSON.stringify(items));
  };

  const addCheckItem = () => {
    if (!newItem.trim()) return;
    const items = [...checklist, { itemName: newItem.trim(), completed: false }];
    setChecklist(items);
    localStorage.setItem('checklist', JSON.stringify(items));
    setNewItem('');
    showToast('Item added!');
  };

  const countries = new Set(trips.map((t) => t.destinationCountry).filter(Boolean));

  return (
    <>
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Welcome, <span style={{ color: 'var(--primary)' }}>{user?.username}</span>! 👋</h1>
              <p style={{ color: 'var(--gray)' }}>Here&apos;s your travel overview</p>
            </div>
            <Link to="/trip-planner" className="btn btn-primary"><i className="fas fa-plus"></i> Plan New Trip</Link>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-suitcase-rolling"></i></div><div className="stat-number">{trips.length}</div><div className="stat-label">Total Trips</div></div>
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-globe"></i></div><div className="stat-number">{countries.size}</div><div className="stat-label">Countries</div></div>
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-check-circle"></i></div><div className="stat-number">0</div><div className="stat-label">Completed</div></div>
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-heart"></i></div><div className="stat-number">0</div><div className="stat-label">Favorites</div></div>
          </div>

          <div className="dashboard-content">
            <div className="panel">
              <h3 className="panel-title">My Trips <Link to="/trip-planner" className="btn btn-sm btn-primary"><i className="fas fa-plus"></i> New</Link></h3>
              <div>
                {loading ? (
                  <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '32px' }}>Loading trips...</p>
                ) : trips.length === 0 ? (
                  <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '32px' }}>No trips yet. <Link to="/trip-planner" style={{ color: 'var(--primary)' }}>Plan your first trip!</Link></p>
                ) : (
                  trips.map((t) => (
                    <div key={t.id} className="trip-item">
                      <img src={t.destinationImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} alt={t.destinationName || 'Trip'} />
                      <div className="trip-info" style={{ flex: 1 }}>
                        <h4>{t.destinationName || 'Unknown Destination'}</h4>
                        <p>{t.destinationCountry || ''}</p>
                        <p><i className="far fa-calendar"></i> {formatDate(t.startDate)} → {formatDate(t.endDate)}</p>
                        <p><i className="fas fa-tag"></i> {t.travelType || 'N/A'} | Budget: {formatCurrency(t.budget || 0)}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <span className={`trip-status ${(t.status || 'planned').toLowerCase()}`}>{t.status || 'PLANNED'}</span>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteTrip(t.id)}><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="panel" style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div className="companion-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 16px' }}>
                  <span style={{ color: '#fff' }}>{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                </div>
                <h3>{user?.username}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{user?.email}</p>
              </div>

              <div className="panel">
                <h3 className="panel-title">Quick Checklist</h3>
                <div>
                  {checklist.map((item, i) => (
                    <div key={i} className={`checklist-item${item.completed ? ' completed' : ''}`}>
                      <input type="checkbox" checked={item.completed} onChange={() => toggleCheckItem(i)} />
                      <label>{item.itemName}</label>
                    </div>
                  ))}
                </div>
                <div className="checklist-add">
                  <input type="text" className="form-control" placeholder="Add item..." style={{ padding: '8px 12px' }} value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCheckItem()} />
                  <button className="btn btn-primary btn-sm" onClick={addCheckItem}><i className="fas fa-plus"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimpleFooter style={{ marginTop: '60px' }} />
    </>
  );
}
