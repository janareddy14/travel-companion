const http = require('http');
const app = require('./app');
const config = require('./config');
const connectDatabase = require('./config/database');
const { initSockets } = require('./sockets');

// Create HTTP server
const server = http.createServer(app);

/**
 * Bootstrap the application:
 * 1. Connect to MongoDB
 * 2. Initialize Socket.IO on the HTTP server
 * 3. Start listening
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Initialize Socket.IO
    initSockets(server);

    // Start listening
    server.listen(config.port, () => {
      console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`   Health check: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// ── Graceful shutdown helpers ────────────────────────────────────────────

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server and exit after cleanup
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Close server and exit after cleanup
  server.close(() => process.exit(1));
});

// Handle SIGTERM (e.g. Docker stop)
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('   Server closed');
    process.exit(0);
  });
});

startServer();
