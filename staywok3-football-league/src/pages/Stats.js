import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Stats() {
  const [teamStats, setTeamStats] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [leagueLeaders, setLeagueLeaders] = useState({
    touchdowns: [],
    interceptions: [],
    sacks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch team stats
        const teamRes = await api.get('/teams');
        setTeamStats(teamRes.data);

        // Fetch player stats
        const players = teamRes.data.flatMap((team) => team.players);
        setPlayerStats(players);

        // Calculate league leaders
        const leaders = {
          touchdowns: [...players]
            .sort((a, b) => b.stats.touchdowns - a.stats.touchdowns)
            .slice(0, 3),
          interceptions: [...players]
            .sort((a, b) => b.stats.interceptions - a.stats.interceptions)
            .slice(0, 3),
          sacks: [...players]
            .sort((a, b) => b.stats.sacks - a.stats.sacks)
            .slice(0, 3),
        };
        setLeagueLeaders(leaders);
      } catch (err) {
        alert('Failed to fetch stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center text-muted">Loading stats...</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center text-orange mb-4">League Statistics</h1>

      {/* Team Stats Section */}
      <div className="mb-5">
        <h2 className="text-center text-orange">Team Stats</h2>
        {teamStats.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-bordered">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Points Scored</th>
                  <th>Points Against</th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((team) => (
                    <tr key={team._id}>
                    <td>
                        <Link to={`/teams/${team._id}`} className="text-orange">
                        {team.name}
                        </Link>
                    </td>
                    <td>{team.stats.wins}</td>
                    <td>{team.stats.losses}</td>
                    <td>{team.stats.points}</td>
                    <td>{team.stats.pointsAgainst}</td>
                    </tr>
                ))}
                </tbody>

            </table>
          </div>
        ) : (
          <p className="text-center text-muted">No team stats available.</p>
        )}
      </div>

      {/* Player Stats Section */}
      <div className="mb-5">
        <h2 className="text-center text-orange">Player Stats</h2>
        {playerStats.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-bordered">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Position</th>
                  <th>Touchdowns</th>
                  <th>Interceptions</th>
                  <th>Sacks</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((player) => (
                  <tr key={player.playerId || player.name}>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.stats.touchdowns}</td>
                    <td>{player.stats.interceptions}</td>
                    <td>{player.stats.sacks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted">No player stats available.</p>
        )}
      </div>

      {/* League Leaders Section */}
      <div className="mb-5">
        <h2 className="text-center text-orange">League Leaders</h2>
        <div className="row">
          {/* Touchdowns */}
          <div className="col-md-4 text-center">
            <h3 className="text-orange">Touchdowns</h3>
            {leagueLeaders.touchdowns.length > 0 ? (
              <ul className="list-group">
                {leagueLeaders.touchdowns.map((player) => (
                  <li className="list-group-item bg-dark text-white" key={player.playerId}>
                    {player.name}: {player.stats.touchdowns} TDs
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No data available</p>
            )}
          </div>

          {/* Interceptions */}
          <div className="col-md-4 text-center">
            <h3 className="text-orange">Interceptions</h3>
            {leagueLeaders.interceptions.length > 0 ? (
              <ul className="list-group">
                {leagueLeaders.interceptions.map((player) => (
                  <li className="list-group-item bg-dark text-white" key={player.playerId}>
                    {player.name}: {player.stats.interceptions} INTs
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No data available</p>
            )}
          </div>

          {/* Sacks */}
          <div className="col-md-4 text-center">
            <h3 className="text-orange">Sacks</h3>
            {leagueLeaders.sacks.length > 0 ? (
              <ul className="list-group">
                {leagueLeaders.sacks.map((player) => (
                  <li className="list-group-item bg-dark text-white" key={player.playerId}>
                    {player.name}: {player.stats.sacks} Sacks
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
