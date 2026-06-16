const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/potential', matchController.getPotentialMatches);
router.post('/request', matchController.sendRequest);
router.get('/requests', matchController.getRequests);
router.put('/requests/:id/accept', matchController.acceptRequest);
router.put('/requests/:id/reject', matchController.rejectRequest);
router.get('/accepted', matchController.getAcceptedMatches);

module.exports = router;
