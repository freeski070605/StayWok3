const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all teams (protected route)
router.get('/', protect, async (req, res) => {
  try {
    const teams = await Team.find().populate('players');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching teams', details: err.message });
  }
});

// Get a specific team by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching team', details: err.message });
  }
});

// Create a new team (admin-only route)
router.post('/', [protect, adminOnly], async (req, res) => {
  const { name, logo } = req.body;

  if (!name) return res.status(400).json({ error: 'Team name is required' });

  try {
    const team = new Team({ name, logo });
    await team.save();
    res.status(201).json({ message: 'Team created successfully', team });
  } catch (err) {
    res.status(400).json({ error: 'Error creating team', details: err.message });
  }
});

// Add or update a player in a team
router.put('/:teamId/add-player', [protect, adminOnly], async (req, res) => {
  const { name, playerId, position } = req.body;

  if (!position) return res.status(400).json({ error: 'Position is required' });

  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Check for existing player
    const existingPlayer = team.players.find(
      (p) => String(p.playerId) === playerId || (p.name === name && !playerId)
    );
    if (existingPlayer) return res.status(400).json({ error: 'Player already in the team' });

    if (playerId) {
      // Add registered player
      const user = await User.findById(playerId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      team.players.push({
        playerId: user._id,
        name: user.username,
        position,
        isRegistered: true,
      });
    } else {
      // Add unregistered player
      team.players.push({
        name,
        position,
        isRegistered: false,
      });
    }

    await team.save();
    res.json({ message: 'Player added successfully', team });
  } catch (err) {
    res.status(500).json({ error: 'Error adding player', details: err.message });
  }
});

// Remove a player from a team
router.put('/:teamId/remove-player', [protect, adminOnly], async (req, res) => {
  const { playerId, name } = req.body;

  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    team.players = team.players.filter(
      (p) => String(p.playerId) !== playerId && p.name !== name
    );

    await team.save();
    res.json({ message: 'Player removed successfully', team });
  } catch (err) {
    res.status(500).json({ error: 'Error removing player', details: err.message });
  }
});

// Assign a role to a player
router.put('/:teamId/assign-role', [protect, adminOnly], async (req, res) => {
  const { playerId, role } = req.body;

  if (!role) return res.status(400).json({ error: 'Role is required' });

  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const player = team.players.find((p) => String(p.playerId) === playerId);
    if (!player) return res.status(404).json({ error: 'Player not found in the team' });

    player.role = role;
    await team.save();
    res.json({ message: 'Role assigned successfully', team });
  } catch (err) {
    res.status(500).json({ error: 'Error assigning role', details: err.message });
  }
});

// Update player stats
router.put('/:teamId/update-stats', [protect, adminOnly], async (req, res) => {
  const { stats, reset } = req.body;

  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    if (reset) {
      // Reset all team stats
      team.stats = {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        touchdowns: 0,
        interceptions: 0,
        sacks: 0,
      };

      // Reset all player stats
      team.players.forEach((player) => {
        player.stats = {
          touchdowns: 0,
          interceptions: 0,
          sacks: 0,
        };
      });
    } else if (stats) {
      // Update team stats
      Object.assign(team.stats, stats);
    }

    await team.save();
    res.json({ message: 'Stats updated successfully', team });
  } catch (err) {
    console.error('Error updating stats:', err.message);
    res.status(500).json({ error: 'Error updating stats', details: err.message });
  }
});


// Update team details
router.put('/:id', [protect, adminOnly], async (req, res) => {
  const { name, logo } = req.body;

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { name, logo },
      { new: true } // Return the updated team
    );

    if (!updatedTeam) return res.status(404).json({ error: 'Team not found' });

    res.json({ message: 'Team updated successfully', team: updatedTeam });
  } catch (err) {
    res.status(500).json({ error: 'Error updating team', details: err.message });
  }
});

// Delete a team
router.delete('/:id', [protect, adminOnly], async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);

    if (!deletedTeam) return res.status(404).json({ error: 'Team not found' });

    res.json({ message: 'Team deleted successfully', team: deletedTeam });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting team', details: err.message });
  }
});

module.exports = router;
