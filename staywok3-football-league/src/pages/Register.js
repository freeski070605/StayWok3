import React, { useState } from 'react';
import api from '../api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'player',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/users/register', formData)
      .then(() => alert('Registration successful!'))
      .catch(() => alert('Error registering user'));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark text-white shadow-lg">
            <div className="card-body">
              <h1 className="text-center text-orange mb-4">Register</h1>
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label text-orange">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control bg-dark text-white border-orange"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-orange">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control bg-dark text-white border-orange"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-orange">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control bg-dark text-white border-orange"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Role Selector */}
                <div className="mb-3">
                  <label htmlFor="role" className="form-label text-orange">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="form-select bg-dark text-white border-orange"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="player">Player</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-orange w-100">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
