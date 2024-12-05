import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get('/teams')
      .then((res) => setTeams(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className="container my-5">
        <h1 className="text-center mb-4">Teams</h1>
        <div className="row">
          {teams.map((team) => (
            <div className="col-md-4 mb-4" key={team._id}>
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <Link to={`/teams/${team._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="card-title">{team.name}</h3>
                  </Link>
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="img-fluid mb-3"
                      style={{ maxHeight: '100px', objectFit: 'contain' }}
                    />
                  )}
                  <p className="card-text">
                    <strong>Wins:</strong> {team.stats.wins} | <strong>Losses:</strong> {team.stats.losses}
                  </p>
                  <p className="card-text">
                    <strong>Players:</strong> {team.players.length}
                  </p>
                  <Link to={`/teams/${team._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {teams.length === 0 && (
          <p className="text-center text-muted">No teams available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default Teams;
