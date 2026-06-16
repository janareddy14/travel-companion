const AIProvider = require('./aiProvider');
const fetch = require('node-fetch');

class GeminiProvider extends AIProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  async generateItinerary(destination, budget, days, interests) {
    const prompt = `Create a ${days}-day travel itinerary for ${destination} with a budget of ${budget} USD. 
User interests: ${interests}.
Return the response strictly as a JSON object with the following structure:
{
  "itinerary": [
    { "day": 1, "title": "Day 1 title", "activities": ["Activity 1", "Activity 2"] }
  ]
}
Do not include markdown blocks or any other text.`;

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) throw new Error('Failed to fetch from Gemini');
      
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Clean up potential markdown formatting
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (err) {
      console.error('Gemini error:', err);
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
}
Do not include markdown blocks.`;

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) throw new Error('Failed to fetch from Gemini');
      
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (err) {
      console.error('Gemini error:', err);
      throw new Error('Failed to generate AI recommendations');
    }
  }
}

module.exports = GeminiProvider;
