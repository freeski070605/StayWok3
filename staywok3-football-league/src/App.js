import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Games from './pages/Games';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import CreateTeam from './components/CreateTeam';
import AddPlayerToTeam from './components/AddPlayerToTeam';
import EditTeam from './components/EditTeam';
import TeamDetails from './pages/TeamDetails';
import ScheduleGame from './components/ScheduleGame';
import UpdateGameResults from './components/UpdateGameResults';
import GameResults from './pages/GameResults';
import Standings from './pages/Standings';
import Stats from './pages/Stats';
import Footer from './components/Footer';


import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = jwtDecode(token); // Decode the token
        // console.log('Decoded Token:', userData);
        setUser({ id: userData.id, username: userData.username, role: userData.role });
        
        // console.log('User:', user);
      
      } catch (err) {
        console.error('Failed to decode token:', err);
        localStorage.removeItem('token'); // Remove invalid token
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthProvider>
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamId/add-player" element={<ProtectedRoute><AddPlayerToTeam /></ProtectedRoute>} />
        <Route path="/teams/:id/edit" element={<ProtectedRoute><EditTeam /></ProtectedRoute>} />
        <Route path="/teams/:teamId" element={<TeamDetails user={user} />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:gameId/update-results" element={<UpdateGameResults />} />
        <Route path="/games/:gameId/results" element={<GameResults />} />
        <Route path="/schedule-game" element={<ProtectedRoute><ScheduleGame /></ProtectedRoute>} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
        <Route path="/create-team" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;
