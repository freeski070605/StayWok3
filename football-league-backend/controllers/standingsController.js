const Team = require('../models/Team'); // Assuming you have a Team model

// Controller to fetch team standings
const getStandings = async (req, res) => {
    try {
      const teams = await Team.find();
      const standings = teams.map((team) => ({
        _id: team._id,
        name: team.name,
        logo: team.logo || '', // Default empty string if no logo
        stats: {
          wins: team.stats?.wins || 0, // Default to 0 if undefined
          losses: team.stats?.losses || 0, // Default to 0 if undefined
          points: team.stats?.points || 0, // Default to 0 if undefined
          pointsAgainst: team.stats?.pointsAgainst || 0, // Default to 0 if undefined
        },
      }));
  
      // Sort by wins descending, losses ascending
      standings.sort((a, b) => {
        if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins;
        return a.stats.losses - b.stats.losses;
      });
  
      res.status(200).json(standings);
    } catch (error) {
      console.error('Error fetching standings:', error.message);
      res.status(500).json({ error: 'Failed to fetch standings' });
    }
  };
  

module.exports = {
  getStandings,
};
