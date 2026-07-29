require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const validator  = require('validator');
const rateLimit  = require('express-rate-limit');
const crypto     = require('crypto');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ═══════════════════════════════════
   MIDDLEWARE
═══════════════════════════════════ */
app.use(express.json({ limit: '5mb' }));
app.use(cors({
  origin: function(origin, callback) {
    if (!origin ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('thetutorment.com') ||
        origin === 'null' ||
        origin.startsWith('file://')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

/* Rate limiting — protect auth routes from brute force */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per 15 min per IP
  message: { success: false, error: 'Too many attempts. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const leadsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,                   // 20 form submissions per hour per IP
  message: { success: false, error: 'Too many submissions. Please try again later.' },
});

/* ═══════════════════════════════════
   DATABASE
═══════════════════════════════════ */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tutorment';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('  MongoDB connected:', MONGODB_URI.includes('127.0.0.1') ? 'Local MongoDB' : 'Cloud Database'))
  .catch(err => console.log('  MongoDB warning (Set MONGODB_URI in backend/.env for database features):', err.message));

/* ═══════════════════════════════════
   SCHEMAS
═══════════════════════════════════ */
const leadSchema = new mongoose.Schema({
  name:      { type: String, trim: true },
  email:     { type: String, trim: true, lowercase: true },
  phone:     { type: String, trim: true },
  wing:      { type: String },
  service:   { type: String },
  message:   { type: String },
  source:    { type: String, default: 'website' },
  status:    { type: String, default: 'new', enum: ['new','contacted','converted','closed'] },
  notes:     { type: String },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  firstName:       { type: String, required: true, trim: true },
  lastName:        { type: String, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:        { type: String, required: true, minlength: 6 },
  phone:           { type: String, trim: true },
  country:         { type: String, trim: true },
  service:         { type: String },
  counsellor:      { type: String },
  nextSession:     { type: Date },
  role:            { type: String, default: 'user', enum: ['user','admin','counsellor'] },
  active:          { type: Boolean, default: true },
  resetToken:      { type: String },
  resetExpiry:     { type: Date },
  createdAt:       { type: Date, default: Date.now },
  lastLogin:       { type: Date },
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const reportSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal:      { type: String },
  field:     { type: String },
  target:    { type: String },
  readiness: { type: Number },
  htmlContent:  { type: String },   /* full report HTML */
  answers:   { type: mongoose.Schema.Types.Mixed },  /* raw A object */
  createdAt: { type: Date, default: Date.now },
});

const bookingSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:      { type: String, trim: true },
  email:     { type: String, trim: true, lowercase: true },
  phone:     { type: String, trim: true },
  service:   { type: String },
  message:   { type: String },
  preferredDate: { type: String },
  status:    { type: String, default: 'pending', enum: ['pending','confirmed','completed','cancelled'] },
  createdAt: { type: Date, default: Date.now },
});

const Lead    = mongoose.model('Lead',    leadSchema);
const User    = mongoose.model('User',    userSchema);
const Report  = mongoose.model('Report',  reportSchema);
const Booking = mongoose.model('Booking', bookingSchema);

/* ═══════════════════════════════════
   EMAIL
═══════════════════════════════════ */
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return transporter;
}

async function sendEmail(to, subject, html) {
  const t = getTransporter();
  if (!t) return;
  try {
    await t.sendMail({ from: `"The Tutorment" <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch(err) {
    console.error('  Email failed:', err.message);
  }
}

function leadNotificationHTML(lead) {
  return `<div style="font-family:Inter,sans-serif;max-width:520px">
    <h2 style="color:#0A2E73;margin-bottom:16px">New lead — The Tutorment</h2>
    <table style="border-collapse:collapse;width:100%">
      ${[['Name',lead.name],['Email',`<a href="mailto:${lead.email}">${lead.email}</a>`],
         ['Phone',lead.phone],['Service',lead.service],['Wing',lead.wing],
         ['Message',lead.message],['Source',lead.source],
         ['Time',new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})+' IST']]
        .map(([k,v],i) => `<tr style="background:${i%2===0?'#f8fafc':'#fff'}">
          <td style="padding:9px 12px;font-weight:700;color:#64748b;width:110px">${k}</td>
          <td style="padding:9px 12px;color:#0f172a">${v||'—'}</td></tr>`).join('')}
    </table>
    <div style="margin-top:20px"><a href="https://tutorment-backend.onrender.com/api/admin/leads"
      style="background:#0A2E73;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700">
      View all leads →</a></div></div>`;
}

function welcomeEmailHTML(firstName) {
  return `<div style="font-family:Inter,sans-serif;max-width:520px">
    <div style="background:linear-gradient(135deg,#040c1f,#0A2E73);padding:32px;border-radius:10px 10px 0 0">
      <h1 style="color:#fff;margin:0;font-size:24px">Welcome to The Tutorment, ${firstName}</h1>
      <p style="color:rgba(255,255,255,.7);margin:8px 0 0">Your career report is ready to revisit anytime.</p>
    </div>
    <div style="background:#fff;padding:28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px">
      <p style="color:#334155;line-height:1.7">Your account is active. You can now:</p>
      <ul style="color:#334155;line-height:1.9;padding-left:20px">
        <li>View and re-read your eligibility reports</li>
        <li>Track your progress with your counsellor</li>
        <li>Book sessions directly from your dashboard</li>
      </ul>
      <div style="margin-top:24px">
        <a href="https://thetutorment.com/pages/dashboard.html"
          style="background:#0A2E73;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;display:inline-block">
          Go to your dashboard →</a>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin-top:24px">
        The Tutorment · support@thetutorment.com · +91 75778 77777</p>
    </div></div>`;
}

/* ═══════════════════════════════════
   AUTH HELPERS
═══════════════════════════════════ */
function signToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function authRequired(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const d = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = d.userId; req.userRole = d.role; next();
  } catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

function adminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.userRole !== 'admin' && req.userRole !== 'counsellor')
      return res.status(403).json({ error: 'Admin access required' });
    next();
  });
}

function safeUser(u) {
  return { firstName:u.firstName, lastName:u.lastName, email:u.email,
    phone:u.phone, country:u.country, service:u.service||'',
    counsellor:u.counsellor||'', nextSession:u.nextSession||null, role:u.role };
}

/* ═══════════════════════════════════
   ROUTES — HEALTH
═══════════════════════════════════ */
app.get('/api', (req, res) => {
  res.json({ status:'ok', service:'The Tutorment API', version:'2.0.0' });
});

/* ═══════════════════════════════════
   ROUTES — LEADS
═══════════════════════════════════ */
app.post('/api/leads', leadsLimiter, async (req, res) => {
  try {
    const { name, email, phone, wing, service, message, source } = req.body;
    if (!email || !validator.isEmail(email))
      return res.status(400).json({ success:false, error:'Valid email required' });
    if (!name || name.trim().length < 2)
      return res.status(400).json({ success:false, error:'Name required' });

    const lead = await new Lead({
      name:name.trim(), email:email.trim().toLowerCase(),
      phone:phone||'', wing:wing||'', service:service||'',
      message:message||'', source:source||'website',
    }).save();

    console.log('  Lead:', lead.email, '|', lead.service||lead.source);
    sendEmail(process.env.NOTIFY_EMAIL, `New lead: ${lead.name} — ${lead.service||lead.source}`,
      leadNotificationHTML(lead));

    res.json({ success:true, message:'Enquiry received. We will be in touch within 24 hours.' });
  } catch(err) {
    console.error('  Lead error:', err.message);
    res.status(500).json({ success:false, error:'Could not save enquiry. Please try again.' });
  }
});

/* ═══════════════════════════════════
   ROUTES — AUTH
═══════════════════════════════════ */
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, country } = req.body;
    if (!firstName || firstName.trim().length < 2)
      return res.status(400).json({ success:false, error:'First name required' });
    if (!email || !validator.isEmail(email))
      return res.status(400).json({ success:false, error:'Valid email required' });
    if (!password || password.length < 6)
      return res.status(400).json({ success:false, error:'Password must be at least 6 characters' });

    if (await User.findOne({ email:email.toLowerCase() }))
      return res.status(400).json({ success:false, error:'An account with this email already exists. Please sign in.' });

    const user = await new User({
      firstName:firstName.trim(), lastName:lastName?lastName.trim():'',
      email:email.trim().toLowerCase(), password, phone:phone||'', country:country||'',
    }).save();

    const token = signToken(user);
    console.log('  Registered:', user.email);

    /* Welcome email */
    sendEmail(user.email, 'Welcome to The Tutorment', welcomeEmailHTML(user.firstName));

    res.json({ success:true, token, user:safeUser(user) });
  } catch(err) {
    console.error('  Register error:', err.message);
    res.status(500).json({ success:false, error:'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success:false, error:'Email and password required' });

    const user = await User.findOne({ email:email.toLowerCase() });
    if (!user || !user.active)
      return res.status(401).json({ success:false, error:'Incorrect email or password' });

    if (!await bcrypt.compare(password, user.password))
      return res.status(401).json({ success:false, error:'Incorrect email or password' });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user);
    console.log('  Login:', user.email);
    res.json({ success:true, token, user:safeUser(user) });
  } catch(err) {
    console.error('  Login error:', err.message);
    res.status(500).json({ success:false, error:'Login failed. Please try again.' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  const token = (req.headers.authorization||'').replace('Bearer ','');
  if (!token) return res.json({ valid:false });
  try {
    const d = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(d.userId);
    if (!user || !user.active) return res.json({ valid:false });
    res.json({ valid:true, user:safeUser(user) });
  } catch { res.json({ valid:false }); }
});

/* POST /api/auth/forgot-password */
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success:false, error:'Email required' });

    /* Always respond success — don't reveal whether email exists */
    const user = await User.findOne({ email:email.toLowerCase() });
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetToken  = token;
      user.resetExpiry = new Date(Date.now() + 60 * 60 * 1000); /* 1 hour */
      await user.save();

      const resetURL = `https://thetutorment.com/pages/reset-password.html?token=${token}`;
      sendEmail(user.email, 'Reset your Tutorment password',
        `<div style="font-family:Inter,sans-serif;max-width:480px">
          <h2 style="color:#0A2E73">Reset your password</h2>
          <p style="color:#334155;line-height:1.7">Click the link below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetURL}" style="display:inline-block;background:#0A2E73;color:#fff;padding:12px 24px;
            border-radius:6px;text-decoration:none;font-weight:700;margin:16px 0">Reset password →</a>
          <p style="color:#94a3b8;font-size:12px">If you did not request this, ignore this email. Your password has not been changed.</p>
          <p style="color:#94a3b8;font-size:12px">The Tutorment · support@thetutorment.com</p>
        </div>`);
    }
    res.json({ success:true, message:'If an account with that email exists, a reset link has been sent.' });
  } catch(err) {
    res.status(500).json({ success:false, error:'Could not send reset email. Please contact support@thetutorment.com' });
  }
});

