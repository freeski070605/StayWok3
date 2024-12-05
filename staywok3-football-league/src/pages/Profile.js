import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) {
      console.error('No user information available.');
      navigate('/login'); // Redirect to login
      return;
    }
    

    // Fetch user profile
    api.get(`/users/${user.id}`).then((res) => {
      setProfile(res.data);
      setFormData({ username: res.data.username, email: res.data.email });
    }).catch((err) => {
      console.error(err);
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/users/${user.id}`, formData)
      .then(() => alert('Profile updated successfully!'))
      .catch((err) => alert('Failed to update profile.'));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
