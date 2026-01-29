# Submission Guide - GitHub Repository Setup

This guide will help you submit your assignment to GitHub.

## ✅ Pre-Submission Checklist

- [x] All code files implemented
- [x] README.md with setup and curl/Postman examples
- [x] MongoDB Atlas free-tier configured
- [x] Node.js 20.12.0 (meets requirement: 18+ or 20 LTS)
- [x] All tests passing
- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] Repository link ready for submission

---

## Step 1: Initialize Git Repository

### 1.1 Check if Git is installed
```powershell
git --version
```

If not installed, download from: https://git-scm.com/downloads

### 1.2 Initialize Git in your project
```powershell
git init
```

### 1.3 Configure Git (if not already done)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 2: Create .gitignore (Already Done ✅)

The `.gitignore` file is already created and includes:
- `node_modules/`
- `.env` (important - don't commit your MongoDB credentials!)
- Log files
- IDE files

---

## Step 3: Stage and Commit Files

### 3.1 Stage all files
```powershell
git add .
```

### 3.2 Verify what will be committed
```powershell
git status
```

**Important:** Make sure `.env` is NOT listed (it should be ignored).

### 3.3 Create initial commit
```powershell
git commit -m "Initial commit: IoT Sensor Backend API

- Implemented POST /api/sensor/ingest endpoint
- Implemented GET /api/sensor/:deviceId/latest endpoint
- MongoDB Atlas integration with Mongoose
- Input validation for deviceId and temperature
- Automatic timestamp handling
- MQTT subscriber for bonus feature
- Comprehensive error handling
- Complete README with setup and examples"
```

---

## Step 4: Create GitHub Repository

### 4.1 Go to GitHub
1. Visit [https://github.com](https://github.com)
2. Sign in (or create account if needed)

### 4.2 Create New Repository
1. Click the **"+"** icon in the top right
2. Select **"New repository"**
3. Fill in the details:
   - **Repository name:** `iot-sensor-backend` (or your preferred name)
   - **Description:** `Node.js backend service for ingesting IoT sensor temperature readings`
   - **Visibility:** Choose **Public** (or Private if you prefer)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### 4.3 Copy Repository URL
After creating, GitHub will show you the repository URL. It looks like:
```
https://github.com/your-username/iot-sensor-backend.git
```

---

## Step 5: Push Code to GitHub

### 5.1 Add Remote Repository
```powershell
git remote add origin https://github.com/your-username/iot-sensor-backend.git
```

**Replace `your-username` and `iot-sensor-backend` with your actual GitHub username and repository name.**

### 5.2 Rename Branch to Main (if needed)
```powershell
git branch -M main
```

### 5.3 Push Code
```powershell
git push -u origin main
```

You may be prompted for GitHub credentials:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your GitHub password)

### 5.4 Create Personal Access Token (if needed)
If prompted for password:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "IoT Sensor Backend"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token and use it as your password when pushing

---

## Step 6: Verify Repository

1. Go to your GitHub repository page
2. Verify all files are present:
   - ✅ `src/` directory with all code files
   - ✅ `package.json`
   - ✅ `README.md`
   - ✅ `.env.example`
   - ✅ `.gitignore`
   - ❌ `.env` should NOT be visible (it's ignored)

---

## Step 7: Final Submission Checklist

Before submitting, verify:

- [ ] **Repository is Public** (or share access if private)
- [ ] **README.md is complete** with:
  - [x] Setup instructions
  - [x] cURL examples
  - [x] Postman examples
  - [x] MongoDB Atlas setup guide
- [ ] **All code files are present**
- [ ] **`.env` file is NOT committed** (security)
- [ ] **`.env.example` is present** (shows required variables)
- [ ] **Repository link works** and is accessible

---

## Step 8: Prepare Submission

### Your Submission Should Include:

1. **GitHub Repository Link:**
   ```
   https://github.com/your-username/iot-sensor-backend
   ```

2. **Brief Description:**
   ```
   Node.js backend service for ingesting IoT sensor temperature readings.
   Features:
   - POST /api/sensor/ingest - Ingest sensor readings
   - GET /api/sensor/:deviceId/latest - Get latest reading
   - MongoDB Atlas integration
   - Input validation
   - MQTT subscriber (bonus feature)
   ```

3. **Key Points to Mention:**
   - ✅ Uses MongoDB Atlas free-tier
   - ✅ Node.js 20 LTS
   - ✅ Complete README with setup and examples
   - ✅ Bonus MQTT feature implemented
   - ✅ All tests passing

---

## Troubleshooting

### Issue: "fatal: not a git repository"
**Solution:** Run `git init` first

### Issue: "Permission denied" when pushing
**Solution:** 
- Check your GitHub credentials
- Use Personal Access Token instead of password
- Verify repository URL is correct

### Issue: ".env file is visible in GitHub"
**Solution:**
- Remove it: `git rm --cached .env`
- Commit: `git commit -m "Remove .env file"`
- Push: `git push`

### Issue: "Repository not found"
**Solution:**
- Verify repository name and username
- Check if repository is private and you have access
- Verify remote URL: `git remote -v`

---

## Quick Command Reference

```powershell
# Initialize
git init
git add .
git commit -m "Initial commit: IoT Sensor Backend API"

# Connect to GitHub
git remote add origin https://github.com/your-username/repo-name.git
git branch -M main
git push -u origin main

# Verify
git status
git remote -v
```

---

## Next Steps After Submission

1. **Share Repository Link** with your assignment submission
2. **Include README link** in your submission
3. **Mention Bonus Feature** (MQTT subscriber) if applicable
4. **Be ready to demonstrate** if asked:
   - How to set up the project
   - How to test the endpoints
   - MongoDB Atlas connection

---

**Good luck with your submission! 🚀**
