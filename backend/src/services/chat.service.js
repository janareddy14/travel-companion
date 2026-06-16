const { ChatRoom, Message } = require('../models');

exports.getUserRooms = async (userId) => {
  return await ChatRoom.find({ participants: userId })
    .populate('participants', 'username isOnline lastSeen profileImage')
    .sort({ lastMessageAt: -1 });
};

exports.getRoomMessages = async (roomId, userId, page = 1, limit = 50) => {
  const room = await ChatRoom.findById(roomId);
  if (!room) throw new Error('Room not found');
  if (!room.participants.includes(userId)) throw new Error('Unauthorized');

  const skip = (page - 1) * limit;
  const messages = await Message.find({ chatRoomId: roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return messages.reverse();
};

exports.getUnreadCounts = async (userId) => {
  const rooms = await ChatRoom.find({ participants: userId });
  const roomIds = rooms.map(r => r._id);
  
  const unreadMessages = await Message.aggregate([
    { $match: { chatRoomId: { $in: roomIds }, senderId: { $ne: userId }, readAt: null } },
    { $group: { _id: '$chatRoomId', count: { $sum: 1 } } }
  ]);

  const counts = {};
  unreadMessages.forEach(um => {
    counts[um._id] = um.count;
  });
  return counts;
};

exports.createMessage = async (roomId, senderId, content, type = 'TEXT') => {
  const room = await ChatRoom.findById(roomId);
  if (!room) throw new Error('Room not found');
  if (!room.participants.includes(senderId)) throw new Error('Unauthorized');

  const message = new Message({
    chatRoomId: roomId,
    senderId,
    content,
    type
  });
  await message.save();

  room.lastMessage = type === 'TEXT' ? content : 'System message';
  room.lastMessageAt = new Date();
  await room.save();

  return message;
};

exports.markMessagesRead = async (messageIds) => {
  await Message.updateMany(
    { _id: { $in: messageIds }, readAt: null },
    { $set: { readAt: new Date() } }
  );
};
