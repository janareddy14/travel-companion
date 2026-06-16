const { body, validationResult } = require('express-validator');

exports.createCompanionValidation = [
  body('destinationName')
    .notEmpty()
    .withMessage('Destination name is required')
    .trim(),
  body('travelDates')
    .optional()
    .isString(),
  body('interests')
    .optional()
    .isString(),
  body('bio')
    .optional()
    .isString(),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
