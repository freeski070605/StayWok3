import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/standings')
      .then((res) => {
        setStandings(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch standings');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading standings...</p>;

  return (
    <div className="container my-5">
      <h1 className="text-center text-orange mb-4">League Standings</h1>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Team</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Points Scored</th>
            <th>Points Allowed</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.name}>
              <td>
                <Link to={`/teams/${team._id}`} className="text-orange">
                {team.name}
                </Link>
            </td>
              <td>{team.stats.wins}</td>
              <td>{team.stats.losses}</td>
              <td>{team.stats.points}</td>
              <td>{team.stats.pointsAgainst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Standings;
