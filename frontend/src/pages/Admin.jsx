import { useState, useEffect } from 'react';
import { SimpleFooter } from '../components/layout/Footer';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import { formatDate, formatCurrency } from '../utils/helpers';

export default function Admin() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({ totalUsers: 0, totalDestinations: 0, totalTrips: 0 });
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [destForm, setDestForm] = useState({ name: '', country: '', description: '', imageUrl: '', bestSeason: '', estimatedCost: '', latitude: '', longitude: '', rating: '4.5' });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([loadStats(), loadUsers(), loadDestinations(), loadTrips()]);
  };

  const loadStats = async () => { try { const data = await api.get('/admin/stats'); setStats(data); } catch {} };
  const loadUsers = async () => { try { setUsers(await api.get('/admin/users')); } catch { setUsers([]); } };
  const loadDestinations = async () => { try { setDestinations(await api.get('/destinations')); } catch { setDestinations([]); } };
  const loadTrips = async () => { try { setTrips(await api.get('/admin/trips')); } catch { setTrips([]); } };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try { await api.del(`/admin/users/${id}`); showToast('User deleted'); loadUsers(); loadStats(); } catch { showToast('Failed to delete user', 'error'); }
  };

  const deleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try { await api.del(`/admin/destinations/${id}`); showToast('Destination deleted'); loadDestinations(); loadStats(); } catch { showToast('Failed to delete destination', 'error'); }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/admin/destinations', {
        name: destForm.name, country: destForm.country,
        description: destForm.description, imageUrl: destForm.imageUrl,
        bestSeason: destForm.bestSeason,
        estimatedCost: parseFloat(destForm.estimatedCost) || 0,
        latitude: parseFloat(destForm.latitude) || 0,
        longitude: parseFloat(destForm.longitude) || 0,
        rating: parseFloat(destForm.rating) || 4.5,
      });
      showToast('Destination added successfully!');
      setShowModal(false);
      setDestForm({ name: '', country: '', description: '', imageUrl: '', bestSeason: '', estimatedCost: '', latitude: '', longitude: '', rating: '4.5' });
      loadDestinations(); loadStats();
    } catch { showToast('Failed to add destination', 'error'); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'trips', label: 'Trips' },
  ];

  return (
    <>
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1><i className="fas fa-shield-alt" style={{ color: 'var(--primary)' }}></i> Admin Dashboard</h1>
              <p style={{ color: 'var(--gray)' }}>Manage your platform</p>
            </div>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-users"></i></div><div className="stat-number">{stats.totalUsers || 0}</div><div className="stat-label">Users</div></div>
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-map-marked-alt"></i></div><div className="stat-number">{stats.totalDestinations || 0}</div><div className="stat-label">Destinations</div></div>
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-suitcase"></i></div><div className="stat-number">{stats.totalTrips || 0}</div><div className="stat-label">Trips</div></div>
            <div className="stat-card"><div className="stat-icon"><i className="fas fa-chart-line"></i></div><div className="stat-number">98%</div><div className="stat-label">Uptime</div></div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {tabs.map((t) => (
              <button key={t.id} className={`admin-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {/* Users */}
          {activeTab === 'users' && (
            <div className="panel admin-panel">
              <h3 className="panel-title">Manage Users</h3>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--gray)' }}>No users found</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td><strong>{u.username}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`trip-status ${u.role === 'ADMIN' ? 'ongoing' : 'planned'}`}>{u.role}</span></td>
                      <td>{u.createdAt ? formatDate(u.createdAt) : 'N/A'}</td>
                      <td>{u.role !== 'ADMIN' && <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}><i className="fas fa-trash"></i></button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Destinations */}
          {activeTab === 'destinations' && (
            <div className="panel admin-panel">
              <h3 className="panel-title">Manage Destinations <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><i className="fas fa-plus"></i> Add</button></h3>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Country</th><th>Cost</th><th>Season</th><th>Rating</th><th>Actions</th></tr></thead>
                <tbody>
                  {destinations.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray)' }}>No destinations found</td></tr>
                  ) : destinations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td><strong>{d.name}</strong></td>
                      <td>{d.country}</td>
                      <td>{formatCurrency(d.estimatedCost || 0)}</td>
                      <td>{d.bestSeason || 'N/A'}</td>
                      <td><span className="card-rating"><i className="fas fa-star"></i> {d.rating || 'N/A'}</span></td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteDestination(d.id)}><i className="fas fa-trash"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Trips */}
          {activeTab === 'trips' && (
            <div className="panel admin-panel">
              <h3 className="panel-title">All Trips</h3>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Destination</th><th>Dates</th><th>Budget</th><th>Status</th></tr></thead>
                <tbody>
                  {trips.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--gray)' }}>No trips found</td></tr>
                  ) : trips.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.destinationName || 'N/A'}</td>
                      <td>{formatDate(t.startDate)} – {formatDate(t.endDate)}</td>
                      <td>{formatCurrency(t.budget || 0)}</td>
                      <td><span className={`trip-status ${(t.status || 'planned').toLowerCase()}`}>{t.status || 'PLANNED'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Destination Modal */}
      {showModal && (
        <div className="modal-overlay active" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <h3>Add New Destination</h3>
            <form onSubmit={handleAddDestination}>
              <div className="form-row">
                <div className="form-group"><label>Name</label><input type="text" className="form-control" required value={destForm.name} onChange={(e) => setDestForm({ ...destForm, name: e.target.value })} /></div>
                <div className="form-group"><label>Country</label><input type="text" className="form-control" required value={destForm.country} onChange={(e) => setDestForm({ ...destForm, country: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={destForm.description} onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}></textarea></div>
              <div className="form-group"><label>Image URL</label><input type="text" className="form-control" placeholder="https://..." value={destForm.imageUrl} onChange={(e) => setDestForm({ ...destForm, imageUrl: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label>Season</label><input type="text" className="form-control" value={destForm.bestSeason} onChange={(e) => setDestForm({ ...destForm, bestSeason: e.target.value })} /></div>
                <div className="form-group"><label>Cost ($)</label><input type="number" className="form-control" value={destForm.estimatedCost} onChange={(e) => setDestForm({ ...destForm, estimatedCost: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Latitude</label><input type="number" step="any" className="form-control" value={destForm.latitude} onChange={(e) => setDestForm({ ...destForm, latitude: e.target.value })} /></div>
                <div className="form-group"><label>Longitude</label><input type="number" step="any" className="form-control" value={destForm.longitude} onChange={(e) => setDestForm({ ...destForm, longitude: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Rating</label><input type="number" step="0.1" min="0" max="5" className="form-control" value={destForm.rating} onChange={(e) => setDestForm({ ...destForm, rating: e.target.value })} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                <i className="fas fa-plus"></i> {loading ? 'Adding...' : 'Add Destination'}
              </button>
            </form>
          </div>
        </div>
      )}

      <SimpleFooter style={{ marginTop: '60px' }} />
    </>
  );
}
