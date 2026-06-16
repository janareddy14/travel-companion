const chatService = require('../services/chat.service');

module.exports = (io, socket) => {
  socket.on('join_room', async (roomId) => {
    // Validate if user is participant (can add logic here)
    socket.join(roomId.toString());
  });

  socket.on('send_message', async (data) => {
    try {
      const { roomId, content, type = 'TEXT' } = data;
      const message = await chatService.createMessage(roomId, socket.user.userId, content, type);
      
      // Broadcast to room
      io.to(roomId.toString()).emit('new_message', message);
      
      // Optionally update unread counts here via personal room
    } catch (err) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', (roomId) => {
    socket.to(roomId.toString()).emit('user_typing', { userId: socket.user.userId, roomId });
  });

  socket.on('stop_typing', (roomId) => {
    socket.to(roomId.toString()).emit('user_stop_typing', { userId: socket.user.userId, roomId });
  });

  socket.on('mark_read', async (data) => {
    try {
      const { roomId, messageIds } = data;
      await chatService.markMessagesRead(messageIds);
      socket.to(roomId.toString()).emit('messages_read', { roomId, messageIds });
    } catch (err) {
      console.error(err);
    }
  });
};
