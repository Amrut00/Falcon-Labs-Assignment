const { body, validationResult } = require('express-validator');

/**
 * Validation rules for sensor reading ingestion
 */
const validateSensorReading = [
  body('deviceId')
    .trim()
    .notEmpty()
    .withMessage('Device ID is required')
    .isString()
    .withMessage('Device ID must be a string'),
  
  body('temperature')
    .notEmpty()
    .withMessage('Temperature is required')
    .isFloat()
    .withMessage('Temperature must be a valid number'),
  
  body('timestamp')
    .optional()
    .isNumeric()
    .withMessage('Timestamp must be a valid number (epoch milliseconds)')
    .custom((value) => {
      if (value && (value < 0 || value > Number.MAX_SAFE_INTEGER)) {
        throw new Error('Timestamp must be a valid epoch milliseconds value');
      }
      return true;
    }),
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validateSensorReading,
  handleValidationErrors,
};
