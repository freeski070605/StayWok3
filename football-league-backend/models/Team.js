const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // Team logo URL
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    points : { type: Number, default: 0 },
    pointsAgainst: { type: Number, default: 0 },
    touchdowns: { type: Number, default: 0 }, // Total points scored by the player
    interceptions: { type: Number, default: 0 },
    sacks: { type: Number, default: 0 },
  },
  players: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked to User account
      name: { type: String, required: true }, // Player name (for unregistered players)
      role: { type: String, enum: ['captain', 'player'], default: 'player' }, // Player role
      position: { type: String, required: true },
      isRegistered: { type: Boolean, default: false }, // Whether the player is registered
      stats: {
        gamesPlayed: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        touchdowns: { type: Number, default: 0 }, // Total points scored by the player
        interceptions: { type: Number, default: 0 },
        sacks: { type: Number, default: 0 },
      },
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
