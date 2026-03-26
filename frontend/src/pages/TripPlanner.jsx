import { useState, useEffect } from 'react';
import { SimpleFooter } from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import { formatCurrency, getSampleDestinations } from '../utils/helpers';

export default function TripPlanner() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [travelType, setTravelType] = useState('SOLO');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get('/destinations');
        setDestinations(data);
      } catch {
        setDestinations(getSampleDestinations());
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destinationId || !startDate || !endDate) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      showToast('End date must be after start date', 'error');
      return;
    }

    const selected = destinations.find((d) => d.id == destinationId);
    const baseCost = selected?.estimatedCost || 1500;

    const accommodation = days * (travelType === 'SOLO' ? 80 : travelType === 'FAMILY' ? 150 : 100);
    const food = days * (travelType === 'SOLO' ? 40 : travelType === 'FAMILY' ? 100 : 60);
    const transport = baseCost * 0.3;
    const activities = days * 50;
    const total = accommodation + food + transport + activities;

    const budgetNum = parseFloat(budget);
    setResult({ days, accommodation, food, transport, activities, total, budgetNum });

    // Save trip if logged in
    if (isLoggedIn) {
      try {
        await api.post('/trips', {
          destinationId: parseInt(destinationId),
          startDate, endDate,
          budget: parseFloat(budget) || 0,
          travelType, notes,
        });
        showToast('Trip saved to your dashboard!');
      } catch {
        showToast('Trip planned! Could not save to backend.', 'warning');
      }
    } else {
      showToast('Trip planned! Login to save your trips.', 'warning');
    }
  };

  return (
    <>
      <section className="planner-section">
        <div className="container">
          <div className="planner-form">
            <h2><i className="fas fa-route" style={{ color: 'var(--primary)' }}></i> Plan Your Trip</h2>
            <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '32px' }}>Fill in the details below and we&apos;ll estimate your travel costs</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><i className="fas fa-map-marker-alt"></i> Destination</label>
                <select className="form-control" required value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
                  <option value="">Select a destination...</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}, {d.country}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><i className="far fa-calendar"></i> Start Date</label>
                  <input type="date" className="form-control" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label><i className="far fa-calendar-check"></i> End Date</label>
                  <input type="date" className="form-control" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-wallet"></i> Budget (USD)</label>
                  <input type="number" className="form-control" placeholder="e.g., 3000" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-hiking"></i> Travel Type</label>
                  <select className="form-control" value={travelType} onChange={(e) => setTravelType(e.target.value)}>
                    <option value="SOLO">Solo</option>
                    <option value="COUPLE">Couple</option>
                    <option value="FAMILY">Family</option>
                    <option value="ADVENTURE">Adventure</option>
                    <option value="GROUP">Group</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label><i className="fas fa-sticky-note"></i> Notes (optional)</label>
                <textarea className="form-control" placeholder="Any specific requirements or interests..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="fas fa-calculator"></i> Estimate &amp; Plan Trip
              </button>
            </form>

            {/* Results */}
            {result && (
              <div className="result-card active">
                <h3><i className="fas fa-chart-bar"></i> Trip Cost Estimate</h3>
                <div className="estimate-grid">
                  <div className="estimate-item">
                    <div className="value">{result.days} days</div>
                    <div className="label">Duration</div>
                  </div>
                  <div className="estimate-item">
                    <div className="value">{formatCurrency(result.accommodation)}</div>
                    <div className="label">Accommodation</div>
                  </div>
                  <div className="estimate-item">
                    <div className="value">{formatCurrency(result.food)}</div>
                    <div className="label">Food &amp; Dining</div>
                  </div>
                  <div className="estimate-item">
                    <div className="value">{formatCurrency(result.transport)}</div>
                    <div className="label">Transport</div>
                  </div>
                  <div className="estimate-item">
                    <div className="value">{formatCurrency(result.activities)}</div>
                    <div className="label">Activities</div>
                  </div>
                  <div className="estimate-item" style={{ background: 'var(--gradient-primary)', color: '#fff', borderRadius: 'var(--radius-sm)' }}>
                    <div className="value" style={{ color: '#fff' }}>{formatCurrency(result.total)}</div>
                    <div className="label" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Estimated</div>
                  </div>
                </div>
                {result.budgetNum > 0 && (
                  <div style={{ marginTop: '20px', fontSize: '1rem', fontWeight: 500 }}>
                    {result.budgetNum >= result.total ? (
                      <><i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i> Your budget covers the estimated costs!</>
                    ) : (
                      <><i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i> You may need {formatCurrency(result.total - result.budgetNum)} more.</>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <SimpleFooter style={{ marginTop: '60px' }} />
    </>
  );
}
