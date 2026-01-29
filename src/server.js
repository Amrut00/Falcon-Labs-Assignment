require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const mqttService = require('./services/mqttService');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start MQTT service (bonus feature)
if (process.env.MQTT_BROKER_URL) {
  mqttService.connect();
} else {
  console.log('MQTT service skipped - MQTT_BROKER_URL not configured');
}

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mqttService.disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mqttService.disconnect();
    process.exit(0);
  });
});
