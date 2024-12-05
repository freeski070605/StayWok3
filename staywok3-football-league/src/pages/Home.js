import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import TopTeamsFeature from '../components/TopTeamFeatures';


function Home() {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/games')
      .then((res) => {
        const now = new Date();
        const upcoming = res.data.filter((game) => new Date(game.date) > now);
        setUpcomingGames(upcoming.slice(0, 3)); // Show next 3 games
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch games');
        setLoading(false);
      });
  }, []);

  const renderTeamInfo = (team) => (
    <div className="text-center">
      {team.logo && (
        <img
          src={team.logo}
          alt={`${team.name} logo`}
          className="img-fluid rounded"
          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
        />
      )}
      <h5 className="mt-2 text-orange">{team.name || 'Team'}</h5>
      <p className="text-muted">
        {team.stats ? `${team.stats.wins} - ${team.stats.losses}` : '0 - 0'}
      </p>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
<div className="hero-section position-relative text-white" style={{ 
    backgroundImage: "url('https://res.cloudinary.com/da1brztt3/image/upload/v1733240060/StayWok3/Logos/default.jpg')", 
    backgroundSize: "contain", // Ensures the entire image is visible
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat", 
    minHeight: "100vh", // Full viewport height to ensure the image fits
    padding: "20px", // Padding to avoid text overlapping edges
    backgroundColor: "rgba(0, 0, 0, 0.8)" // A dark overlay to enhance text contrast

  }}>
  {/* <div className="container h-100 d-flex flex-column justify-content-center align-items-center text-center">
    <h1 className="display-3 fw-bold text-orange">Football League Central</h1>
    <p className="lead mt-3 mb-4">
      Dive into the action! Track your favorite teams, explore stats, and witness unforgettable moments.
    </p>
    <div className="d-flex gap-3">
      <Link to="/register" className="btn btn-lg btn-primary px-4">
        Join Now
      </Link>
      <Link to="/games" className="btn btn-lg btn-outline-light px-4">
        View Schedule
      </Link>
    </div>
  </div> */}
</div>


      {/* Features Section */}
      <div className="container py-5">
        <TopTeamsFeature />
      </div>

      {/* Upcoming Games Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center text-orange mb-4">Upcoming Games</h2>
          {loading ? (
            <p className="text-center text-muted">Loading upcoming games...</p>
          ) : (
            <div className="list-group">
              {upcomingGames.length > 0 ? (
                upcomingGames.map((game) => (
                  <div
                    key={game._id}
                    className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center mb-3"
                  >
                    <div className="d-flex align-items-center">
                      {renderTeamInfo(game.team1)}
                      <h5 className="mx-3 text-orange">vs</h5>
                      {renderTeamInfo(game.team2)}
                    </div>
                    <div>
                      <p className="mb-1">Date: {new Date(game.date).toLocaleString()}</p>
                      <p className="mb-0">Location: {game.location || 'TBD'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No games are scheduled at the moment.</p>
              )}
            </div>
          )}
          <div className="text-center mt-3">
            <Link to="/games" className="btn btn-outline-orange">
              View Full Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p>&copy; 2024 Football League. All rights reserved.</p>
          <Link to="/about" className="text-white me-3">
            About
          </Link>
          <Link to="/contact" className="text-white">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
