const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const https = require('https');

const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');
const Team = require('./models/Team');
const Game = require('./models/Game');
const Leaderboard = require('./models/Leaderboard');
const Content = require('./models/Content');
const Notification = require('./models/Notification');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const gameRoutes = require('./routes/gameRoutes');
const standingsRoutes = require('./routes/standingsRoutes');
const statsRoutes = require('./routes/stats');

dotenv.config();
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/teams', async (req, res) => {
    try {
      const teams = await Team.find().populate('players');
      res.json(teams);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch teams' });
    }
  });

  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.get('/api/games', async (req, res) => {
  console.log('GET /games endpoint hit'); // Log when the endpoint is accessed
  try {
    const games = await Game.find()
      .populate('team1', 'name logo')
      .populate('team2', 'name logo');

    console.log('Populated Games:', JSON.stringify(games, null, 2));
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err.message);
    res.status(500).json({ error: 'Error fetching games', details: err.message });
  }
  });

  app.get('/api/leaderboard', async (req, res) => {
    try {
      const leaderboard = await Leaderboard.find().populate('team');
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  app.get('/api/content', async (req, res) => {
    try {
      const content = await Content.find();
      res.json(content);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  });

  app.get('/api/notifications', async (req, res) => {
    try {
      const notifications = await Notification.find();
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/standings', standingsRoutes); // Fixed route
app.use('/api/stats', statsRoutes); // Fixed route



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
