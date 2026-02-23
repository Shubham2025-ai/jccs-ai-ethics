# JCCS — Free Deployment Guide
## Frontend → Vercel | Backend → Render | DB → SQLite (built-in)

---

## STEP 1 — Push to GitHub (Required for both platforms)

```bash
# In the jccs/ root folder:
git init
git add .
git commit -m "Initial JCCS commit"

# Create a repo on github.com then:
git remote add origin https://github.com/YOUR_USERNAME/jccs.git
git push -u origin main
```

---

## STEP 2 — Deploy Backend on Render (Free)

1. Go to **render.com** → Sign up free
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub → select **jccs** repo
4. Fill in settings:
   - **Name:** jccs-backend
   - **Root Directory:** backend
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   ```
   USE_SQLITE    = true
   GROQ_API_KEY  = gsk_your_actual_key
   DEBUG         = false
   FRONTEND_URL  = https://jccs.vercel.app  (add after step 3)
   ```
6. Click **"Create Web Service"**
7. Wait 3-5 minutes for build
8. Copy your URL: `https://jccs-backend.onrender.com`

---

## STEP 3 — Deploy Frontend on Vercel (Free)

1. Go to **vercel.com** → Sign up with GitHub
2. Click **"New Project"** → Import your **jccs** repo
3. Fill in settings:
   - **Root Directory:** frontend
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
4. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://jccs-backend.onrender.com
   ```
5. Click **"Deploy"**
6. Your app is live at: `https://jccs.vercel.app`

---

## STEP 4 — Final Config

Go back to **Render** → your backend service → **Environment** → update:
```
FRONTEND_URL = https://jccs.vercel.app
```
Click **"Save Changes"** → Render auto-redeploys.

---

## ✅ Test Your Live App

1. Open `https://jccs.vercel.app`
2. Upload your test CSV
3. See results!

---

## ⚠️ Important Notes

| Issue | Solution |
|-------|----------|
| Render backend sleeps after 15min inactivity | Free tier limitation — first request takes ~30s to wake up. Tell judges "it's waking up" |
| SQLite resets on Render redeploy | Data is temporary — fine for demo |
| CORS error | Make sure FRONTEND_URL in Render matches your exact Vercel URL |
| Build fails on Render | Check logs — usually a missing package. Add it to requirements.txt |

---

## Local vs Production Summary

| Setting | Local Dev | Production |
|---------|-----------|------------|
| Database | MySQL | SQLite (auto) |
| USE_SQLITE | false | true |
| API URL | localhost:8000 | Render URL |
| Frontend | localhost:3000 | Vercel URL |
