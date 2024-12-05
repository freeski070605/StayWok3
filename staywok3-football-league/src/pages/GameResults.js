import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function GameResults() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    api.get(`/games/${gameId}`)
      .then((res) => setGame(res.data))
      .catch(() => alert('Failed to fetch game details'));
  }, [gameId]);

  if (!game) return <p>Loading game details...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center' }}>Game Result</h1>
      <h2 style={{ textAlign: 'center' }}>
        {game.team1?.name || 'Team 1'} vs. {game.team2?.name || 'Team 2'}
      </h2>
      <h3 style={{ textAlign: 'center' }}>Date: {new Date(game.date).toLocaleString()}</h3>
      <p style={{ textAlign: 'center' }}>Location: {game.location || 'Unknown'}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {/* Team 1 Box */}
        <div style={{ flex: 1, marginRight: '10px', border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <h3>{game.team1?.name || 'Team 1'}</h3>
          <p>Score: {game.team1Results?.score || 0}</p>
          <p>Touchdowns: {game.team1Results?.touchdowns || 0}</p>
          <p>Interceptions: {game.team1Results?.interceptions || 0}</p>
          <p>Sacks: {game.team1Results?.sacks || 0}</p>
        </div>

        {/* Team 2 Box */}
        <div style={{ flex: 1, marginLeft: '10px', border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <h3>{game.team2?.name || 'Team 2'}</h3>
          <p>Score: {game.team2Results?.score || 0}</p>
          <p>Touchdowns: {game.team2Results?.touchdowns || 0}</p>
          <p>Interceptions: {game.team2Results?.interceptions || 0}</p>
          <p>Sacks: {game.team2Results?.sacks || 0}</p>
        </div>
      </div>

      {/* Player Stats */}
      <h2 style={{ marginTop: '20px', textAlign: 'center' }}>Player Stats</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Team 1 Players */}
        <div style={{ flex: 1, marginRight: '10px' }}>
          <h3>{game.team1?.name || 'Team 1'}</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {game.team1.players.map((player, index) => (
              <li key={player.playerId || index} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                <p><strong>{player.name}</strong></p>
                <p>Touchdowns: {player.stats?.touchdowns || 0}</p>
                <p>Interceptions: {player.stats?.interceptions || 0}</p>
                <p>Sacks: {player.stats?.sacks || 0}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Team 2 Players */}
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <h3>{game.team2?.name || 'Team 2'}</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {game.team2.players.map((player, index) => (
              <li key={player.playerId || index} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                <p><strong>{player.name}</strong></p>
                <p>Touchdowns: {player.stats?.touchdowns || 0}</p>
                <p>Interceptions: {player.stats?.interceptions || 0}</p>
                <p>Sacks: {player.stats?.sacks || 0}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GameResults;
