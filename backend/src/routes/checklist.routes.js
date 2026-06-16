const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklist.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/trip/:tripId', checklistController.getByTrip);
router.post('/', checklistController.addItem);
router.put('/:id/toggle', checklistController.toggleItem);
router.delete('/:id', checklistController.deleteItem);

module.exports = router;