/* POST /api/auth/reset-password */
app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6)
      return res.status(400).json({ success:false, error:'Valid token and password (min 6 chars) required' });

    const user = await User.findOne({
      resetToken: token,
      resetExpiry: { $gt: new Date() }
    });
    if (!user)
      return res.status(400).json({ success:false, error:'Reset link has expired or is invalid. Please request a new one.' });

    user.password    = newPassword;
    user.resetToken  = undefined;
    user.resetExpiry = undefined;
    await user.save();

    res.json({ success:true, message:'Password updated successfully. You can now sign in.' });
  } catch(err) {
    res.status(500).json({ success:false, error:'Could not reset password. Please try again.' });
  }
});

/* POST /api/auth/change-password */
app.post('/api/auth/change-password', authRequired, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ success:false, error:'New password must be at least 6 characters' });
    const user = await User.findById(req.userId);
    if (!await bcrypt.compare(currentPassword, user.password))
      return res.status(401).json({ success:false, error:'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success:true });
  } catch(err) {
    res.status(500).json({ success:false, error:err.message });
  }
});

/* ═══════════════════════════════════
   ROUTES — REPORTS
   Save eligibility reports against user account
═══════════════════════════════════ */
app.post('/api/reports', authRequired, async (req, res) => {
  try {
    const { goal, field, target, readiness, htmlContent, answers } = req.body;
    const report = await new Report({
      userId: req.userId,
      goal, field, target,
      readiness: readiness || 0,
      htmlContent: htmlContent || '',
      answers: answers || {},
    }).save();
    res.json({ success:true, reportId:report._id });
  } catch(err) {
    res.status(500).json({ success:false, error:err.message });
  }
});

