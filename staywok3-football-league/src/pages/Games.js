import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Games() {
  const [games, setGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    api.get('/games')
      .then((res) => {
        const now = new Date();
        const completed = res.data.filter((game) => game.completed);
        const upcoming = res.data.filter(
          (game) => !game.completed && new Date(game.date) > now
        );

        setGames(res.data);
        setCompletedGames(completed);
        setUpcomingGames(upcoming);
      })
      .catch(() => alert('Failed to fetch games'));

    api.get('/teams')
      .then((res) => setTeams(res.data))
      .catch(() => alert('Failed to fetch teams'));
  }, []);

  const applyFilters = () => {
    let filteredGames = games;

    if (selectedTeam) {
      filteredGames = filteredGames.filter(
        (game) =>
          game.team1?._id === selectedTeam || game.team2?._id === selectedTeam
      );
    }

    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);

      filteredGames = filteredGames.filter((game) => {
        const gameDate = new Date(game.date);
        return gameDate >= start && gameDate <= end;
      });
    }

    setCompletedGames(filteredGames.filter((game) => game.completed));
    setUpcomingGames(filteredGames.filter((game) => !game.completed));
  };

  const renderTeamInfo = (team) => (
    <div className="text-center">
      <h5 className="text-orange">
        {team.logo && (
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
            className="me-2"
          />
        )}
        {team.name || 'Team'}
      </h5>
      <p className="text-muted">
        {team.stats ? `${team.stats.wins} - ${team.stats.losses}` : '0-0'}
      </p>
    </div>
  );

  return (
    <div className="container my-5">
      <h1 className="text-center text-orange mb-4">Game Schedule</h1>

      {/* Filters Section */}
      <div className="card mb-4 p-3">
        <h2 className="text-orange">Filters</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Team</label>
            <select
              className="form-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
        </div>
        <button className="btn btn-orange mt-3" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* Upcoming Games Section */}
      <div className="mb-5">
        <h2 className="text-orange">Upcoming Games</h2>
        {upcomingGames.length > 0 ? (
          <div className="list-group">
            {upcomingGames.map((game) => (
              <div
                className="list-group-item bg-dark text-light mb-3"
                key={game._id}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {renderTeamInfo(game.team1)}
                  <h5 className="text-orange">vs</h5>
                  {renderTeamInfo(game.team2)}
                </div>

                {/* Game Details */}
                <div className="d-flex justify-content-between mt-3 px-3">
                  <p className="mb-0 text-muted">
                    <strong>Date:</strong> {new Date(game.date).toLocaleString()}
                  </p>
                  <p className="mb-0 text-muted">
                    <strong>Location:</strong> {game.location || 'Location Unknown'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No upcoming games.</p>
        )}
      </div>

      {/* Completed Games Section */}
      <div>
        <h2 className="text-orange">Completed Games</h2>
        {completedGames.length > 0 ? (
          <div className="list-group">
            {completedGames.map((game) => (
              <div
                className="list-group-item bg-dark text-light mb-3"
                key={game._id}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {renderTeamInfo(game.team1)}
                  <h5 className="text-orange">vs</h5>
                  {renderTeamInfo(game.team2)}
                </div>
                <div className="d-flex justify-content-between mt-3 px-3">
                  <p className="mb-0 text-muted">
                    <strong>Date:</strong> {new Date(game.date).toLocaleString()}
                  </p>
                  <p className="mb-0 text-muted">
                    <strong>Location:</strong> {game.location || 'Location Unknown'}
                  </p>
                </div>
                <p className="text-muted mt-2">
                  <strong>Score:</strong> {game.team1Results?.score || 0} -{' '}
                  {game.team2Results?.score || 0}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No completed games yet.</p>
        )}
      </div>
    </div>
  );
}

export default Games;
