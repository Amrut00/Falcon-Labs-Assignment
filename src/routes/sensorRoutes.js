const express = require('express');
const router = express.Router();
const {
  ingestSensorReading,
  getLatestReading,
} = require('../controllers/sensorController');
const {
  validateSensorReading,
  handleValidationErrors,
} = require('../middleware/validation');

/**
 * POST /api/sensor/ingest
 * Ingest a new sensor reading
 */
router.post(
  '/ingest',
  validateSensorReading,
  handleValidationErrors,
  ingestSensorReading
);

/**
 * GET /api/sensor/:deviceId/latest
 * Get the latest reading for a specific device
 */
router.get('/:deviceId/latest', getLatestReading);

module.exports = router;
