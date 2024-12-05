import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function EditTeam() {
  const { id } = useParams(); // Team ID from URL
  const [team, setTeam] = useState(null); // Team data
  const [players, setPlayers] = useState([]); // Registered players
  const [selectedPlayer, setSelectedPlayer] = useState(''); // Selected registered player
  const [playerName, setPlayerName] = useState(''); // New unregistered player name
  const [position, setPosition] = useState(''); // New player position
  const [editingPlayer, setEditingPlayer] = useState(null); // Player being edited
  const navigate = useNavigate();

  // Fetch team and registered players on load
  useEffect(() => {
    api.get(`/teams/${id}`)
      .then((res) => setTeam(res.data))
      .catch(() => alert('Failed to fetch team details'));

    api.get('/users')
      .then((res) => setPlayers(res.data.filter((user) => user.role === 'player')))
      .catch(() => alert('Failed to fetch users'));
  }, [id]);

  // Update team details
  const updateTeamDetails = (e) => {
    e.preventDefault();
    api.put(`/teams/${id}`, { name: team.name, logo: team.logo })
      .then(() => alert('Team updated successfully'))
      .catch(() => alert('Failed to update team'));
  };

  // Add a new player (registered or unregistered)
  const addPlayer = (e) => {
    e.preventDefault();

    if (!position) {
      alert('Position is required');
      return;
    }

    const data = selectedPlayer
      ? { playerId: selectedPlayer, position }
      : { name: playerName, position };

    api.put(`/teams/${id}/add-player`, data)
      .then((res) => {
        setTeam(res.data.team);
        setSelectedPlayer('');
        setPlayerName('');
        setPosition('');
        alert('Player added successfully');
      })
      .catch((err) => alert(err.response?.data?.error || 'Failed to add player'));
  };

  // Update player details
  const updatePlayer = (e) => {
    e.preventDefault();

    if (!editingPlayer.position) {
      alert('Position is required');
      return;
    }

    api.put(`/teams/${id}/update-player`, editingPlayer)
      .then((res) => {
        setTeam(res.data.team);
        setEditingPlayer(null); // Clear editing state
        alert('Player updated successfully');
      })
      .catch((err) => alert(err.response?.data?.error || 'Failed to update player'));
  };

  // Remove a player
  const deletePlayer = (playerId, name) => {
    if (!window.confirm('Are you sure you want to remove this player?')) return;

    const data = playerId ? { playerId } : { name };

    api.put(`/teams/${id}/remove-player`, data)
      .then((res) => {
        setTeam(res.data.team);
        alert('Player removed successfully');
      })
      .catch((err) => alert(err.response?.data?.error || 'Failed to remove player'));
  };

  if (!team) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Team</h1>
      {/* Update Team Form */}
      <form onSubmit={updateTeamDetails}>
        <input
          type="text"
          placeholder="Team Name"
          value={team.name}
          onChange={(e) => setTeam({ ...team, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={team.logo}
          onChange={(e) => setTeam({ ...team, logo: e.target.value })}
        />
        <button type="submit">Update Team</button>
      </form>

      {/* Team Players */}
      <h2>Players</h2>
      <ul>
        {team.players.map((player) => (
          <li key={player.playerId || player.name}>
            {player.name} - {player.position} ({player.role}){' '}
            {player.isRegistered ? 'Registered' : 'Unregistered'}
            <button onClick={() => setEditingPlayer(player)}>Edit</button>
            <button onClick={() => deletePlayer(player.playerId, player.name)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Edit Player Form */}
      {editingPlayer && (
        <div>
          <h3>Edit Player</h3>
          <form onSubmit={updatePlayer}>
            <input
              type="text"
              placeholder="Player Name"
              value={editingPlayer.name}
              onChange={(e) =>
                setEditingPlayer({ ...editingPlayer, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Position"
              value={editingPlayer.position}
              onChange={(e) =>
                setEditingPlayer({ ...editingPlayer, position: e.target.value })
              }
            />
            <select
              value={editingPlayer.role}
              onChange={(e) =>
                setEditingPlayer({ ...editingPlayer, role: e.target.value })
              }
            >
              <option value="player">Player</option>
              <option value="captain">Captain</option>
            </select>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingPlayer(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Add Player Form */}
      <h3>Add Player</h3>
      <form onSubmit={addPlayer}>
        <div>
          <label>
            Add Registered Player:
            <select
              value={selectedPlayer}
              onChange={(e) => {
                setSelectedPlayer(e.target.value);
                setPlayerName(''); // Clear unregistered player input
              }}
            >
              <option value="">Select a player</option>
              {players.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.username}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Add Unregistered Player:
            <input
              type="text"
              placeholder="Player Name"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setSelectedPlayer(''); // Clear registered player selection
              }}
            />
          </label>
        </div>
        <div>
          <label>
            Player Position:
            <input
              type="text"
              placeholder="Position (e.g., Forward, Goalkeeper)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Player</button>
      </form>
    </div>
  );
}

export default EditTeam;
