import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('You have been logged out!');
    navigate('/login');
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand text--primary-color fw-bold" to="/">
          StayWok3 RoughTouch
        </Link>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div
          className={` navbar-collapse ${isExpanded ? 'show' : 'collapse'}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto ">
            {/* Home Link */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={() => setIsExpanded(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-orange" to="/stats">
                Stats
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-orange" to="/standings">
                Standings
              </Link>
            </li>

            {/* Links for Logged-In Users */}
            {token ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/teams"
                    onClick={() => setIsExpanded(false)}
                  >
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/games"
                    onClick={() => setIsExpanded(false)}
                  >
                    Games
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard"
                    onClick={() => setIsExpanded(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                    onClick={() => setIsExpanded(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-orange btn-sm"
                    onClick={() => {
                      handleLogout();
                      setIsExpanded(false);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Links for Guests
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-warning"
                    to="/register"
                    onClick={() => setIsExpanded(false)}
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-warning"
                    to="/login"
                    onClick={() => setIsExpanded(false)}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
