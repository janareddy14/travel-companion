import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      setLoading(true);
      await register(username, email, password);
      showToast('Registration successful! Welcome aboard!');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch {
      showToast('Registration failed. Username or email may be taken.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <i className="fas fa-globe-americas" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
        </div>
        <h2>Join Travel Companion</h2>
        <p className="subtitle">Create your account and start exploring</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fas fa-user"></i> Username</label>
            <input type="text" className="form-control" placeholder="Choose a username" required minLength={3} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label><i className="fas fa-envelope"></i> Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label><i className="fas fa-lock"></i> Password</label>
            <input type="password" className="form-control" placeholder="Create a password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label><i className="fas fa-lock"></i> Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <i className="fas fa-user-plus"></i> {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </section>
  );
}
