import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function CreateTeam() {
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Check if the token exists and looks valid
  
    api.post('/teams', formData)
      .then(() => {
        alert('Team created successfully!');
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Error:', err.response?.data || err.message);
        alert('Failed to create team');
      });
  };

  return (
    <div>
      <h1>Create Team</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Team Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="logo"
          placeholder="Logo URL"
          value={formData.logo}
          onChange={handleChange}
        />
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
}

export default CreateTeam;
