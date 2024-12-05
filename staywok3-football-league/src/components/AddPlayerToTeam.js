import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function AddPlayerToTeam() {
  const { teamId } = useParams();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all registered players
    api.get('/users')
      .then((res) => setPlayers(res.data.filter((user) => user.role === 'player')))
      .catch((err) => console.error('Failed to fetch players:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = selectedPlayer
      ? { playerId: selectedPlayer } // Add registered player
      : { name: playerName }; // Add unregistered player

    api.put(`/teams/${teamId}/add-player`, data)
      .then(() => {
        alert('Player added to team!');
        navigate(`/teams/${teamId}`);
      })
      .catch((err) => alert(err.response?.data?.error || 'Failed to add player to team'));
  };

  return (
    <div>
      <h1>Add Player to Team</h1>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Add Player</button>
      </form>
    </div>
  );
}

export default AddPlayerToTeam;
