const mqtt = require('mqtt');
const SensorReading = require('../models/SensorReading');

/**
 * MQTT Service for subscribing to IoT sensor temperature topics
 * Topic pattern: iot/sensor/<deviceId>/temperature
 */
class MQTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Initialize and connect to MQTT broker
   */
  connect() {
    const brokerUrl = process.env.MQTT_BROKER_URL;
    
    if (!brokerUrl) {
      console.warn('MQTT_BROKER_URL not configured. MQTT service will not start.');
      return;
    }

    const options = {
      clientId: `iot-sensor-backend-${Date.now()}`,
      clean: true,
      reconnectPeriod: 5000,
    };

    // Add authentication if provided
    if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
      options.username = process.env.MQTT_USERNAME;
      options.password = process.env.MQTT_PASSWORD;
    }

    this.client = mqtt.connect(brokerUrl, options);

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('MQTT Client connected to broker');

      // Subscribe to all device temperature topics
      // Using wildcard pattern: iot/sensor/+/temperature
      const topicPattern = 'iot/sensor/+/temperature';
      this.client.subscribe(topicPattern, (err) => {
        if (err) {
          console.error('MQTT subscription error:', err);
        } else {
          console.log(`Subscribed to MQTT topic pattern: ${topicPattern}`);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        await this.handleMessage(topic, message);
      } catch (error) {
        console.error('Error handling MQTT message:', error);
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT Client error:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      console.log('MQTT Client connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnect', () => {
      console.log('MQTT Client reconnecting...');
    });
  }

  /**
   * Handle incoming MQTT messages
   * @param {string} topic - MQTT topic
   * @param {Buffer} message - Message payload
   */
  async handleMessage(topic, message) {
    try {
      // Extract deviceId from topic: iot/sensor/<deviceId>/temperature
      const topicParts = topic.split('/');
      if (topicParts.length !== 4 || topicParts[0] !== 'iot' || topicParts[1] !== 'sensor' || topicParts[3] !== 'temperature') {
        console.warn(`Invalid topic format: ${topic}`);
        return;
      }

      const deviceId = topicParts[2];

      // Parse message payload (expected JSON)
      let payload;
      try {
        payload = JSON.parse(message.toString());
      } catch (parseError) {
        console.error(`Failed to parse MQTT message payload for device ${deviceId}:`, parseError);
        return;
      }

      // Extract temperature and optional timestamp
      const { temperature, timestamp } = payload;

      if (temperature === undefined || temperature === null) {
        console.warn(`Missing temperature in MQTT message for device ${deviceId}`);
        return;
      }

      // Validate temperature is a number
      const temperatureValue = parseFloat(temperature);
      if (isNaN(temperatureValue)) {
        console.warn(`Invalid temperature value in MQTT message for device ${deviceId}: ${temperature}`);
        return;
      }

      // Use current time if timestamp not provided
      const readingTimestamp = timestamp || Date.now();

      // Create and save sensor reading
      const sensorReading = new SensorReading({
        deviceId,
        temperature: temperatureValue,
        timestamp: readingTimestamp,
      });

      const savedReading = await sensorReading.save();
      console.log(`MQTT: Ingested reading for device ${deviceId} - Temperature: ${temperatureValue}°C`);

      return savedReading;
    } catch (error) {
      console.error(`Error processing MQTT message from topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
      console.log('MQTT Client disconnected');
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
    };
  }
}

// Export singleton instance
const mqttService = new MQTTService();

module.exports = mqttService;
