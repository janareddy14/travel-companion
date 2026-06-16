const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root (two levels up from src/config/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-companion',

  jwtSecret:
    process.env.JWT_SECRET || 'dev-secret-key-travel-companion-2026',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',

  openweather: {
    apiKey: process.env.OPENWEATHER_API_KEY || '',
    apiUrl:
      process.env.OPENWEATHER_API_URL ||
      'https://api.openweathermap.org/data/2.5',
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'gemini',
    geminiKey: process.env.GEMINI_API_KEY || '',
    openaiKey: process.env.OPENAI_API_KEY || '',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};

module.exports = config;
