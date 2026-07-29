# 🎓 The Tutorment — Standalone Web Application & Backend

Welcome to **The Tutorment** codebase. This repository contains the complete frontend website and Express Node.js backend API. It is 100% standalone and can be run locally or deployed to production on any **Windows** or **macOS** system.

---

## 📁 Repository Structure

```text
tutorment-project/
├── frontend/             # Complete HTML5/CSS3/JavaScript Frontend Application
│   ├── index.html        # Main landing page
│   ├── shared.css        # Core styling tokens & design system
│   ├── nav.v3.js         # Dynamic navigation header controller
│   ├── footer.v3.js      # Dynamic footer controller
│   ├── eligibility-report.js # AI report engine & interactive form logic
│   └── pages/            # All inner pages (international.html, dashboard.html, etc.)
│
├── backend/              # Node.js + Express REST API
│   ├── server.js         # Express server, MongoDB models, Auth & AI proxy routes
│   ├── package.json      # Node.js dependencies
│   └── .env.example      # Environment variable template
│
├── package.json          # Root helper scripts
├── .env.example          # Root environment variable template
└── README.md             # Setup guide and instructions
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have Node.js (version 18 or higher) installed on your system:
- **Download Node.js**: [https://nodejs.org](https://nodejs.org)

---

### Step 1: Extract the ZIP
Unzip `tutorment-project.zip` to any folder on your computer.

---

### Step 2: Install Backend Dependencies

#### On Windows (Command Prompt or PowerShell):
```cmd
cd backend
npm install
```

#### On Mac (Terminal):
```bash
cd backend
npm install
```

---

### Step 3: Configure Environment Variables (Optional but Recommended)

1. Inside the `backend` folder, create a file named `.env` by copying `.env.example`.
   - **Windows**: `copy .env.example .env`
   - **Mac**: `cp .env.example .env`
2. Open `.env` in any text editor and fill in your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/tutorment
   JWT_SECRET=your_secret_key_here
   ANTHROPIC_API_KEY=sk-ant-xxx (Optional: Required for AI generation features)
   ```

*(Note: If no `.env` file is provided, the backend will run on port `5000` with local fallback settings).*

---

### Step 4: Start the Backend Server

#### Windows & Mac:
```bash
cd backend
npm start
```
You will see:
```text
 ┌────────────────────────────────────────────┐
 │  The Tutorment — Backend API v2             │
 │  http://localhost:5000/api                 │
 └────────────────────────────────────────────┘
```

---

### Step 5: Run & View the Frontend

You have two easy ways to open the frontend:

#### Option A (Instant — Double Click):
Navigate into the `frontend/` folder and double-click `index.html` to open it directly in any browser (Chrome, Edge, Safari, Firefox).

#### Option B (Local Web Server — Recommended):
Run from the root directory:
```bash
npx serve frontend -p 3000
```
Then open `http://localhost:3000` in your browser.

---

## 🌐 Production Deployment

- **Frontend**: Can be hosted on Vercel, Netlify, Cloudflare Pages, or traditional cPanel Apache/Nginx web hosting (includes `.htaccess` configuration).
- **Backend**: Can be hosted on Render, Railway, AWS, DigitalOcean, or Heroku.

---

## 🛠️ Verification & Tests

To verify that the setup is completely functional:
1. Open `http://localhost:3000` (or `frontend/index.html`).
2. Test lead submission / contact form (submits to `http://localhost:5000/api/leads`).
3. Test user register / sign in modal (connects to `http://localhost:5000/api/auth/register`).
4. Test country navigation reset on `pages/international.html`.

---

© 2026 The Tutorment. All rights reserved.
