const mongoose = require('mongoose');


const leaderboardSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    position: { type: Number, required: true }, // Ranking position
    points: { type: Number, default: 0 }, // Total points
  }, { timestamps: true });
  
  module.exports = mongoose.model('Leaderboard', leaderboardSchema);
  