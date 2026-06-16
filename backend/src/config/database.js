const mongoose = require('mongoose');
const config = require('./index');

/**
 * Connect to MongoDB using Mongoose.
 * Logs connection lifecycle events and exits on critical failures.
 */
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      // Mongoose 8 defaults are sensible; explicit options for clarity
      autoIndex: config.nodeEnv !== 'production', // disable auto-index in prod
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    if (error.message.includes('ECONNREFUSED') && config.nodeEnv !== 'production') {
      console.log('⚠️  Local MongoDB not found. Starting in-memory database as fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri, { autoIndex: true });
      console.log(`✅ In-Memory MongoDB connected: ${uri}`);
      console.log('Seeding in-memory database...');
      const seed = require('../database/seed');
      await seed();
      return conn;
    } else {
      console.error('❌ MongoDB connection failed:', error.message);
      process.exit(1);
    }
  }
};

module.exports = connectDatabase;
