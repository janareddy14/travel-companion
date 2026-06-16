const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const tripValidator = require('../validators/trip.validator');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', tripController.getMyTrips);
router.post('/', tripValidator.createTripValidation, tripValidator.validate, tripController.create);
router.put('/:id', tripController.update);
router.delete('/:id', tripController.delete);

module.exports = router;
