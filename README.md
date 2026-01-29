# IoT Sensor Temperature Backend Service

A Node.js backend service that ingests IoT sensor temperature readings, persists them to MongoDB Atlas, and exposes REST API endpoints to retrieve sensor data.

## Features

- ✅ **POST /api/sensor/ingest** - Ingest sensor temperature readings with validation
- ✅ **GET /api/sensor/:deviceId/latest** - Retrieve latest reading for a device
- ✅ MongoDB Atlas integration with Mongoose ODM
- ✅ Input validation for required fields (deviceId, temperature)
- ✅ Automatic timestamp handling (defaults to current time if missing)
- ✅ Comprehensive error handling

## Prerequisites

- **Node.js** 18+ or 20 LTS
- **MongoDB Atlas** account (free tier)
- **npm** package manager

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd iot-sensor-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```
   On Windows:
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Edit `.env` file** and add your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iot-sensors?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   ```

### Step 4: Set Up MongoDB Atlas

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a free cluster** (M0 Free tier)
3. **Create a database user:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
4. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
5. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" and version "5.5 or later"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials
   - Add database name: `...mongodb.net/iot-sensors?retryWrites=true&w=majority`

**Example connection string:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/iot-sensors?retryWrites=true&w=majority
```

**Note:** If your password contains special characters (like `@`, `#`, `:`), URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `:` becomes `%3A`

## Running the Application

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

**Expected output:**
```
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net:27017
Server is running on port 3000
Environment: development
Health check: http://localhost:3000/health
```

## API Endpoints

### Health Check

**Endpoint:** `GET /health`

**cURL Example:**
```bash
curl http://localhost:3000/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-29T10:30:00.000Z"
}
```

---

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

**Fields:**
- `deviceId` (string, required) - Unique identifier for the sensor device
- `temperature` (number, required) - Temperature reading value
- `timestamp` (number, optional) - Epoch milliseconds. If not provided, server uses current time

**cURL Examples:**

**With timestamp:**
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

**Windows PowerShell:**
```powershell
$body = @{
    deviceId = "sensor-01"
    temperature = 32.1
    timestamp = 1705312440000
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/sensor/ingest -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

**Success Response (201 Created):**
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

**Validation Error Response (400 Bad Request):**
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

---

### Get Latest Reading

**Endpoint:** `GET /api/sensor/:deviceId/latest`

**URL Parameters:**
- `deviceId` (string, required) - The device ID to query

**cURL Example:**
```bash
curl http://localhost:3000/api/sensor/sensor-01/latest
```

**Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/sensor/sensor-01/latest -UseBasicParsing
```

**Success Response (200 OK):**
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

**Not Found Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Not found",
  "message": "No readings found for device: sensor-01"
}
```

---

## Postman Collection

### Setting Up Postman

1. **Download Postman** from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Create a new Collection:** "IoT Sensor API"

### Request Examples

#### 1. Health Check

- **Method:** `GET`
- **URL:** `http://localhost:3000/health`
- **Headers:** None required
- **Body:** None

#### 2. Ingest Sensor Reading (with timestamp)

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/sensor/ingest`
- **Headers:**
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "deviceId": "sensor-01",
    "temperature": 32.1,
    "timestamp": 1705312440000
  }
  ```

#### 3. Ingest Sensor Reading (without timestamp)

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/sensor/ingest`
- **Headers:**
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "deviceId": "sensor-01",
    "temperature": 25.5
  }
  ```

#### 4. Get Latest Reading

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sensor/sensor-01/latest`
- **Headers:** None required
- **Body:** None

#### 5. Test Validation Error

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/sensor/ingest`
- **Headers:**
  - `Content-Type: application/json`
- **Body** (raw JSON - missing deviceId):
  ```json
  {
    "temperature": 25.5
  }
  ```
  **Expected:** 400 Bad Request with validation error

#### 6. Test 404 Error

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sensor/non-existent/latest`
- **Expected:** 404 Not Found

---

## Database Schema

### SensorReading Collection

```javascript
{
  _id: ObjectId,
  deviceId: String (required, indexed),
  temperature: Number (required),
  timestamp: Number (required, indexed, epoch milliseconds),
  createdAt: Date (default: now)
}
```

### Indexes

- **Single index** on `deviceId` - Fast device lookups
- **Single index** on `timestamp` - Fast timestamp sorting
- **Compound index** on `(deviceId, timestamp)` - Optimized for latest reading queries

---

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
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies and scripts
└── README.md                    # This file
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": [] // Optional, for validation errors
}
```

### HTTP Status Codes

- **200 OK** - Successful GET request
- **201 Created** - Successful POST request
- **400 Bad Request** - Validation errors (missing/invalid fields)
- **404 Not Found** - Device not found
- **500 Internal Server Error** - Server/database errors

---

## Validation Rules

- **deviceId**: 
  - Required
  - Must be a non-empty string
  - Automatically trimmed

- **temperature**: 
  - Required
  - Must be a valid number (integer or float)

- **timestamp**: 
  - Optional
  - If provided, must be a valid number (epoch milliseconds)
  - If not provided, server defaults to `Date.now()`

---

## Testing

### Quick Test Sequence

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Test health check:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Ingest a reading:**
   ```bash
   curl -X POST http://localhost:3000/api/sensor/ingest \
     -H "Content-Type: application/json" \
     -d '{"deviceId": "sensor-01", "temperature": 25.5}'
   ```

4. **Get latest reading:**
   ```bash
   curl http://localhost:3000/api/sensor/sensor-01/latest
   ```

5. **Ingest multiple readings:**
   ```bash
   curl -X POST http://localhost:3000/api/sensor/ingest \
     -H "Content-Type: application/json" \
     -d '{"deviceId": "sensor-01", "temperature": 28.0}'
   
   curl -X POST http://localhost:3000/api/sensor/ingest \
     -H "Content-Type: application/json" \
     -d '{"deviceId": "sensor-01", "temperature": 30.5}'
   ```

6. **Verify latest is 30.5:**
   ```bash
   curl http://localhost:3000/api/sensor/sensor-01/latest
   ```

### Test Validation

**Missing deviceId:**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"temperature": 25.5}'
```

**Missing temperature:**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "sensor-01"}'
```

---

## Technologies Used

- **Node.js** 18+ or 20 LTS - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **express-validator** - Input validation
- **dotenv** - Environment variable management

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/iot-sensors?retryWrites=true&w=majority` |
| `PORT` | No | Server port (default: 3000) | `3000` |
| `NODE_ENV` | No | Environment | `development` |

---

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoDB connection error`

**Solutions:**
1. Verify connection string in `.env` is correct
2. Check username and password are correct
3. Ensure IP address is whitelisted in MongoDB Atlas Network Access
4. Verify cluster is fully created (may take a few minutes)
5. Check if password contains special characters that need URL encoding

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Change `PORT` in `.env` to another port (e.g., 3001)
2. Or stop the process using port 3000:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
npm install
```

---

## License

ISC

---

## Author

Created for Falcon Labs Node.js Internship Pre-Assessment Assignment
