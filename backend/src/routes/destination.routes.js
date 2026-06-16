const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destination.controller');
const destinationValidator = require('../validators/destination.validator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', destinationController.getAll);
router.get('/search', destinationController.search);
router.get('/:id', destinationController.getById);

// Admin routes
router.post('/', auth, admin, destinationValidator.createDestinationValidation, destinationValidator.validate, destinationController.create);
router.put('/:id', auth, admin, destinationController.update);
router.delete('/:id', auth, admin, destinationController.delete);

module.exports = router;
