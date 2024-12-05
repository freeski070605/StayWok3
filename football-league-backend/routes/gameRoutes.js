const express = require('express');
const Game = require('../models/Game');
const Team = require('../models/Team');
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/authMiddleware');


const router = express.Router();

const safeNumber = (value) => parseInt(value, 10) || 0;


router.get('/', async (req, res) => {
  console.log('GET /games endpoint hit'); // Log when the endpoint is accessed
  try {
    const games = await Game.find()
      .populate('team1', 'name logo')
      .populate('team2', 'name logo')
      .populate('highlights'); // Populate highlights


    console.log('Populated Games:', JSON.stringify(games, null, 2));
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err.message);
    res.status(500).json({ error: 'Error fetching games', details: err.message });
  }
});

// Get game details by ID
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId)
      .populate('team1', 'name players')
      .populate('team2', 'name players');
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (err) {
    console.error('Error fetching game details:', err.message);
    res.status(500).json({ error: 'Error fetching game details' });
  }
});




// Schedule a new game
router.post('/', async (req, res) => {
  const { team1, team2, date, location } = req.body;

  try {
    const game = new Game({ team1, team2, date, location });
    await game.save();

    // Send notifications to both teams
    await Notification.create({
      recipient: team1,
      message: `You have a game scheduled against ${team2.name} on ${new Date(date).toLocaleString()} at ${location}.`,
    });
    await Notification.create({
      recipient: team2,
      message: `You have a game scheduled against ${team1.name} on ${new Date(date).toLocaleString()} at ${location}.`,
    });

    res.status(201).json({ message: 'Game scheduled successfully!', game });
  } catch (err) {
    res.status(400).json({ error: 'Error scheduling game', details: err.message });
  }
});

// Update game 
router.put('/:gameId', [protect, adminOnly], async (req, res) => {
  const { date, location, score, completed } = req.body;

  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (date) game.date = date;
    if (location) game.location = location;
    if (score) game.score = score;
    if (completed !== undefined) game.completed = completed;

    await game.save();
    res.json({ message: 'Game updated successfully', game });
  } catch (err) {
    res.status(500).json({ error: 'Error updating game', details: err.message });
  }
});

router.put('/:gameId/update-results', protect, adminOnly, async (req, res) => {
  const {
    team1Results = {},
    team2Results = {},
    playerStatsTeam1 = [],
    playerStatsTeam2 = [],
  } = req.body;

  console.log('Request Body:', req.body);

  try {
    // Fetch game and validate existence
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      console.error('Game not found:', req.params.gameId);
      return res.status(404).json({ error: 'Game not found' });
    }

    // Fetch teams and validate existence
    const team1 = await Team.findById(game.team1);
    const team2 = await Team.findById(game.team2);

    if (!team1 || !team2) {
      console.error('Teams not found:', { team1: game.team1, team2: game.team2 });
      return res.status(404).json({ error: 'Teams not found' });
    }

    // Update game results
    console.log('Updating game results...');
    game.team1Results = {
      score: safeNumber(team1Results.score),
      touchdowns: safeNumber(team1Results.touchdowns),
      interceptions: safeNumber(team1Results.interceptions),
      sacks: safeNumber(team1Results.sacks),
    };

    game.team2Results = {
      score: safeNumber(team2Results.score),
      touchdowns: safeNumber(team2Results.touchdowns),
      interceptions: safeNumber(team2Results.interceptions),
      sacks: safeNumber(team2Results.sacks),
    };

    game.completed = true;
    await game.save();

    // Helper function to update team stats
    const updateTeamStats = (team, results, opponentResults) => {
      console.log(`Updating stats for team: ${team.name}`);
      team.stats.gamesPlayed += 1;
      team.stats.pointsFor += safeNumber(results.score);
      team.stats.pointsAgainst += safeNumber(opponentResults.score);
      team.stats.touchdowns += safeNumber(results.touchdowns);
      team.stats.interceptions += safeNumber(results.interceptions);
      team.stats.sacks += safeNumber(results.sacks);

      if (safeNumber(results.score) > safeNumber(opponentResults.score)) {
        team.stats.wins += 1;
      } else {
        team.stats.losses += 1;
      }
    };

    // Update team stats
    updateTeamStats(team1, game.team1Results, game.team2Results);
    updateTeamStats(team2, game.team2Results, game.team1Results);

    await team1.save();
    await team2.save();

    // Helper function to update player stats
    const updatePlayerStats = (team, playerStats) => {
      for (const playerStat of playerStats) {
        const player = team.players.find((p) => String(p.name) === playerStat.name);
        if (player) {
          player.stats.touchdowns += playerStat.touchdowns || 0;
          player.stats.interceptions += playerStat.interceptions || 0;
          player.stats.sacks += playerStat.sacks || 0;
        } else {
          console.warn(`Player not found in team: ${playerStat.name}`);
        }
      }
    };
    

    // Update player stats
    console.log('Player stats before update:', team1.players);
    console.log('Player stats before update:', team2.players);
    updatePlayerStats(team1, playerStatsTeam1);
    updatePlayerStats(team2, playerStatsTeam2);
    console.log('Updated player stats for team1:', team1.players);
    console.log('Updated player stats for team2:', team2.players);

    await team1.save();
    await team2.save();



    res.json({ message: 'Game results and stats updated successfully' });
  } catch (err) {
    console.error('Error updating game results:', err);
    res.status(500).json({ error: 'Failed to update game results' });
  }
});


router.post('/:gameId/highlights', protect, async (req, res) => {
  const { title, description, mediaUrl } = req.body;

  try {
    const highlight = new Content({
      title,
      description,
      mediaUrl,
      type: 'highlight',
      createdBy: req.user._id,
    });
    await highlight.save();

    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.highlights.push(highlight._id);
    await game.save();

    res.json({ message: 'Highlight added successfully', highlight });
  } catch (err) {
    res.status(500).json({ error: 'Error adding highlight', details: err.message });
  }
});




router.delete('/:gameId', [protect, adminOnly], async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting game', details: err.message });
  }
});



module.exports = router;
