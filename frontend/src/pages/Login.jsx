import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(username, password);
      showToast('Login successful! Redirecting...');
      setTimeout(() => {
        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
      }, 500);
    } catch {
      showToast('Invalid username or password', 'error');
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
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your Travel Companion account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fas fa-user"></i> Username</label>
            <input type="text" className="form-control" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label><i className="fas fa-lock"></i> Password</label>
            <input type="password" className="form-control" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <i className="fas fa-sign-in-alt"></i> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don&apos;t have an account? <Link to="/register">Sign Up</Link></p>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', background: 'var(--gradient-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--gray)' }}>
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: <code>admin</code> / <code>admin123</code></p>
          <p>User: <code>traveler</code> / <code>password</code></p>
        </div>
      </div>
    </section>
  );
}
