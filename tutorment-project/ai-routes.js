/* ═══════════════════════════════════════════════════════════
   THE TUTORMENT — AI Proxy Routes
   Add these two routes to your existing Express server on Render.
   
   Prerequisites:
   1. npm install @anthropic-ai/sdk  (in your Render project)
   2. Set environment variable: ANTHROPIC_API_KEY=sk-ant-...
      (Render dashboard → your service → Environment → Add variable)
   3. Add the two routes below to your server.js before app.listen()
═══════════════════════════════════════════════════════════ */

const Anthropic = require('@anthropic-ai/sdk');

/* ── Route 1: AI Report Generation ── */
app.post('/api/ai-report', async (req, res) => {
  try {
    const { systemPrompt, userMessage } = req.body;
    if (!systemPrompt || !userMessage) {
      return res.status(400).json({ error: 'systemPrompt and userMessage required' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    res.json({ content: message.content });

  } catch (err) {
    console.error('AI report error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ── Route 2: AI Chat ── */
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { system, messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: system || 'You are a helpful career counsellor at The Tutorment.',
      messages: messages
    });

    res.json({ content: message.content });

  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
