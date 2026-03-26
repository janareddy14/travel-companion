import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully');
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <i className="fas fa-globe-americas"></i>
          <span>Travel Companion</span>
        </Link>

        <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/destinations" onClick={closeMenu}>Destinations</NavLink></li>
          <li><NavLink to="/trip-planner" onClick={closeMenu}>Trip Planner</NavLink></li>
          <li><NavLink to="/companions" onClick={closeMenu}>Find Companions</NavLink></li>
          {isLoggedIn && (
            <>
              <li className="auth-link"><NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink></li>
              {isAdmin && <li className="auth-link"><NavLink to="/admin" onClick={closeMenu}>Admin</NavLink></li>}
              <li className="auth-link"><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li className="guest-link"><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
              <li className="guest-link"><NavLink to="/register" onClick={closeMenu}>Sign Up</NavLink></li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
            <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
