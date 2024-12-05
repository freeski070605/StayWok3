import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function TopTeamsFeature() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/standings')
      .then((res) => {
        setStandings(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch standings frontend');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center text-orange mb-4">Top Teams</h2>
          <p className="text-center text-muted">Loading standings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light py-5">
      <div className="container">
        <h2 className="text-center text-orange mb-4">Top Teams</h2>
        <div className="row">
          {standings.slice(0, 3).map((team) => (
            <div className="col-md-4 text-center" key={team._id}>
              <div className="p-3 shadow-sm rounded bg-dark text-white feature-box">
                {team.logo && (
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  />
                )}
                <h3 className="text-orange">{team.name}</h3>
                <p className="mb-0">
                  <strong>{team.stats.wins} Wins</strong> - <strong>{team.stats.losses} Losses</strong>
                </p>
                <p className="text-muted">
                  Points : {team.stats.points} | Points Against: {team.stats.pointsAgainst}
                </p>
              </div>
            </div>
          ))}
           <div className="text-center mt-3">
            <Link to="/stats" className="btn btn-outline-orange">
              View League Stats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopTeamsFeature;
