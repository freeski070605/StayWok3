const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Get stats for a specific team
router.get('/:teamId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId).select('name players stats');
    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json({
      teamName: team.name,
      players: team.players.map((player) => ({
        name: player.name,
        touchdowns: player.stats.touchdowns || 0,
        interceptions: player.stats.interceptions || 0,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch team stats' });
  }
});

module.exports = router;
