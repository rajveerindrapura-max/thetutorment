# The Tutorment — Backend Setup Guide

## What this backend does
- Saves leads from the contact form and homepage CTA to MongoDB
- Sends you an email notification every time a new lead comes in
- Handles user registration and login (Sign in modal)
- Validates session tokens for the dashboard
- Admin routes to view leads and user stats

## Step 1: MongoDB Atlas (database)

1. Go to mongodb.com/atlas → Create free account
2. Create a free M0 cluster (any region)
3. Database Access → Add Database User
   - Username: tutorment
   - Password: generate a strong one, save it
   - Role: Read and write to any database
4. Network Access → Add IP Address → Allow access from anywhere (0.0.0.0/0)
5. Databases → Connect → Drivers → copy the connection string
   It looks like: mongodb+srv://tutorment:PASSWORD@cluster0.xxxxx.mongodb.net/

## Step 2: GitHub (needed for Render deployment)

1. Create a GitHub account if you don't have one
2. Create a new repository called `tutorment-backend` (private)
3. Upload all the files from this folder to the repository

From your computer with Git installed:
```
cd path/to/tutorment-backend
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/YOUR_USERNAME/tutorment-backend.git
git push -u origin main
```

## Step 3: Render (hosting)

1. Go to render.com → Sign up with GitHub
2. New → Web Service → connect your `tutorment-backend` repo
3. Settings:
   - Name: tutorment-backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
   - Instance Type: Free
4. Environment Variables — add these one by one:

| Key | Value |
|-----|-------|
| MONGODB_URI | Your Atlas connection string (include /tutorment at end) |
| JWT_SECRET | Any long random string — e.g. paste output of: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" |
| EMAIL_USER | your Gmail address |
| EMAIL_PASS | Gmail App Password (see below) |
| NOTIFY_EMAIL | support@thetutorment.com |
| FRONTEND_URL | https://thetutorment.com |
| NODE_ENV | production |

5. Click Create Web Service — Render deploys automatically

Your backend URL will be: https://tutorment-backend.onrender.com

## Step 4: Gmail App Password (for email notifications)

1. Go to myaccount.google.com → Security
2. Enable 2-Step Verification
3. Search "App passwords" → Create one for Mail
4. Copy the 16-char password → use as EMAIL_PASS in Render

## Step 5: Verify it works

Open in browser: https://tutorment-backend.onrender.com/api
You should see: {"status":"ok","service":"The Tutorment API","version":"1.0.0"}

## Step 6: Update frontend (already done)

The frontend already points to https://tutorment-backend.onrender.com/api
No frontend changes needed.

## Step 7: Upload frontend to Hostinger

1. Log in to Hostinger hPanel
2. File Manager → public_html
3. Upload ALL files from tutorment-project/frontend/ → replacing existing files
4. Upload all files from tutorment-project/frontend/pages/ → into public_html/pages/
5. Upload css/ folder → into public_html/css/
6. Hard refresh (Ctrl+Shift+R) to clear cache

## Create your admin account

After the backend is live, open browser console on your site and run:
```javascript
fetch('https://tutorment-backend.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({
    firstName: 'Priyanshu',
    lastName: 'Goyal',
    email: 'priyanshu@thetutorment.com',
    password: 'YOUR_STRONG_PASSWORD'
  })
}).then(r=>r.json()).then(console.log)
```

Then in MongoDB Atlas, manually set your user's role from "user" to "admin":
- Atlas → Browse Collections → tutorment → users
- Find your record → Edit → change role: "user" to "admin" → Update

## Troubleshooting

**Backend shows "Application error" on Render**
→ Check Render logs (your service → Logs tab). Most common: wrong MONGODB_URI format.

**Leads not saving**
→ Check that MONGODB_URI includes the database name: .../tutorment?retryWrites...

**Email notifications not arriving**
→ Check EMAIL_PASS is the App Password (16 chars, no spaces), not your Gmail password.
→ Check spam folder.

**CORS error in browser**
→ Make sure FRONTEND_URL matches exactly: https://thetutorment.com (no trailing slash).
