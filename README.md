# IoT Sensor Temperature Backend Service

A Node.js backend service that ingests IoT sensor temperature readings, persists them to MongoDB Atlas, and exposes REST API endpoints to retrieve sensor data. Includes bonus MQTT subscriber functionality for real-time sensor data ingestion.

## Features

- ✅ **POST /api/sensor/ingest** - Ingest sensor temperature readings
- ✅ **GET /api/sensor/:deviceId/latest** - Retrieve latest reading for a device
- ✅ MongoDB Atlas integration with Mongoose ODM
- ✅ Input validation for required fields
- ✅ Automatic timestamp handling
- ✅ MQTT subscriber for real-time sensor data (Bonus Feature)
- ✅ Comprehensive error handling
- ✅ Health check endpoint

## Prerequisites

- Node.js 18+ or 20 LTS
- MongoDB Atlas account (free tier)
- npm or yarn package manager
- (Optional) MQTT broker for bonus feature

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iot-sensor-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iot-sensors?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   
   # Optional: MQTT Configuration (for bonus feature)
   MQTT_BROKER_URL=mqtt://broker.example.com:1883
   MQTT_USERNAME=your_mqtt_username
   MQTT_PASSWORD=your_mqtt_password
   ```

4. **Get MongoDB Atlas Connection String**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Go to "Database Access" and create a database user
   - Go to "Network Access" and add your IP (or 0.0.0.0/0 for development)
   - Click "Connect" on your cluster → "Connect your application"
   - Copy the connection string and replace `<password>` with your database user password

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-29T10:30:00.000Z"
}
```

### Ingest Sensor Reading

**Endpoint:** `POST /api/sensor/ingest`

**Request Body:**
```json
{
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000
}
```

**Note:** `timestamp` is optional. If not provided, the server will use the current time.

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "sensor-01",
    "temperature": 32.1,
    "timestamp": 1705312440000
  }'
```

**Without timestamp (auto-generated):**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "sensor-01",
    "temperature": 25.5
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Sensor reading ingested successfully",
  "data": {
    "id": "65f1234567890abcdef12345",
    "deviceId": "sensor-01",
    "temperature": 32.1,
    "timestamp": 1705312440000,
    "createdAt": "2024-01-29T10:30:00.000Z"
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "deviceId",
      "message": "Device ID is required"
    }
  ]
}
```

### Get Latest Reading

**Endpoint:** `GET /api/sensor/:deviceId/latest`

**cURL Example:**
```bash
curl http://localhost:3000/api/sensor/sensor-01/latest
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "deviceId": "sensor-01",
    "temperature": 32.1,
    "timestamp": 1705312440000,
    "createdAt": "2024-01-29T10:30:00.000Z"
  }
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "error": "Not found",
  "message": "No readings found for device: sensor-01"
}
```

## Postman Collection

### Import Collection

You can import these endpoints into Postman:

1. **POST** `http://localhost:3000/api/sensor/ingest`
   - Body (raw JSON):
     ```json
     {
       "deviceId": "sensor-01",
       "temperature": 32.1,
       "timestamp": 1705312440000
     }
     ```

2. **GET** `http://localhost:3000/api/sensor/sensor-01/latest`

3. **GET** `http://localhost:3000/health`

## MQTT Integration (Bonus Feature)

The service includes an MQTT subscriber that automatically ingests sensor readings from MQTT topics.

### Topic Pattern
```
iot/sensor/<deviceId>/temperature
```

### Message Format
The MQTT message payload should be JSON:
```json
{
  "temperature": 32.1,
  "timestamp": 1705312440000
}
```

**Note:** `timestamp` is optional. If not provided, the server will use the current time.

### Configuration

Add MQTT broker details to your `.env` file:
```env
MQTT_BROKER_URL=mqtt://broker.example.com:1883
MQTT_USERNAME=your_username  # Optional
MQTT_PASSWORD=your_password  # Optional
```

### Testing MQTT

You can use `mosquitto_pub` to publish test messages:

```bash
mosquitto_pub -h broker.example.com -t "iot/sensor/sensor-01/temperature" \
  -m '{"temperature": 28.5, "timestamp": 1705312440000}'
```

Or without timestamp:
```bash
mosquitto_pub -h broker.example.com -t "iot/sensor/sensor-01/temperature" \
  -m '{"temperature": 28.5}'
```

The service will automatically:
1. Subscribe to all topics matching `iot/sensor/+/temperature`
2. Extract the `deviceId` from the topic
3. Parse the JSON payload
4. Save the reading to MongoDB

## Database Schema

### SensorReading Collection

```javascript
{
  deviceId: String (required, indexed),
  temperature: Number (required),
  timestamp: Number (required, indexed, epoch milliseconds),
  createdAt: Date (default: now)
}
```

### Indexes

- Single index on `deviceId`
- Single index on `timestamp`
- Compound index on `(deviceId, timestamp)` for efficient latest reading queries

## Project Structure

```
iot-sensor-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── models/
│   │   └── SensorReading.js     # Mongoose schema and model
│   ├── controllers/
│   │   └── sensorController.js  # Business logic for endpoints
│   ├── routes/
│   │   └── sensorRoutes.js      # API route definitions
│   ├── middleware/
│   │   └── validation.js        # Input validation middleware
│   ├── services/
│   │   └── mqttService.js       # MQTT subscriber service (bonus)
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## Error Handling

The API returns consistent error responses:

- **400 Bad Request** - Validation errors
- **404 Not Found** - Device not found
- **500 Internal Server Error** - Server/database errors

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": [] // Optional, for validation errors
}
```

## Validation Rules

- **deviceId**: Required, must be a non-empty string
- **temperature**: Required, must be a valid number
- **timestamp**: Optional, must be a valid number (epoch milliseconds) if provided

## Testing

### Manual Testing with cURL

1. **Ingest a reading:**
   ```bash
   curl -X POST http://localhost:3000/api/sensor/ingest \
     -H "Content-Type: application/json" \
     -d '{"deviceId": "sensor-01", "temperature": 25.5}'
   ```

2. **Get latest reading:**
   ```bash
   curl http://localhost:3000/api/sensor/sensor-01/latest
   ```

3. **Test validation (missing deviceId):**
   ```bash
   curl -X POST http://localhost:3000/api/sensor/ingest \
     -H "Content-Type: application/json" \
     -d '{"temperature": 25.5}'
   ```

4. **Test validation (invalid temperature):**
   ```bash
   curl -X POST http://localhost:3000/api/sensor/ingest \
     -H "Content-Type: application/json" \
     -d '{"deviceId": "sensor-01", "temperature": "invalid"}'
   ```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **express-validator** - Input validation
- **MQTT.js** - MQTT client library
- **dotenv** - Environment variable management

## License

ISC

## Author

Created for Falcon Labs Node.js Internship Pre-Assessment Assignment
