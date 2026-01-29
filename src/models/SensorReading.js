const mongoose = require('mongoose');

/**
 * Sensor Reading Schema
 * Stores IoT sensor temperature readings
 */
const sensorReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      trim: true,
      index: true,
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required'],
    },
    timestamp: {
      type: Number,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We're using createdAt manually
  }
);

// Compound index for efficient latest reading queries
sensorReadingSchema.index({ deviceId: 1, timestamp: -1 });

// Index for sorting by timestamp descending
sensorReadingSchema.index({ timestamp: -1 });

const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);

module.exports = SensorReading;
