/*
  THE TUTORMENT — Local Dev Server
  Serves frontend files + proxies AI calls to Anthropic.

  Usage:
    1. node tutorment-local-server.js
    2. Open http://localhost:3000 in your browser

  Requirements:
    npm install express
*/

const path     = require('path');
module.paths.push(path.join(__dirname, 'tutorment-project', 'backend', 'node_modules'));
module.paths.push(path.join(__dirname, 'node_modules'));
const express  = require('express');

const app  = express();
const PORT = process.env.PORT || 8080;

/* ── Middleware ── */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── CORS for local dev ── */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/* AI routes removed — not using AI model */

/* ═══════════════════════════════════
   LOCAL API MOCK — simulates the Render backend
   Leads saved to memory, shown in terminal.
   Auth uses a simple in-memory user store.
═══════════════════════════════════ */

var localLeads = [];
var localUsers = [
  /* Default test account — use this to test the dashboard */
  { id:'1', firstName:'Test', lastName:'User', email:'test@test.com',
    password:'password123', role:'user', service:'hcpc', active:true }
];
var localSessions = {};

/* POST /api/leads */
app.post('/api/leads', (req, res) => {
  const lead = { ...req.body, id: Date.now(), createdAt: new Date().toISOString(), status:'new' };
  localLeads.push(lead);
  console.log('\n  ✅ New lead saved:');
  console.log('     Name:    ' + (lead.name||'—'));
  console.log('     Email:   ' + (lead.email||'—'));
  console.log('     Phone:   ' + (lead.phone||'—'));
  console.log('     Service: ' + (lead.service||'—'));
  console.log('     Message: ' + (lead.message||'—'));
  console.log('     Total leads this session: ' + localLeads.length + '\n');
  res.json({ success: true, message: 'Enquiry received. We will be in touch within 24 hours.' });
});

/* POST /api/auth/register */
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success:false, error:'Email and password required' });
  if (localUsers.find(u => u.email === email.toLowerCase())) {
    return res.status(400).json({ success:false, error:'Email already registered' });
  }
  const user = { id: Date.now().toString(), firstName, lastName, email: email.toLowerCase(),
    password, role:'user', service:'', active:true };
  localUsers.push(user);
  const token = 'local-token-' + user.id;
  localSessions[token] = user;
  console.log('  ✅ User registered:', email);
  res.json({ success:true, token, user:{ firstName, lastName, email, service:'', role:'user' } });
});

/* POST /api/auth/login */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = localUsers.find(u => u.email === (email||'').toLowerCase() && u.password === password);
  if (!user) return res.status(401).json({ success:false, error:'Incorrect email or password' });
  const token = 'local-token-' + user.id + '-' + Date.now();
  localSessions[token] = user;
  console.log('  ✅ Login:', email);
  res.json({ success:true, token, user:{ firstName:user.firstName, lastName:user.lastName,
    email:user.email, service:user.service||'', role:user.role } });
});

/* POST /api/auth/verify */
app.post('/api/auth/verify', (req, res) => {
  const token = (req.headers.authorization||'').replace('Bearer ','');
  const user  = localSessions[token] || (token ? localUsers[0] : null);
  if (!user) return res.json({ valid:false });
  res.json({ valid:true, user:{ firstName:user.firstName, lastName:user.lastName,
    email:user.email, service:user.service||'hcpc', role:user.role } });
});

/* GET /api/admin/stats (local mock) */
app.get('/api/admin/stats', (req, res) => {
  res.json({ success:true, stats:{ totalLeads:localLeads.length, newLeads:localLeads.length, totalUsers:localUsers.length, todayLeads:localLeads.length } });
});

/* Health check */
app.get('/api', (req, res) => {
  res.json({ status:'ok', service:'The Tutorment API (local)', leads:localLeads.length });
});

/* ── Serve frontend files ── */
app.use(express.static(path.join(__dirname, 'tutorment-project', 'frontend')));

/* Catch-all: serve index.html for unmatched routes */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'tutorment-project', 'frontend', 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('\n ┌─────────────────────────────────────────┐');
  console.log(' │  The Tutorment — Local Dev Server        │');
  console.log(' │  http://localhost:' + PORT + '                    │');
  console.log(' └─────────────────────────────────────────┘');
  console.log('\n Pages:');
  console.log('  http://localhost:' + PORT + '/                        → Homepage');
  console.log('  http://localhost:' + PORT + '/pages/eligibility.html  → Eligibility checker');
  console.log('  http://localhost:' + PORT + '/pages/salary-calculator.html → Salary calculator');
  console.log('  http://localhost:' + PORT + '/pages/contact.html      → Contact');
  console.log('  http://localhost:' + PORT + '/pages/dashboard.html    → Dashboard');

  console.log('\n Press Ctrl+C to stop\n');
});
