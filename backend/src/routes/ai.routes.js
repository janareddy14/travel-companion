const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/itinerary', aiController.generateItinerary);
router.post('/companion-recommendations', aiController.getCompanionRecommendations);

module.exports = router;
