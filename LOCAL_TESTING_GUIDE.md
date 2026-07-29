# Local Testing Guide — The Tutorment

## What you need on your computer
- Node.js (version 18 or above) — download from nodejs.org if not installed
- The tutorment-complete.zip file

## Step 1 — Unzip the file

Unzip `tutorment-complete.zip` somewhere on your computer.
You should see a folder called `tutorment-project` with `frontend/` inside it.

## Step 2 — Place the server file

Take `tutorment-local-server.js` (included in the zip) and place it in the
SAME folder where `tutorment-complete.zip` was unzipped — NOT inside
tutorment-project, but alongside it.

Your folder should look like this:
```
📁 (your unzip folder — e.g. Desktop/tutorment)
  📄 tutorment-local-server.js    ← place this here
  📄 LOCAL_TESTING_GUIDE.md
  📁 tutorment-project/           ← created when you unzip
      📁 frontend/
          📄 index.html
          📄 nav.js
          📄 shared.css
          📄 eligibility-report.js
          📁 pages/
          📁 css/
```

## Step 3 — Open Terminal / Command Prompt

Windows: press Win+R, type cmd, press Enter
Mac: press Cmd+Space, type Terminal, press Enter

Navigate to your unzip folder:
```
cd path/to/your/unzip/folder
```
Example on Windows:  cd C:\Users\Priyanshu\Desktop\tutorment
Example on Mac:      cd ~/Desktop/tutorment

## Step 4 — Install dependencies

```
npm install express @anthropic-ai/sdk
```

This takes 30-60 seconds. You only need to do this once.

## Step 5 — Start the server

WITHOUT AI features (faster, no API key needed):
```
node tutorment-local-server.js
```

WITH AI features (report and chat fully active):

Windows:
```
set ANTHROPIC_API_KEY=sk-ant-your-key-here && node tutorment-local-server.js
```

Mac/Linux:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here node tutorment-local-server.js
```

## Step 6 — Open in browser

Go to: http://localhost:3000

You should see The Tutorment homepage.

## Key URLs to test

| Page | URL |
|---|---|
| Homepage | http://localhost:3000 |
| Eligibility checker | http://localhost:3000/pages/eligibility.html |
| Salary calculator | http://localhost:3000/pages/salary-calculator.html |
| Contact form | http://localhost:3000/pages/contact.html |
| Dashboard | http://localhost:3000/pages/dashboard.html |
| Global guide | http://localhost:3000/pages/global-guide.html |
| Visa guide | http://localhost:3000/pages/visas.html |

## What to check

1. **Homepage** — nav should show International/India/Tools/About/Results all on the same line, no amber underline
2. **Eligibility page** — "Already registered? Skip and start" should be BELOW the white form card
3. **Eligibility checker** — complete all questions, click Generate. If API key is set, you get an AI-written report. If not, you get the template report (still works, just not AI-personalised)
4. **After report** — teal chat button appears bottom-right. Click it. If API key is set, type a question and get a real answer
5. **Salary calculator** — pick country + sector + role → results appear instantly with methodology note
6. **Contact form** — fill in the form and submit. You should see "Lead captured (local mock)" in the terminal, and a success message on screen
7. **Guide pages** — global-guide, visas, phd-guide, university-guide should all show the "Who this is for / What you will learn / Best next action" card BEFORE the long content

## Stopping the server

Press Ctrl+C in the terminal window.

## Troubleshooting

**"Cannot find module 'express'"**
→ Run `npm install express @anthropic-ai/sdk` again in the same folder

**"EADDRINUSE: port 3000 already in use"**
→ Something else is using port 3000. Stop it, or change PORT=3000 to PORT=3001 in the server file

**Page loads but styles are wrong**
→ Check the folder structure matches exactly what is shown in Step 2

**AI report says "Could not connect" even with API key set**
→ Check the terminal — the server prints errors. Most likely the key is wrong or the API is temporarily down.

**Nav doesn't appear**
→ Open browser console (F12), look for JS errors. Usually means nav.js path is wrong.
