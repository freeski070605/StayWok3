import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function ScheduleGame() {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all teams
    api.get('/teams')
      .then((res) => setTeams(res.data))
      .catch(() => alert('Failed to fetch teams'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (team1 === team2) {
      alert('Teams must be different');
      return;
    }

    api.post('/games', { team1, team2, date, location })
      .then(() => {
        alert('Game scheduled successfully');
        navigate('/games');
      })
      .catch(() => alert('Failed to schedule game'));
  };

  return (
    <div>
      <h1>Schedule Game</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Team 1</label>
          <select value={team1} onChange={(e) => setTeam1(e.target.value)}>
            <option value="">Select Team 1</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Team 2</label>
          <select value={team2} onChange={(e) => setTeam2(e.target.value)}>
            <option value="">Select Team 2</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter game location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button type="submit">Schedule Game</button>
      </form>
    </div>
  );
}

export default ScheduleGame;
