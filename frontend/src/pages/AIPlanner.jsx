import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function AIPlanner() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    days: '3',
    interests: ''
  });
  const [itinerary, setItinerary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.budget || !formData.days) {
      return showToast('Please fill in all required fields', 'error');
    }

    try {
      setLoading(true);
      const data = await api.post('/ai/itinerary', {
        destination: formData.destination,
        budget: parseFloat(formData.budget),
        days: parseInt(formData.days, 10),
        interests: formData.interests
      });
      setItinerary(data.itinerary);
      showToast('Itinerary generated successfully!');
    } catch (err) {
      showToast('Failed to generate itinerary. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="section-title">AI Trip Planner</h1>
          <p className="section-subtitle">Let our advanced AI create a personalized day-by-day itinerary for your next adventure</p>
        </div>

        <div className="planner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="panel fade-in visible">
            <h3 className="panel-title"><i className="fas fa-magic"></i> Trip Preferences</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Destination *</label>
                <div className="input-with-icon">
                  <i className="fas fa-map-marker-alt"></i>
                  <input type="text" name="destination" className="form-control" placeholder="E.g., Paris, Tokyo, Bali" value={formData.destination} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Total Budget (USD) *</label>
                <div className="input-with-icon">
                  <i className="fas fa-dollar-sign"></i>
                  <input type="number" name="budget" className="form-control" placeholder="E.g., 1500" value={formData.budget} onChange={handleChange} min="100" required />
                </div>
              </div>

              <div className="form-group">
                <label>Number of Days *</label>
                <div className="input-with-icon">
                  <i className="far fa-calendar-alt"></i>
                  <input type="number" name="days" className="form-control" value={formData.days} onChange={handleChange} min="1" max="14" required />
                </div>
              </div>

              <div className="form-group">
                <label>Your Interests</label>
                <textarea 
                  name="interests" 
                  className="form-control" 
                  placeholder="E.g., Art museums, local food, hiking, nightlife..." 
                  value={formData.interests} 
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-wand-magic-sparkles"></i> Generate AI Itinerary</>}
              </button>
            </form>
          </div>

          <div className="panel fade-in visible">
            <h3 className="panel-title"><i className="fas fa-list-ul"></i> Your Personalized Itinerary</h3>
            
            {!itinerary && !loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray)' }}>
                <i className="fas fa-robot" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }}></i>
                <p>Fill out your preferences and click generate to see your AI-crafted trip plan here.</p>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--primary)' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
                <p>Analyzing destination and preferences...</p>
              </div>
            )}

            {itinerary && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {itinerary.map((day, idx) => (
                  <div key={idx} style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>Day {day.day}</span>
                      {day.title}
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-color)' }}>
                      {day.activities.map((act, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{act}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