app.get('/api/reports/my', authRequired, async (req, res) => {
  try {
    const reports = await Report.find({ userId:req.userId })
      .select('-htmlContent')  /* exclude large HTML from list view */
      .sort({ createdAt:-1 })
      .limit(20);
    res.json({ success:true, reports });
  } catch(err) {
    res.status(500).json({ success:false, error:err.message });
  }
});

app.get('/api/reports/:id', authRequired, async (req, res) => {
  try {
    const report = await Report.findOne({ _id:req.params.id, userId:req.userId });
    if (!report) return res.status(404).json({ success:false, error:'Report not found' });
    res.json({ success:true, report });
  } catch(err) {
    res.status(500).json({ success:false, error:err.message });
  }
});

/* ═══════════════════════════════════
   ROUTES — BOOKINGS
   Session booking requests
═══════════════════════════════════ */
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, service, message, preferredDate } = req.body;
    if (!email || !validator.isEmail(email))
      return res.status(400).json({ success:false, error:'Valid email required' });

    /* Link to user account if logged in */
    let userId = null;
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      try { const d = jwt.verify(token, process.env.JWT_SECRET); userId = d.userId; } catch {}
    }

    const booking = await new Booking({
      userId, name:name||'', email:email.toLowerCase(),
      phone:phone||'', service:service||'', message:message||'', preferredDate:preferredDate||'',
    }).save();

    console.log('  Booking:', booking.email, '|', booking.service);
    sendEmail(process.env.NOTIFY_EMAIL,
      `Session booking: ${booking.name||booking.email} — ${booking.service||'General'}`,
      leadNotificationHTML({...booking.toObject(), source:'booking-request'}));

    res.json({ success:true, message:'Session request received. We will confirm within 24 hours.' });
  } catch(err) {
    res.status(500).json({ success:false, error:err.message });
  }
});

