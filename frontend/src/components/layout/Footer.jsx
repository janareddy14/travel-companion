import { Link } from 'react-router-dom';

export function FullFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3><i className="fas fa-globe-americas"></i> Travel Companion</h3>
            <p>Your smart travel planning platform. Discover, plan, and explore the world with ease.</p>
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/trip-planner">Trip Planner</Link></li>
              <li><Link to="/companions">Find Companions</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Connect</h4>
            <ul>
              <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
              <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
              <li><a href="#"><i className="fab fa-facebook"></i> Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Travel Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function SimpleFooter({ style }) {
  return (
    <footer className="footer" style={style}>
      <div className="container">
        <div className="footer-bottom">
          <p>&copy; 2026 Travel Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
