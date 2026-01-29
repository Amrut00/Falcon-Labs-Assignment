# IoT Sensor API Test Script
# Make sure your server is running on port 3000 before running this script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IoT Sensor API Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET http://localhost:3000/health" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Ingest Sensor Reading (with timestamp)
Write-Host "Test 2: Ingest Sensor Reading (with timestamp)" -ForegroundColor Yellow
Write-Host "POST http://localhost:3000/api/sensor/ingest" -ForegroundColor Gray
$body1 = @{
    deviceId = "sensor-01"
    temperature = 32.1
    timestamp = 1705312440000
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/sensor/ingest" -Method POST -Body $body1 -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

Start-Sleep -Seconds 1

# Test 3: Ingest Sensor Reading (without timestamp - auto-generated)
Write-Host "Test 3: Ingest Sensor Reading (without timestamp)" -ForegroundColor Yellow
Write-Host "POST http://localhost:3000/api/sensor/ingest" -ForegroundColor Gray
$body2 = @{
    deviceId = "sensor-01"
    temperature = 25.5
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/sensor/ingest" -Method POST -Body $body2 -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

Start-Sleep -Seconds 1

# Test 4: Ingest another reading for a different device
Write-Host "Test 4: Ingest Reading for sensor-02" -ForegroundColor Yellow
Write-Host "POST http://localhost:3000/api/sensor/ingest" -ForegroundColor Gray
$body3 = @{
    deviceId = "sensor-02"
    temperature = 30.2
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/sensor/ingest" -Method POST -Body $body3 -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

Start-Sleep -Seconds 1

# Test 5: Get Latest Reading for sensor-01
Write-Host "Test 5: Get Latest Reading for sensor-01" -ForegroundColor Yellow
Write-Host "GET http://localhost:3000/api/sensor/sensor-01/latest" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/sensor/sensor-01/latest" -Method GET -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 6: Get Latest Reading for sensor-02
Write-Host "Test 6: Get Latest Reading for sensor-02" -ForegroundColor Yellow
Write-Host "GET http://localhost:3000/api/sensor/sensor-02/latest" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/sensor/sensor-02/latest" -Method GET -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 7: Validation Error Test (missing deviceId)
Write-Host "Test 7: Validation Error Test (missing deviceId)" -ForegroundColor Yellow
Write-Host "POST http://localhost:3000/api/sensor/ingest" -ForegroundColor Gray
$bodyInvalid = @{
    temperature = 25.5
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/sensor/ingest" -Method POST -Body $bodyInvalid -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response:" -ForegroundColor Yellow
    $responseBody | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
}

# Test 8: 404 Error Test (non-existent device)
Write-Host "Test 8: 404 Error Test (non-existent device)" -ForegroundColor Yellow
Write-Host "GET http://localhost:3000/api/sensor/non-existent/latest" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/sensor/non-existent/latest" -Method GET -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response:" -ForegroundColor Yellow
    $responseBody | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
