import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function TeamDetails({ user }) {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [games, setGames] = useState([]);
  const [editingStats, setEditingStats] = useState(false);
  const [updatedStats, setUpdatedStats] = useState({});
  const [resetting, setResetting] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState({});

  useEffect(() => {
    api.get(`/teams/${teamId}`)
      .then((res) => setTeam(res.data))
      .catch(() => alert('Failed to fetch team details'));

    api.get(`/games`)
      .then((res) => {
        const teamGames = res.data.filter(
          (game) =>
            game.team1?._id === teamId || game.team2?._id === teamId
        );
        setGames(teamGames);
      })
      .catch(() => alert('Failed to fetch games'));
  }, [teamId, user]);

  const handleEditStats = (e) => {
    e.preventDefault();
    api.put(`/teams/${teamId}/update-stats`, { stats: updatedStats })
      .then((res) => {
        setTeam(res.data.team);
        setEditingStats(false);
        alert('Stats updated successfully');
      })
      .catch(() => alert('Failed to update stats'));
  };

  const handleResetStats = () => {
    if (!window.confirm('Are you sure you want to reset all stats for this team and its players?')) {
      return;
    }
    setResetting(true);
    api.put(`/teams/${teamId}/update-stats`, { reset: true })
      .then((res) => {
        setTeam(res.data.team);
        setResetting(false);
        alert('Stats reset successfully');
      })
      .catch(() => {
        setResetting(false);
        alert('Failed to reset stats');
      });
  };

  const handleEditPlayerStats = (player) => {
    setEditingPlayer(player);
    setPlayerStats({ ...player.stats });
  };

  const handleSavePlayerStats = () => {
    api.put(`/teams/${teamId}/update-stats`, {
      playerId: editingPlayer.playerId,
      stats: playerStats,
    })
      .then((res) => {
        setTeam(res.data.team);
        setEditingPlayer(null);
        alert('Player stats updated successfully');
      })
      .catch(() => alert('Failed to update player stats'));
  };

  const handleResetPlayerStats = (player) => {
    if (!window.confirm(`Are you sure you want to reset stats for ${player.name}?`)) {
      return;
    }
    api.put(`/teams/${teamId}/update-stats`, {
      playerId: player.playerId,
      stats: { touchdowns: 0, interceptions: 0, sacks: 0 },
    })
      .then((res) => {
        setTeam(res.data.team);
        alert(`${player.name}'s stats reset successfully`);
      })
      .catch(() => alert('Failed to reset player stats'));
  };

  if (!team) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      {/* Team Details */}
      <div className="text-center mb-4">
        <h1>{team.name}</h1>
        {team.logo && (
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="img-fluid my-3"
            style={{ maxWidth: '200px' }}
          />
        )}
      </div>

      {/* Team Stats */}
      <div className="mb-5">
        <h2>Team Stats</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Games Played</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Points</th>
                <th>Points Against</th>
                <th>Touchdowns</th>
                <th>Interceptions</th>
                <th>Sacks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{team.stats.gamesPlayed}</td>
                <td>{team.stats.wins}</td>
                <td>{team.stats.losses}</td>
                <td>{team.stats.points}</td>
                <td>{team.stats.pointsAgainst}</td>
                <td>{team.stats.touchdowns}</td>
                <td>{team.stats.interceptions}</td>
                <td>{team.stats.sacks}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {user?.role === 'admin' && (
          <div className="mt-3">
            {editingStats ? (
              <form onSubmit={handleEditStats}>
                <button type="submit" className="btn btn-success me-2">Save Changes</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingStats(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setEditingStats(true)}
              >
                Edit Team Stats
              </button>
            )}
            <button
              className="btn btn-danger ms-2"
              onClick={handleResetStats}
              disabled={resetting}
            >
              {resetting ? 'Resetting...' : 'Reset All Stats'}
            </button>
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div className="mb-5">
        <h2>Player Stats</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Touchdowns</th>
                <th>Interceptions</th>
                <th>Sacks</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {team.players.map((player) => (
                <tr key={player.playerId || player.name}>
                  <td>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.stats.touchdowns}</td>
                  <td>{player.stats.interceptions}</td>
                  <td>{player.stats.sacks}</td>
                  {user?.role === 'admin' && (
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditPlayerStats(player)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleResetPlayerStats(player)}
                      >
                        Reset
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Game Schedule */}
      <div>
        <h2>Schedule</h2>
        <div className="row">
          {games.map((game) => (
            <div className="col-md-4 mb-4" key={game._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/games/${game._id}/results`}>
                      {game.team1?.name || 'Team 1'} vs. {game.team2?.name || 'Team 2'}
                    </Link>
                  </h5>
                  <p className="card-text">Date: {new Date(game.date).toLocaleString()}</p>
                  <p className="card-text">
                    {game.completed
                      ? `Score: ${game.team1Results?.score} - ${game.team2Results?.score}`
                      : 'Upcoming'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamDetails;
