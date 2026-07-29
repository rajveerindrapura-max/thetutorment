# Enabling AI Features on The Tutorment Backend (Render)

## What this unlocks
- AI-generated career reports (Option A): Claude writes a personalised 6-section report for each user
- Report chat (Option B): users can ask follow-up questions about their specific report

## Step 1: Add the Anthropic SDK to your Render backend

In your Render backend project directory, run:
```
npm install @anthropic-ai/sdk
```
Then commit and push.

## Step 2: Add your API key to Render environment variables

1. Go to render.com → your tutorment-backend service
2. Click **Environment** in the left sidebar
3. Click **Add Environment Variable**
4. Key: `ANTHROPIC_API_KEY`
5. Value: your API key starting with `sk-ant-`
6. Click Save — Render will redeploy automatically

Get your API key at: console.anthropic.com → API Keys

## Step 3: Add the two routes to your server.js

Open your `server.js` file and add the contents of `ai-routes.js` (included in this zip):
- Paste AFTER your existing route definitions
- Paste BEFORE your `app.listen(...)` call

It should look like:
```javascript
// ... your existing routes ...

// AI ROUTES — paste here
const Anthropic = require('@anthropic-ai/sdk');
app.post('/api/ai-report', async (req, res) => { ... });
app.post('/api/ai-chat',   async (req, res) => { ... });

// Keep your existing app.listen at the end
app.listen(PORT, () => { ... });
```

## Step 4: Deploy

Commit and push. Render auto-deploys. Takes 2-3 minutes.

## Step 5: Test

Open eligibility.html, complete the questions, click Generate.
You should see the animated loading screen, then a fully AI-written report after ~15-20 seconds.
The chat button appears bottom-right after the report loads.

## Pricing note

Each full report costs approximately $0.015–0.025 USD (1.5–2.5 cents) with claude-sonnet-4-6.
Each chat message costs approximately $0.0005 USD (less than a tenth of a cent).
At 100 reports/day that is $1.50–2.50/day in API costs.

## Troubleshooting

- "Could not connect": check ANTHROPIC_API_KEY is set correctly in Render environment
- "API error 401": API key is wrong or expired
- "API error 529": Anthropic is over capacity, retry in a few minutes
- Reports generating but blank: check your server logs in Render for the exact error
