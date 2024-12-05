import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function GameSchedule() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/games')
      .then((res) => {
        setGames(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch games');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading schedule...</p>;

  const completedGames = games.filter((game) => game.completed);
  const upcomingGames = games.filter((game) => !game.completed);

  return (
    <div className="container my-5">
      <h1 className="text-center text-orange mb-4">Game Schedule</h1>

      <div className="row">
        {/* Upcoming Games Section */}
        <div className="col-md-6">
          <h2 className="text-orange">Upcoming Games</h2>
          {upcomingGames.length > 0 ? (
            <ul className="list-group">
              {upcomingGames.map((game) => (
                <li className="list-group-item bg-dark text-light mb-3" key={game._id}>
                  <h5>
                    {game.team1?.name || 'Team 1'} <span className="text-orange">vs.</span> {game.team2?.name || 'Team 2'}
                  </h5>
                  <p>Date: {new Date(game.date).toLocaleString()}</p>
                  <p>Location: {game.location || 'TBD'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No upcoming games</p>
          )}
        </div>

        {/* Completed Games Section */}
        <div className="col-md-6">
          <h2 className="text-orange">Completed Games</h2>
          {completedGames.length > 0 ? (
            <ul className="list-group">
              {completedGames.map((game) => (
                <li className="list-group-item bg-dark text-light mb-3" key={game._id}>
                  <h5>
                    <Link
                      to={`/games/${game._id}/results`}
                      className="text-orange text-decoration-none"
                    >
                      {game.team1?.name || 'Team 1'} <span className="text-orange">vs.</span> {game.team2?.name || 'Team 2'}
                    </Link>
                  </h5>
                  <p>Date: {new Date(game.date).toLocaleString()}</p>
                  <p>
                    Score: <span className="text-success">{game.team1Results?.score || 0}</span> -{' '}
                    <span className="text-danger">{game.team2Results?.score || 0}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No completed games</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameSchedule;
