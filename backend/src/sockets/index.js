const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');
const chatHandler = require('./chatHandler');
const { User } = require('../models');

let io;

const initSockets = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.origin,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.userId;
    
    // Join personal room for user-specific events
    socket.join(userId.toString());
    
    // Mark user as online
    await User.findByIdAndUpdate(userId, { isOnline: true });
    socket.broadcast.emit('user_online', userId);

    // Register handlers
    chatHandler(io, socket);

    socket.on('disconnect', async () => {
      // Mark user as offline
      await User.findByIdAndUpdate(userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      });
      socket.broadcast.emit('user_offline', userId);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSockets, getIo };
