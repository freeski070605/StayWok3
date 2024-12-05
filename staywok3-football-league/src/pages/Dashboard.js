import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Dashboard({ user }) {
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/teams')
        .then((res) => setTeams(res.data))
        .catch((err) => console.error('Failed to fetch teams:', err));

      api.get('/games')
        .then((res) => setGames(res.data))
        .catch((err) => console.error('Failed to fetch games:', err));

      api.get('/notifications')
        .then((res) => setNotifications(res.data))
        .catch(() => console.error('Failed to fetch notifications'));
    }
  }, [user]);

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      api.delete(`/teams/${teamId}`)
        .then(() => {
          setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId));
          alert('Team deleted successfully');
        })
        .catch(() => alert('Failed to delete team'));
    }
  };

  const handleScheduleGame = (e) => {
    e.preventDefault();
    if (team1 === team2) {
      alert('Teams must be different');
      return;
    }
    api.post('/games', { team1, team2, date, location })
      .then(() => {
        alert('Game scheduled successfully');
        return api.get('/games').then((res) => setGames(res.data));
      })
      .catch(() => alert('Failed to schedule game'));
  };

  const handleEditGame = (e) => {
    e.preventDefault();
    api.put(`/games/${editingGame._id}`, editingGame)
      .then(() => {
        alert('Game updated successfully');
        setEditingGame(null);
        return api.get('/games').then((res) => setGames(res.data));
      })
      .catch(() => alert('Failed to update game'));
  };

  const handleDeleteGame = (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      api.delete(`/games/${gameId}`)
        .then(() => {
          setGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
          alert('Game deleted successfully');
        })
        .catch(() => alert('Failed to delete game'));
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1 className="my-4">Welcome, {user.username}</h1>
      <p>Role: <strong>{user.role}</strong></p>

      {user.role === 'admin' && (
        <div>
          <h2 className="my-4">Admin Dashboard</h2>

          <Link to="/create-team" className="btn btn-primary mb-3">
            Create New Team
          </Link>

          <h3 className="mt-4">Manage Teams</h3>
          <div className="row">
            {teams.map((team) => (
              <div key={team._id} className="col-md-4">
                <div className="card mb-3">
                  {team.logo && (
                    <img src={team.logo} alt={`${team.name} logo`} className="card-img-top" />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{team.name}</h5>
                    <p className="card-text">Players: {team.players.length}</p>
                    <Link to={`/teams/${team._id}/edit`} className="btn btn-secondary btn-sm me-2">
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteTeam(team._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-4">Schedule a New Game</h3>
          <form className="row g-3" onSubmit={handleScheduleGame}>
            <div className="col-md-6">
              <label htmlFor="team1" className="form-label">Team 1</label>
              <select
                id="team1"
                className="form-select"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
              >
                <option value="">Select Team 1</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="team2" className="form-label">Team 2</label>
              <select
                id="team2"
                className="form-select"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
              >
                <option value="">Select Team 2</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                id="date"
                type="datetime-local"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                id="location"
                type="text"
                className="form-control"
                placeholder="Enter game location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Schedule Game</button>
            </div>
          </form>

          <h3 className="mt-4">Scheduled Games</h3>
          <table className="table table-striped table-bordered mt-3">
            <thead>
              <tr>
                <th>Matchup</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>{game.team1.name || 'Team 1'} vs. {game.team2.name || 'Team 2'}</td>
                  <td>{new Date(game.date).toLocaleString()}</td>
                  <td>{game.location}</td>
                  <td>{game.completed ? 'Completed' : 'Upcoming'}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => setEditingGame(game)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteGame(game._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-4">Notifications</h3>
          <ul className="list-group">
            {notifications.map((notification) => (
              <li key={notification._id} className="list-group-item">
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
