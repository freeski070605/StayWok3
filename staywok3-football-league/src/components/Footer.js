import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-orange py-4 mt-auto">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-3">
            <h5>About Us</h5>
            <p className="text-muted">
              StayWok3!! and updated with the latest in the League. Follow stats, schedules, and league news!
            </p>
          </div>

          {/* Links Section */}
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-orange text-decoration-none">Home</Link>
              </li>
              <li>
                <Link to="/teams" className="text-orange text-decoration-none">Teams</Link>
              </li>
              <li>
                <Link to="/schedule" className="text-orange text-decoration-none">Schedule</Link>
              </li>
              <li>
                <Link to="/stats" className="text-orange text-decoration-none">Stats</Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="col-md-4 mb-3">
            <h5>Follow Us</h5>
            <p className="text-muted">
              Stay connected on our social media channels for updates and highlights.
            </p>
            <div>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange me-3"
              >
                <i className="bi bi-facebook"></i> Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange"
              >
                <i className="bi bi-instagram"></i> Instagram
              </a>
            </div>
          </div>
        </div>
        <hr className="text-muted" />
        <p className="text-center text-muted mb-0">&copy; 2024-2025 StayWok3 Rough Touch Football League. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
