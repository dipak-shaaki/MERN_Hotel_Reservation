# 🚀 Quick Deployment Checklist for Vercel

## Pre-Deployment ✅
- [x] Code pushed to GitHub (`main` branch)
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster deployed
- [ ] Database user created with password
- [ ] Connection string copied
- [ ] Gmail App Password generated (if using email)
- [ ] IP whitelisted in MongoDB Atlas (0.0.0.0/0)

---

## 1️⃣ BACKEND DEPLOYMENT

### Prepare Backend
- [x] Backend code is Vercel-ready
- [x] `vercel.json` exists in backend folder
- [x] `app.js` updated with flexible CORS

### Create `.env` File in Backend
```
PORT=4000
MONGO_URI=mongodb+srv://admin:PASSWORD@cluster0.abc.mongodb.net/RESERVATIONS?retryWrites=true&w=majority
FRONTEND_URL=https://will-update-after-frontend-deployed.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RESTAURANT_EMAIL=restaurant@gmail.com
```

### Deploy to Vercel
1. Go to https://vercel.com (sign up with GitHub)
2. Click "New Project"
3. Import your GitHub repository
4. **Set Root Directory:** `backend`
5. **Add Environment Variables:** Copy from backend/.env
6. Click "Deploy"
7. **Copy Backend URL** (example: `https://my-restaurant-api.vercel.app`)

---

## 2️⃣ FRONTEND DEPLOYMENT

### Update Frontend Files
- [x] Reservation.jsx updated to use `VITE_API_URL`
- [x] `.env.local` created (for local testing)
- [x] `.env.production` created (needs backend URL)

### Update .env.production
Replace `https://your-backend-name.vercel.app` with your actual backend Vercel URL:
```
VITE_API_URL=https://my-restaurant-api.vercel.app
```

### Push Changes to GitHub
```bash
cd c:\Users\Dipak\Desktop\resturant
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository again
4. **Set Root Directory:** `frontend`
5. **Add Environment Variables:**
   - `VITE_API_URL=https://my-restaurant-api.vercel.app`
6. Click "Deploy"
7. **Copy Frontend URL** (example: `https://my-restaurant.vercel.app`)

---

## 3️⃣ UPDATE BACKEND WITH FRONTEND URL

Go back to backend Vercel project:
1. Click "Settings"
2. Click "Environment Variables"
3. Update `FRONTEND_URL` to your frontend Vercel URL
4. Click "Save"
5. Click "Deployments" → "Redeploy"

---

## ✅ VERIFICATION

### Test Backend
```
https://my-restaurant-api.vercel.app/
```
You should see:
```json
{"success": true, "message": "Backend is running on Vercel!"}
```

### Test Frontend
```
https://my-restaurant.vercel.app/
```
Should load your website! ✨

### Test Reservation Form
1. Fill in reservation form
2. Click "RESERVE NOW"
3. Check email for confirmation
4. Should redirect to `/success` page

---

## 🆘 QUICK TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| CORS Error | Check `FRONTEND_URL` in backend env vars |
| Cannot connect MongoDB | Whitelist IP in MongoDB Atlas (0.0.0.0/0) |
| API 404 | Check route path in frontend matches backend |
| Email not sending | Use Gmail App Password, not regular password |
| Frontend shows blank | Check `VITE_API_URL` is set correctly |
| "Module not found" | Make sure `.env` file exists in backend folder |

---

## 📱 Final URLs

After successful deployment:
- **Frontend:** https://my-restaurant.vercel.app
- **Backend API:** https://my-restaurant-api.vercel.app
- **Database:** MongoDB Atlas (free cloud)

Your app is now LIVE on the internet! 🎉

---

## 💡 Pro Tips

1. **Auto-deployment:** Every time you `git push`, Vercel automatically redeploys
2. **View Logs:** Click "Deployments" in Vercel dashboard to see deployment logs
3. **Custom Domain:** You can add your own domain in Vercel Settings
4. **Preview URLs:** Before going live, Vercel creates preview URLs for each commit

---

**Need Help?** Check the full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
