# Setup Guide - Step by Step Instructions

## ✅ Pre-requisites Check

- ✅ Node.js v20.12.0 installed (meets requirement: 18+ or 20 LTS)
- ✅ Project structure created
- ✅ All code files in place

## 📋 Step-by-Step Setup Instructions

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

**Expected output:** All packages from `package.json` will be installed in `node_modules/`

**What this installs:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables
- `express-validator` - Input validation
- `mqtt` - MQTT client (bonus feature)
- `nodemon` - Development auto-reload (dev dependency)

---

### Step 2: Set Up MongoDB Atlas

#### 2.1 Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (or log in if you have one)
3. Choose the **FREE** tier (M0)

#### 2.2 Create a Cluster
1. Click **"Create"** or **"Build a Database"**
2. Choose **"M0 Free"** tier
3. Select a cloud provider and region (choose closest to you)
4. Give your cluster a name (e.g., "iot-sensors-cluster")
5. Click **"Create"** (takes 3-5 minutes)

#### 2.3 Create Database User
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `iotuser`)
5. Enter a strong password (⚠️ **SAVE THIS PASSWORD**)
6. Under "Database User Privileges", select **"Atlas admin"** or **"Read and write to any database"**
7. Click **"Add User"**

#### 2.4 Configure Network Access
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - ⚠️ For production, use specific IPs only
4. Click **"Confirm"**

#### 2.5 Get Connection String
1. Go back to **"Database"** (or "Clusters")
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Replace `<username>` with your database username
7. Replace `<password>` with your database password
8. Add database name at the end: `...mongodb.net/iot-sensors?retryWrites=true&w=majority`

**Final connection string format:**
```
mongodb+srv://iotuser:YourPassword123@cluster0.xxxxx.mongodb.net/iot-sensors?retryWrites=true&w=majority
```

---

### Step 3: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   copy .env.example .env
   ```
   (On Windows PowerShell, use: `Copy-Item .env.example .env`)

2. **Open `.env` file** in your editor

3. **Update the MongoDB URI:**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/iot-sensors?retryWrites=true&w=majority
   ```

4. **Set port (optional, defaults to 3000):**
   ```env
   PORT=3000
   NODE_ENV=development
   ```

5. **MQTT Configuration (Optional - for bonus feature):**
   ```env
   MQTT_BROKER_URL=mqtt://broker.example.com:1883
   MQTT_USERNAME=your_mqtt_username
   MQTT_PASSWORD=your_mqtt_password
   ```
   - Leave these commented out if you don't have an MQTT broker
   - The app will work fine without MQTT (it's a bonus feature)

---

### Step 4: Start the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

**Expected output:**
```
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net:27017
Server is running on port 3000
Environment: development
Health check: http://localhost:3000/health
MQTT service skipped - MQTT_BROKER_URL not configured
```

**If you see errors:**
- **MongoDB connection error:** Check your connection string in `.env`
- **Port already in use:** Change `PORT` in `.env` to another port (e.g., 3001)

---

### Step 5: Test the API

#### 5.1 Test Health Check Endpoint

**Using cURL:**
```bash
curl http://localhost:3000/health
```

**Using PowerShell (Invoke-WebRequest):**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health | Select-Object -ExpandProperty Content
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-29T10:30:00.000Z"
}
```

#### 5.2 Test POST /api/sensor/ingest

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d "{\"deviceId\": \"sensor-01\", \"temperature\": 32.1, \"timestamp\": 1705312440000}"
```

**Using PowerShell:**
```powershell
$body = @{
    deviceId = "sensor-01"
    temperature = 32.1
    timestamp = 1705312440000
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/sensor/ingest -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

**Expected response (201):**
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

**Test without timestamp (auto-generated):**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d "{\"deviceId\": \"sensor-01\", \"temperature\": 25.5}"
```

#### 5.3 Test GET /api/sensor/:deviceId/latest

**Using cURL:**
```bash
curl http://localhost:3000/api/sensor/sensor-01/latest
```

**Using PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/sensor/sensor-01/latest | Select-Object -ExpandProperty Content
```

**Expected response (200):**
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

#### 5.4 Test Validation Errors

**Missing deviceId:**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d "{\"temperature\": 25.5}"
```

**Expected response (400):**
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

