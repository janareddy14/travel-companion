const { getAIProvider } = require('../services/ai');
const { TravelCompanion } = require('../models');

exports.generateItinerary = async (req, res, next) => {
  try {
    const { destination, budget, days, interests } = req.body;
    const provider = getAIProvider();
    const result = await provider.generateItinerary(destination, budget, days, interests);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getCompanionRecommendations = async (req, res, next) => {
  try {
    const { destination, budget, interests } = req.body;
    const userProfile = { destinationName: destination, budgetMax: budget, interests };
    
    // Get candidate pool (other users traveling to the same destination)
    const regex = new RegExp(destination, 'i');
    const candidates = await TravelCompanion.find({
      destinationName: regex,
      userId: { $ne: req.user._id }
    }).populate('userId', 'username');

    if (candidates.length === 0) {
      return res.json({ recommendations: [], reasoning: "No candidates found for this destination." });
    }

    const provider = getAIProvider();
    const formattedCandidates = candidates.map(c => ({
      id: c._id,
      username: c.userId?.username,
      budgetMax: c.budgetMax,
      interests: c.interests
    }));

    const result = await provider.generateCompanionRecommendations(userProfile, formattedCandidates);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
