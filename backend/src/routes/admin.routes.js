const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(auth);
router.use(admin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/trips', adminController.getAllTrips);
router.post('/destinations', adminController.addDestination);
router.put('/destinations/:id', adminController.updateDestination);
router.delete('/destinations/:id', adminController.deleteDestination);

module.exports = router;
