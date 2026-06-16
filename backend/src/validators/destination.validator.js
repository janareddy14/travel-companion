const { body, validationResult } = require('express-validator');

exports.createDestinationValidation = [
  body('name')
    .notEmpty()
    .withMessage('Destination name is required')
    .trim(),
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .trim(),
  body('description')
    .optional()
    .isString(),
  body('imageUrl')
    .optional()
    .isString(),
  body('bestSeason')
    .optional()
    .isString(),
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  body('latitude')
    .optional()
    .isFloat()
    .withMessage('Latitude must be a valid number'),
  body('longitude')
    .optional()
    .isFloat()
    .withMessage('Longitude must be a valid number'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
