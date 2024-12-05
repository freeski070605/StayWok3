import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function UpdateGameResults() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [team1Results, setTeam1Results] = useState({});
  const [team2Results, setTeam2Results] = useState({});
  const [playerStatsTeam1, setPlayerStatsTeam1] = useState([]);
  const [playerStatsTeam2, setPlayerStatsTeam2] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [newHighlight, setNewHighlight] = useState({ title: '', description: '', mediaUrl: '' });

  useEffect(() => {
    api.get(`/games/${gameId}`)
      .then((res) => {
        setGame(res.data);
        setHighlights(res.data.highlights || []);

        // Initialize player stats for both teams
        setPlayerStatsTeam1(
          res.data.team1.players.map((player) => ({
            playerId: player.playerId,
            name: player.name,
            touchdowns: 0,
            interceptions: 0,
            sacks: 0,
          }))
        );

        setPlayerStatsTeam2(
          res.data.team2.players.map((player) => ({
            playerId: player.playerId,
            name: player.name,
            touchdowns: 0,
            interceptions: 0,
            sacks: 0,
          }))
        );
      })
      .catch(() => alert('Failed to fetch game details'));
  }, [gameId]);

  const handlePlayerStatChange = (team, playerId, stat, value) => {
    if (team === 'team1') {
      setPlayerStatsTeam1((prevStats) =>
        prevStats.map((player) =>
          player.playerId === playerId
            ? { ...player, [stat]: parseInt(value, 10) || 0 }
            : player
        )
      );
    } else {
      setPlayerStatsTeam2((prevStats) =>
        prevStats.map((player) =>
          player.playerId === playerId
            ? { ...player, [stat]: parseInt(value, 10) || 0 }
            : player
        )
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.put(`/games/${gameId}/update-results`, {
      team1Results,
      team2Results,
      playerStatsTeam1,
      playerStatsTeam2,
    })
      .then(() => alert('Game results updated successfully'))
      .catch(() => alert('Failed to update game results'));
  };

  const handleAddHighlight = (e) => {
    e.preventDefault();
    api.post(`/games/${gameId}/highlights`, newHighlight)
      .then((res) => {
        alert('Highlight added successfully');
        setHighlights((prev) => [...prev, res.data.highlight]);
        setNewHighlight({ title: '', description: '', mediaUrl: '' });
      })
      .catch(() => alert('Failed to add highlight'));
  };

  if (!game) return <p>Loading...</p>;

  return (
    <div>
      <h1>Update Results: {game.team1.name} vs. {game.team2.name}</h1>
      <form onSubmit={handleSubmit}>
        {/* Team 1 Results */}
        <h2>{game.team1.name} Results</h2>
        <label>Score:</label>
        <input
          type="number"
          value={team1Results.score || ''}
          onChange={(e) => setTeam1Results({ ...team1Results, score: e.target.value })}
        />
        <label>Touchdowns:</label>
        <input
          type="number"
          value={team1Results.touchdowns || ''}
          onChange={(e) => setTeam1Results({ ...team1Results, touchdowns: e.target.value })}
        />
        <label>Interceptions:</label>
        <input
          type="number"
          value={team1Results.interceptions || ''}
          onChange={(e) => setTeam1Results({ ...team1Results, interceptions: e.target.value })}
        />
        <label>Sacks:</label>
        <input
          type="number"
          value={team1Results.sacks || ''}
          onChange={(e) => setTeam1Results({ ...team1Results, sacks: e.target.value })}
        />

        {/* Player Stats for Team 1 */}
        <h3>{game.team1.name} Player Stats</h3>
        {playerStatsTeam1.map((player) => (
          <div key={player.playerId}>
            <h4>{player.name}</h4>
            <label>Touchdowns:</label>
            <input
              type="number"
              value={player.touchdowns}
              onChange={(e) =>
                handlePlayerStatChange('team1', player.playerId, 'touchdowns', e.target.value)
              }
            />
            <label>Interceptions:</label>
            <input
              type="number"
              value={player.interceptions}
              onChange={(e) =>
                handlePlayerStatChange('team1', player.playerId, 'interceptions', e.target.value)
              }
            />
            <label>Sacks:</label>
            <input
              type="number"
              value={player.sacks}
              onChange={(e) =>
                handlePlayerStatChange('team1', player.playerId, 'sacks', e.target.value)
              }
            />
          </div>
        ))}

        {/* Team 2 Results */}
        <h2>{game.team2.name} Results</h2>
        <label>Score:</label>
        <input
          type="number"
          value={team2Results.score || ''}
          onChange={(e) => setTeam2Results({ ...team2Results, score: e.target.value })}
        />
        <label>Touchdowns:</label>
        <input
          type="number"
          value={team2Results.touchdowns || ''}
          onChange={(e) => setTeam2Results({ ...team2Results, touchdowns: e.target.value })}
        />
        <label>Interceptions:</label>
        <input
          type="number"
          value={team2Results.interceptions || ''}
          onChange={(e) => setTeam2Results({ ...team2Results, interceptions: e.target.value })}
        />
        <label>Sacks:</label>
        <input
          type="number"
          value={team2Results.sacks || ''}
          onChange={(e) => setTeam2Results({ ...team2Results, sacks: e.target.value })}
        />

        {/* Player Stats for Team 2 */}
        <h3>{game.team2.name} Player Stats</h3>
        {playerStatsTeam2.map((player) => (
          <div key={player.playerId}>
            <h4>{player.name}</h4>
            <label>Touchdowns:</label>
            <input
              type="number"
              value={player.touchdowns}
              onChange={(e) =>
                handlePlayerStatChange('team2', player.playerId, 'touchdowns', e.target.value)
              }
            />
            <label>Interceptions:</label>
            <input
              type="number"
              value={player.interceptions}
              onChange={(e) =>
                handlePlayerStatChange('team2', player.playerId, 'interceptions', e.target.value)
              }
            />
            <label>Sacks:</label>
            <input
              type="number"
              value={player.sacks}
              onChange={(e) =>
                handlePlayerStatChange('team2', player.playerId, 'sacks', e.target.value)
              }
            />
          </div>
        ))}

        <button type="submit">Update Results</button>
      </form>

      {/* Highlights Section */}
      <h2>Highlights</h2>
      {highlights.length > 0 ? (
        <ul>
          {highlights.map((highlight) => (
            <li key={highlight._id}>
              <a href={highlight.mediaUrl} target="_blank" rel="noopener noreferrer">
                {highlight.title}
              </a>
              <p>{highlight.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No highlights yet.</p>
      )}

      {/* Add Highlight Form */}
      <form onSubmit={handleAddHighlight}>
        <h4>Add Highlight</h4>
        <input
          type="text"
          placeholder="Title"
          value={newHighlight.title}
          onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newHighlight.description}
          onChange={(e) => setNewHighlight({ ...newHighlight, description: e.target.value })}
        />
        <input
          type="url"
          placeholder="Media URL"
          value={newHighlight.mediaUrl}
          onChange={(e) => setNewHighlight({ ...newHighlight, mediaUrl: e.target.value })}
        />
        <button type="submit">Add Highlight</button>
      </form>
    </div>
  );
}

export default UpdateGameResults;
