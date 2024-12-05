import React, { useState, useEffect } from 'react';
import api from '../api';

function PlayerProfile({ user }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get('/teams')
      .then((res) =>
        setTeams(res.data.filter((team) => team.players.some((p) => p.playerId === user.id)))
      )
      .catch((err) => console.error('Failed to fetch teams:', err));
  }, [user]);

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <h2>Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team._id}>
            {team.name}
            <ul>
              {team.players
                .filter((player) => player.playerId === user.id)
                .map((player) => (
                  <li key={player.playerId}>
                    Games Played: {player.stats.gamesPlayed}, Touchdowns: {player.stats.touchdowns}, Sacks: {player.stats.sacks}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerProfile;
