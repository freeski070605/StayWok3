import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/users/login', { email, password })
      .then((res) => {
        console.log('Login successful:', res.data);

        // Save the new token to localStorage
        localStorage.setItem('token', res.data.token);

        // Redirect the user to the dashboard
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Login failed:', err.response?.data || err.message);
        setErrorMessage(err.response?.data?.error || 'Failed to log in');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark text-white shadow-lg">
            <div className="card-body">
              <h1 className="text-center text-orange mb-4">Login</h1>
              <form onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-outline-orange w-100">
                    Login
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

export default Login;
