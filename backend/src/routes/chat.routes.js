const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/rooms', chatController.getRooms);
router.get('/rooms/:id/messages', chatController.getMessages);
router.get('/unread', chatController.getUnreadCounts);

module.exports = router;
