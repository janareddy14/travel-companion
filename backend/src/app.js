require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// ── Route imports ────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const destinationRoutes = require('./routes/destination.routes');
const tripRoutes = require('./routes/trip.routes');
const companionRoutes = require('./routes/companion.routes');
const checklistRoutes = require('./routes/checklist.routes');
const weatherRoutes = require('./routes/weather.routes');
const adminRoutes = require('./routes/admin.routes');
const matchRoutes = require('./routes/match.routes');
const chatRoutes = require('./routes/chat.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// ── Security Headers ─────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// ── Request Logging ──────────────────────────────────────────────────────
if (config.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

// ── Body Parsers ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiter (applied to /api/ routes only) ──────────────────────────
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// ── Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/companions', companionRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);

// ── 404 Handler (unmatched routes) ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler (must be last) ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
