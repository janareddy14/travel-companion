const config = require('../../config');
const GeminiProvider = require('./geminiProvider');
const OpenAIProvider = require('./openaiProvider');
const AIProvider = require('./aiProvider');

class MockProvider extends AIProvider {
  async generateItinerary(destination, budget, days, interests) {
    const itinerary = [];
    for (let i = 1; i <= days; i++) {
      itinerary.push({
        day: i,
        title: `Explore ${destination} - Day ${i}`,
        activities: [
          `Morning: Visit top attractions related to ${interests}`,
          `Afternoon: Enjoy local cuisine and culture`,
          `Evening: Relax and prepare for the next day`
        ]
      });
    }
    return { itinerary };
  }

  async generateCompanionRecommendations(userProfile, candidates) {
    const recs = candidates.slice(0, 3).map(c => c.id);
    return {
      recommendations: recs,
      reasoning: "These candidates have matching destinations and overlapping interests. (MOCK DATA)"
    };
  }
}

function getAIProvider() {
  const provider = config.ai.provider;
  if (provider === 'openai' && config.ai.openaiKey) {
    return new OpenAIProvider(config.ai.openaiKey);
  }
  if (provider === 'gemini' && config.ai.geminiKey) {
    return new GeminiProvider(config.ai.geminiKey);
  }
  return new MockProvider();
}

module.exports = { getAIProvider };
