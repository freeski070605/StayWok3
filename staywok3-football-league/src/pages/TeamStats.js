import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function TeamStats() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    api.get(`/teams/${teamId}`)
      .then((res) => setTeam(res.data))
      .catch(() => alert('Failed to fetch team stats'));
  }, [teamId]);

  if (!team) return <p>Loading...</p>;

  return (
    <div>
      <h1>{team.name} Stats</h1>
      <p>Games Played: {team.stats.gamesPlayed}</p>
      <p>Wins: {team.stats.wins}</p>
      <p>Losses: {team.stats.losses}</p>
      <p>Points For: {team.stats.pointsFor}</p>
      <p>Points Against: {team.stats.pointsAgainst}</p>
      <p>Touchdowns: {team.stats.touchdowns}</p>
      <p>Interceptions: {team.stats.interceptions}</p>
      <p>Sacks: {team.stats.sacks}</p>

      <h2>Player Stats</h2>
      <ul>
        {team.players.map((player) => (
          <li key={player.playerId}>
            <p>Name: {player.name}</p>
            <p>Position: {player.position}</p>
            <p>Touchdowns: {player.stats.touchdowns}</p>
            <p>Interceptions: {player.stats.interceptions}</p>
            <p>Sacks: {player.stats.sacks}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamStats;