/* ═══════════════════════════════════
   ROUTES — USER DASHBOARD DATA
═══════════════════════════════════ */
app.get('/api/user/dashboard', authRequired, async (req, res) => {
  try {
    const [user, reports, bookings] = await Promise.all([
      User.findById(req.userId),
      Report.find({ userId:req.userId }).select('-htmlContent').sort({ createdAt:-1 }).limit(5),
      Booking.find({ userId:req.userId }).sort({ createdAt:-1 }).limit(3),
    ]);
    if (!user) return res.status(404).json({ success:false, error:'User not found' });
    res.json({
      success: true,
      user: safeUser(user),
      reports,
      bookings,
      lastReport: reports[0] || null,
    });
  } catch(err) {
    res.status(500).json({ success:false, error:err.message });
  }
});

/* ═══════════════════════════════════
   ROUTES — ADMIN
═══════════════════════════════════ */
app.get('/api/admin/stats', adminRequired, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const [totalLeads, newLeads, totalUsers, todayLeads, totalReports, pendingBookings] =
      await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status:'new' }),
        User.countDocuments({ role:'user' }),
        Lead.countDocuments({ createdAt:{ $gte:today } }),
        Report.countDocuments(),
        Booking.countDocuments({ status:'pending' }),
      ]);
    res.json({ success:true, stats:{ totalLeads, newLeads, totalUsers, todayLeads, totalReports, pendingBookings } });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

app.get('/api/admin/leads', adminRequired, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 50;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.wing)   filter.wing   = req.query.wing;
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt:-1 }).skip((page-1)*limit).limit(limit),
      Lead.countDocuments(filter),
    ]);
    res.json({ success:true, leads, total, page, pages:Math.ceil(total/limit) });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

app.patch('/api/admin/leads/:id', adminRequired, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id,
      { status:req.body.status, notes:req.body.notes }, { new:true });
    res.json({ success:true, lead });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

app.get('/api/admin/users', adminRequired, async (req, res) => {
  try {
    const users = await User.find({}).select('-password -resetToken -resetExpiry')
      .sort({ createdAt:-1 }).limit(100);
    res.json({ success:true, users });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

app.patch('/api/admin/users/:id', adminRequired, async (req, res) => {
  try {
    const { service, counsellor, nextSession, role, active } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id,
      { service, counsellor, nextSession, role, active }, { new:true }).select('-password');
    res.json({ success:true, user });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

app.get('/api/admin/bookings', adminRequired, async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt:-1 }).limit(100);
    res.json({ success:true, bookings });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

app.patch('/api/admin/bookings/:id', adminRequired, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id,
      { status:req.body.status }, { new:true });
    res.json({ success:true, booking });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

/* ═══════════════════════════════════
   AI PROXY ROUTES
═══════════════════════════════════ */
app.post('/api/ai-report', async (req, res) => {
  try {
    const { systemPrompt, userMessage } = req.body;
    if (!systemPrompt || !userMessage) {
      return res.status(400).json({ error: 'systemPrompt and userMessage required' });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'AI features require ANTHROPIC_API_KEY set in backend/.env' });
    }
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { system, messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'AI features require ANTHROPIC_API_KEY set in backend/.env' });
    }
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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

/* ═══════════════════════════════════
   ERROR HANDLERS
═══════════════════════════════════ */
app.use((req, res) => res.status(404).json({ error:'Route not found' }));
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error:'Internal server error' });
});

/* ═══════════════════════════════════
   START
═══════════════════════════════════ */
app.listen(PORT, () => {
  console.log('\n ┌────────────────────────────────────────────┐');
  console.log(' │  The Tutorment — Backend API v2             │');
  console.log(' │  http://localhost:' + PORT + '/api                 │');
  console.log(' └────────────────────────────────────────────┘\n');
  console.log('  POST /api/leads');
  console.log('  POST /api/auth/register | login | verify');
  console.log('  POST /api/auth/forgot-password | reset-password');
  console.log('  POST /api/reports   GET /api/reports/my');
  console.log('  POST /api/bookings');
  console.log('  GET  /api/user/dashboard');
  console.log('  GET  /api/admin/stats | leads | users | bookings\n');
});
