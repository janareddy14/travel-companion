const express = require('express');
const router = express.Router();
const companionController = require('../controllers/companion.controller');
const companionValidator = require('../validators/companion.validator');
const auth = require('../middleware/auth');

// Public routes
router.get('/', companionController.getAll);
router.get('/search', companionController.search);

// Protected routes
router.post('/', auth, companionValidator.createCompanionValidation, companionValidator.validate, companionController.create);
router.delete('/:id', auth, companionController.delete);

module.exports = router;
