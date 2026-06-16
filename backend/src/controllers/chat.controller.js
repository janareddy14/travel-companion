const chatService = require('../services/chat.service');

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await chatService.getUserRooms(req.user._id);
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const messages = await chatService.getRoomMessages(req.params.id, req.user._id, page, limit);
    res.json(messages);
  } catch (error) {
    if (error.message === 'Unauthorized') return res.status(403).json({ message: error.message });
    if (error.message === 'Room not found') return res.status(404).json({ message: error.message });
    next(error);
  }
};

exports.getUnreadCounts = async (req, res, next) => {
  try {
    const counts = await chatService.getUnreadCounts(req.user._id);
    res.json(counts);
  } catch (error) {
    next(error);
  }
};