**Invalid temperature:**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d "{\"deviceId\": \"sensor-01\", \"temperature\": \"invalid\"}"
```

#### 5.5 Test 404 Error

**Device not found:**
```bash
curl http://localhost:3000/api/sensor/non-existent-device/latest
```

**Expected response (404):**
```json
{
  "success": false,
  "error": "Not found",
  "message": "No readings found for device: non-existent-device"
}
```

---

### Step 6: Using Postman (Alternative Testing)

1. **Download Postman** from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Create a new Collection:** "IoT Sensor API"

3. **Add requests:**

   **Request 1: Health Check**
   - Method: `GET`
   - URL: `http://localhost:3000/health`
   - Click "Send"

   **Request 2: Ingest Reading**
   - Method: `POST`
   - URL: `http://localhost:3000/api/sensor/ingest`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "deviceId": "sensor-01",
       "temperature": 32.1,
       "timestamp": 1705312440000
     }
     ```
   - Click "Send"

   **Request 3: Get Latest Reading**
   - Method: `GET`
   - URL: `http://localhost:3000/api/sensor/sensor-01/latest`
   - Click "Send"

---

### Step 7: Verify MongoDB Data

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. You should see:
   - Database: `iot-sensors`
   - Collection: `sensorreadings`
   - Documents with your ingested data

**Document structure:**
```json
{
  "_id": ObjectId("..."),
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000,
  "createdAt": ISODate("2024-01-29T10:30:00.000Z")
}
```

---

### Step 8: Test Multiple Devices

Ingest readings for multiple devices:

```bash
# Device 1
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d "{\"deviceId\": \"sensor-01\", \"temperature\": 25.5}"

# Device 2
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d "{\"deviceId\": \"sensor-02\", \"temperature\": 30.2}"

# Device 3
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d "{\"deviceId\": \"sensor-03\", \"temperature\": 28.7}"

# Get latest for each
curl http://localhost:3000/api/sensor/sensor-01/latest
curl http://localhost:3000/api/sensor/sensor-02/latest
curl http://localhost:3000/api/sensor/sensor-03/latest
```

---

## 🎯 Checklist Before Submission

- [ ] All dependencies installed (`npm install` completed)
- [ ] MongoDB Atlas cluster created and accessible
- [ ] `.env` file configured with correct MongoDB URI
- [ ] Server starts without errors (`npm run dev` or `npm start`)
- [ ] Health check endpoint works (`GET /health`)
- [ ] POST `/api/sensor/ingest` works with valid data
- [ ] POST `/api/sensor/ingest` validates required fields
- [ ] POST `/api/sensor/ingest` handles missing timestamp (auto-generates)
- [ ] GET `/api/sensor/:deviceId/latest` returns latest reading
- [ ] GET `/api/sensor/:deviceId/latest` returns 404 for non-existent device
- [ ] Data persists in MongoDB Atlas
- [ ] README.md is complete with examples
- [ ] Code is committed to GitHub repository

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Error:** `MongoDB connection error: ...`

**Solutions:**
1. Verify connection string in `.env` is correct
2. Check username and password are correct (no special characters need URL encoding)
3. Ensure IP address is whitelisted in MongoDB Atlas Network Access
4. Check if cluster is fully created (may take a few minutes)

### Issue: Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Change `PORT=3001` in `.env`
2. Or stop the process using port 3000:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Issue: Module Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
npm install
```

### Issue: Validation Not Working
**Check:**
- Ensure `express-validator` is installed
- Check middleware is applied in routes
- Verify request has `Content-Type: application/json` header

---

## 📝 Next Steps After Setup

1. **Test all endpoints** using the examples above
2. **Verify data in MongoDB Atlas** dashboard
3. **Review README.md** - ensure it's complete
4. **Commit to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: IoT Sensor Backend API"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
5. **Test MQTT feature** (if you have an MQTT broker) - see README.md

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Server starts without errors
- ✅ MongoDB connection successful
- ✅ Health check returns 200 OK
- ✅ POST request creates a document in MongoDB
- ✅ GET request retrieves the latest reading
- ✅ Validation errors return proper 400 responses
- ✅ 404 errors return proper responses for non-existent devices

---

**Need help?** Check the main `README.md` for more details and examples.
