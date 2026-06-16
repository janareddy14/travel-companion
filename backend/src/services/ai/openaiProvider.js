const AIProvider = require('./aiProvider');
const fetch = require('node-fetch');

class OpenAIProvider extends AIProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async generateItinerary(destination, budget, days, interests) {
    const prompt = `Create a ${days}-day travel itinerary for ${destination} with a budget of ${budget} USD. 
User interests: ${interests}.
Return the response strictly as a JSON object with the following structure:
{
  "itinerary": [
    { "day": 1, "title": "Day 1 title", "activities": ["Activity 1", "Activity 2"] }
  ]
}`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      });
      if (!response.ok) throw new Error('Failed to fetch from OpenAI');
      
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (err) {
      console.error('OpenAI error:', err);
      throw new Error('Failed to generate AI itinerary');
    }
  }

  async generateCompanionRecommendations(userProfile, candidates) {
    const prompt = `You are a travel companion matchmaker. I have a user looking for a travel buddy.
User Profile: Destination: ${userProfile.destinationName}, Budget Max: ${userProfile.budgetMax}, Interests: ${userProfile.interests}
Candidates:
${candidates.map(c => `ID: ${c.id}, Username: ${c.username}, Budget Max: ${c.budgetMax}, Interests: ${c.interests}`).join('\n')}

Select the top 3 candidates and provide reasoning.
Return strictly as a JSON object:
{
  "recommendations": ["id1", "id2"],
  "reasoning": "Explanation of why these are good matches."
}`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      });
      if (!response.ok) throw new Error('Failed to fetch from OpenAI');
      
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (err) {
      console.error('OpenAI error:', err);
      throw new Error('Failed to generate AI recommendations');
    }
  }
}

module.exports = OpenAIProvider;
