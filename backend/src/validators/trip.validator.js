const { body, validationResult } = require('express-validator');

exports.createTripValidation = [
  body('destinationId')
    .optional()
    .isMongoId()
    .withMessage('Invalid destination ID'),
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('travelType')
    .optional()
    .isIn(['SOLO', 'COUPLE', 'FAMILY', 'ADVENTURE', 'GROUP', 'BUSINESS'])
    .withMessage('Invalid travel type'),
  body('notes')
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
