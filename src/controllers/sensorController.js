const SensorReading = require('../models/SensorReading');

/**
 * Ingest sensor reading
 * POST /api/sensor/ingest
 */
const ingestSensorReading = async (req, res) => {
  try {
    const { deviceId, temperature, timestamp } = req.body;

    // Use current time if timestamp is not provided
    const readingTimestamp = timestamp || Date.now();

    // Create new sensor reading
    const sensorReading = new SensorReading({
      deviceId,
      temperature,
      timestamp: readingTimestamp,
    });

    const savedReading = await sensorReading.save();

    res.status(201).json({
      success: true,
      message: 'Sensor reading ingested successfully',
      data: {
        id: savedReading._id,
        deviceId: savedReading.deviceId,
        temperature: savedReading.temperature,
        timestamp: savedReading.timestamp,
        createdAt: savedReading.createdAt,
      },
    });
  } catch (error) {
    console.error('Error ingesting sensor reading:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};

/**
 * Get latest sensor reading for a device
 * GET /api/sensor/:deviceId/latest
 */
const getLatestReading = async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Find the latest reading for the device
    // Sort by timestamp descending and limit to 1
    const latestReading = await SensorReading.findOne({ deviceId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestReading) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `No readings found for device: ${deviceId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        deviceId: latestReading.deviceId,
        temperature: latestReading.temperature,
        timestamp: latestReading.timestamp,
        createdAt: latestReading.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};

module.exports = {
  ingestSensorReading,
  getLatestReading,
};
