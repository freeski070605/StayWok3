const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  team1Results: {
    score: { type: Number, default: 0 },
    touchdowns: { type: Number, default: 0 },
    interceptions: { type: Number, default: 0 },
    sacks: { type: Number, default: 0 },
  },
  team2Results: {
    score: { type: Number, default: 0 },
    touchdowns: { type: Number, default: 0 },
    interceptions: { type: Number, default: 0 },
    sacks: { type: Number, default: 0 },
  },
  completed: { type: Boolean, default: false },
  highlights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }], // Array of highlights
  mvp: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
