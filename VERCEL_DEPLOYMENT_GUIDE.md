# Deploying MERN Restaurant Reservation System to Vercel (FREE)

## 📋 Prerequisites
- GitHub account (free)
- Vercel account (free)
- Your project pushed to GitHub
- MongoDB Atlas account (free tier)

---

## ✅ STEP 1: Prepare MongoDB Atlas (Cloud Database)

Your current MongoDB URI works locally, but won't work on Vercel. You need MongoDB Atlas (free cloud database).

### 1.1 Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Sign up with GitHub or email
4. Create organization and project (follow defaults)

### 1.2 Create a Cluster
1. Click "Create Database"
2. Select **M0 (Free tier)** - Always free
3. Select cloud provider and region (any works, closer is faster)
4. Click "Create Cluster"
5. Wait 2-3 minutes for it to initialize

### 1.3 Create Database User
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Create username: `admin` (or anything)
4. Create password: Use auto-generated password (copy it!)
5. Click "Add User"

### 1.4 Get Connection String
1. Go to "Deployment" → "Database"
2. Click "Connect" on your cluster
3. Select "Drivers"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `<dbname>` with `RESERVATIONS`

**Format should look like:**
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/RESERVATIONS?retryWrites=true&w=majority
```

---

## 📦 STEP 2: Prepare Backend for Vercel

### 2.1 Create Vercel Configuration

Create file: `backend/vercel.json`
```json
{
  "version": 2,
  "builds": [{ "src": "app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/" }]
}
```

### 2.2 Update Backend Code for Vercel

Edit: `backend/app.js`

```javascript
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import { dbConnection } from "./database/dbConnection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:4000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/reservation", reservationRouter);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Backend is running on Vercel!"
  });
});

// Database connection
dbConnection();

// Error handling
app.use(errorMiddleware);

export default app;
```

### 2.3 Create Backend .env File (For Vercel)

Create: `backend/.env`
```env
PORT=4000
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/RESERVATIONS?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-url.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RESTAURANT_EMAIL=restaurant-email@gmail.com
```

### 2.4 Update package.json (Backend)

Ensure `backend/package.json` has:
```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^8.0.2",
    "nodemailer": "^6.9.7",
    "validator": "^13.11.0"
  }
}
```

---

## 🎨 STEP 3: Prepare Frontend for Vercel

### 3.1 Update API Base URL

Edit: `frontend/src/components/Reservation.jsx`

Change the API URL to use environment variable:
```javascript
// Instead of hardcoding localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const handleReservation = async (e) => {
  // ... validation code ...
  
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/reservation/send`,
      { firstName, lastName, email, phone, date, time },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    // ... rest of code ...
  }
};
```

### 3.2 Create Frontend .env File

Create: `frontend/.env.local` (for local development)
```
VITE_API_URL=http://localhost:4000
```

Create: `frontend/.env.production` (for production)
```
VITE_API_URL=https://your-backend-url.vercel.app
```

### 3.3 Verify frontend/package.json

```json
{
  "name": "restro-book",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.12.0",
    "react-router-dom": "^6.21.0",
    "react-scroll": "^1.9.0"
  }
}
```

---

## 🚀 STEP 4: Deploy Backend to Vercel

### 4.1 Push Changes to GitHub
```bash
cd backend
git add .
git commit -m "Prepare backend for Vercel deployment"
git push origin main
```

### 4.2 Deploy Backend
1. Go to: https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repo
5. **Important:** 
   - Set "Root Directory" to `backend`
   - Click "Continue"
6. Go to "Environment Variables"
7. Add all variables from backend/.env:
   - `MONGO_URI`
   - `FRONTEND_URL` (will update after frontend is deployed)
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `RESTAURANT_EMAIL`
8. Click "Deploy"

### 4.3 Get Backend URL
After deployment, you'll get a URL like:
```
https://your-backend-name.vercel.app
```

Copy this URL! You'll need it for the frontend.

---

## 🎨 STEP 5: Deploy Frontend to Vercel

### 5.1 Update Frontend API URL

Edit: `frontend/.env.production`
```
VITE_API_URL=https://your-backend-name.vercel.app
```

### 5.2 Push Changes
```bash
cd frontend
git add .
git commit -m "Update API URL for production"
git push origin main
```

### 5.3 Deploy Frontend
1. Go to: https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. **Important:**
   - Set "Root Directory" to `frontend`
   - Click "Continue"
5. Go to "Environment Variables"
6. Add:
   - `VITE_API_URL` = `https://your-backend-name.vercel.app`
7. Click "Deploy"

### 5.4 Get Frontend URL
You'll get a URL like:
```
https://your-frontend-name.vercel.app
```

---

## 🔄 STEP 6: Update Backend with Frontend URL

Go back to your backend Vercel project:
1. Settings → Environment Variables
2. Update `FRONTEND_URL` to your frontend URL
3. Redeploy backend (click "Redeploy")

---

## ✅ STEP 7: Test Deployment

### 7.1 Test Backend
Open in browser:
```
https://your-backend-name.vercel.app
```
You should see:
```json
{
  "success": true,
  "message": "Backend is running on Vercel!"
}
```

### 7.2 Test Frontend
Open in browser:
```
https://your-frontend-name.vercel.app
```
You should see your restaurant site loaded!

### 7.3 Test Reservation Form
1. Fill in the reservation form
2. Click "RESERVE NOW"
3. You should see success message
4. Check your email for confirmation

---

## 🔧 Troubleshooting

### Issue: "Cannot find module"
**Solution:** Make sure `.env` file is in the root of backend folder

### Issue: "CORS error"
**Solution:** 
- Check `FRONTEND_URL` in backend `.env`
- Make sure frontend URL is in CORS origin array
- Redeploy backend after updating

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Verify MongoDB Atlas connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas:
  - Go to MongoDB Atlas → Security → Network Access
  - Click "Add IP Address"
  - Select "Allow Access from Anywhere" (0.0.0.0/0)
  - Click Confirm

### Issue: "Email not sending"
**Solution:**
- Use Google App Password (not regular Gmail password)
- Generate here: https://myaccount.google.com/apppasswords
- Make sure 2FA is enabled on Google account

### Issue: 404 on backend routes
**Solution:**
- Make sure `vercel.json` is in backend folder
- Check route path matches frontend API call

---

## 📊 Final URLs

After deployment, you'll have:
- **Frontend:** https://your-app-name-frontend.vercel.app
- **Backend:** https://your-app-name-backend.vercel.app
- **Database:** MongoDB Atlas (free cloud)
- **Emails:** Gmail SMTP

Everything is FREE! 🎉

---

## 💾 Keeping Code Synced

After deployment, when you make changes:

1. Make changes locally
2. Test on `localhost:5173` (frontend) and `localhost:4000` (backend)
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
4. Vercel auto-redeploys when you push to GitHub!

---

## 🔐 Security Notes

1. **Never commit .env files!** Already in `.gitignore`
2. **Add environment variables in Vercel dashboard**, not in code
3. **Use App Passwords** for Gmail, not your actual password
4. **Whitelist MongoDB access** to prevent unauthorized access
5. **Keep API keys secure** - never share publicly

---

## 📞 Support Links

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.mongodb.com/atlas/
- **Express Deployment:** https://expressjs.com/en/advanced/best-practice-performance.html
- **React Deployment:** https://vitejs.dev/guide/build.html

You're ready to deploy! 🚀
