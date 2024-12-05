import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

function TeamSchedule() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch team data
    api.get(`/teams/${teamId}`)
      .then((res) => setTeam(res.data))
      .catch(() => alert('Failed to fetch team details'));

    // Fetch team-specific games
    api.get('/games')
      .then((res) => {
        const teamGames = res.data.filter(
          (game) => game.team1?._id === teamId || game.team2?._id === teamId
        );
        setGames(teamGames);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch games');
        setLoading(false);
      });
  }, [teamId]);

  if (loading) return <p>Loading schedule...</p>;
  if (!team) return <p>Team not found</p>;

  const completedGames = games.filter((game) => game.completed);
  const upcomingGames = games.filter((game) => !game.completed);

  return (
    <div>
      <h1>{team.name} Schedule</h1>

      <h2>Upcoming Games</h2>
      {upcomingGames.length > 0 ? (
        <ul>
          {upcomingGames.map((game) => (
            <li key={game._id}>
              <p>{game.team1?.name || 'Team 1'} vs. {game.team2?.name || 'Team 2'}</p>
              <p>Date: {new Date(game.date).toLocaleString()}</p>
              <p>Location: {game.location || 'TBD'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming games</p>
      )}

      <h2>Completed Games</h2>
      {completedGames.length > 0 ? (
        <ul>
          {completedGames.map((game) => (
            <li key={game._id}>
              <p>
                <Link to={`/games/${game._id}/results`}>
                  {game.team1?.name || 'Team 1'} vs. {game.team2?.name || 'Team 2'}
                </Link>
              </p>
              <p>Date: {new Date(game.date).toLocaleString()}</p>
              <p>Score: {game.team1Results?.score || 0} - {game.team2Results?.score || 0}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No completed games</p>
      )}
    </div>
  );
}

export default TeamSchedule;
