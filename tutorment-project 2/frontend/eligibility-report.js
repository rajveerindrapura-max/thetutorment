/* THE TUTORMENT  -  eligibility-report.js v6  -  Goal-Specific Adaptive Flow */

/* ═══════════════════════════════════
   STATE
═══════════════════════════════════ */
var P = {};
var A = {};
var hist = [];
var addOns = [];

/* ═══════════════════════════════════
   GATE
═══════════════════════════════════ */
document.getElementById('gCountry').addEventListener('change', function(){
  document.getElementById('gCountryOtherWrap').style.display = this.value === 'other' ? 'block' : 'none';
});

function startChecker(){
  var first = (document.getElementById('gFirst').value||'').trim();
  var email = (document.getElementById('gEmail').value||'').trim();
  var country = document.getElementById('gCountry').value;
  var err = document.getElementById('gErr');
  if(!first){ err.textContent='Please enter your first name.'; err.style.display='block'; return; }
  if(!email||!email.includes('@')){ err.textContent='Please enter a valid email.'; err.style.display='block'; return; }
  if(!country){ err.textContent='Please select your country.'; err.style.display='block'; return; }
  P = {
    firstName: first,
    lastName: (document.getElementById('gLast').value||'').trim(),
    email: email,
    phone: (document.getElementById('gPhone').value||'').trim(),
    country: country === 'other' ? (document.getElementById('gCountryOther').value||'Other') : country
  };
  localStorage.setItem('tt_elig_user', JSON.stringify(P));
  showChecker();
}

function skipGate(){
  try { P = JSON.parse(localStorage.getItem('tt_elig_user')||localStorage.getItem('tt_user')||'{}'); } catch(e){ P={}; }
  if(!P.firstName) P.firstName = '';
  showChecker();
}

function showChecker(){
  A = {}; hist = []; addOns = [];
  /* Start with name question if no name from gate */
  currentQId = (P.firstName && P.firstName.trim()) ? 'q-goal' : 'q-name';
  if(P.country && P.country !== '') A['current-country'] = gateCountryToKey(P.country);
  document.getElementById('page-gate').style.display = 'none';
  document.getElementById('page-checker').style.display = 'block';
  window.scrollTo({top:0,behavior:'instant'});
  renderQ(getQ(currentQId));
}

window.addEventListener('load', function(){
  /* Read stored user — prefer tt_user (logged-in account) over tt_elig_user (gate form) */
  var stored = localStorage.getItem('tt_user') || localStorage.getItem('tt_elig_user');
  if(stored){
    try { P = JSON.parse(stored); } catch(e){}
  }

  /* If user is already logged in, pre-fill and auto-skip the gate form */
  var token = localStorage.getItem('tt_token');
  if(token && P && P.firstName){
    /* Pre-fill gate form fields silently */
    var gFirst = document.getElementById('gFirst');
    var gEmail = document.getElementById('gEmail');
    var gLast  = document.getElementById('gLast');
    if(gFirst) gFirst.value = P.firstName||'';
    if(gLast)  gLast.value  = P.lastName||'';
    if(gEmail) gEmail.value = P.email||'';
    /* Auto-skip gate — logged-in users go straight to checker */
    skipGate();
  }
});

/* ═══════════════════════════════════
   QUESTION BANK
   All questions in one flat object.
   The router picks which ones to show.
═══════════════════════════════════ */
var QB = {

  /* ── NAME (shown only to skip-gate users or if P.firstName is empty) ── */
  'q-name': {
    id:'q-name', phase:1,
    q:'What should we call you?',
    hint:'Your name makes this report personal. Every section will address you directly.',
    opts:[],
    key:'_nameInput', writeIn:true, writeInLabel:'Type your first name here...',
    nameOnly:true
  },

  /* ── UNIVERSAL ── */
  'q-goal': {
    id:'q-goal', phase:1,
    q:'What is your primary goal right now?',
    hint:'Pick the one that matters most today. Your entire question set and report will be built around this.',
    opts:[
      {v:'phd-scholarship',           t:'Get a fully funded PhD or major scholarship',     d:'Funded doctoral research or a fully funded masters  -  Chevening, Commonwealth, Fulbright, DAAD, Australia Awards, UKRI, or a university stipend.'},
      {v:'study-abroad',              t:'Study at a university abroad',                    d:'Masters, postgrad diploma, or undergraduate degree at a university outside India.'},
      {v:'job-international',         t:'Find a job in another country',                   d:'Relocate for work through employer sponsorship, a skilled worker visa, or a professional registration route.'},
      {v:'professional-registration', t:'Get my professional qualification recognised abroad', d:'Regulated profession  -  physiotherapy, nursing, medicine, pharmacy, dentistry, teaching, OT, and others.'},
      {v:'india-job',                 t:'Get placed in a job in India',                    d:'Campus placement, off-campus applications, career switch, or applications submitted on your behalf.'},
      {v:'india-salary',              t:'Significantly increase my salary in India',       d:'Currently employed but pay has stalled. Identify the gap, close it, negotiate a better offer.'},
      {v:'upskill',                   t:'Build specific professional skills',              d:'Live one-to-one sessions with a working professional in your target field.'},
      {v:'migrate',                   t:'Migrate permanently to another country',          d:'Long-term settlement pathway  -  PR, citizenship, or family migration.'},
    ],
    key:'goal', writeIn:true, writeInLabel:'My goal is something else...'
  },

  /* ── SHARED: field/profession ── */
  'q-field': {
    id:'q-field', phase:1,
    get q(){ return {'phd-scholarship':'What is your research field or area of study?','study-abroad':'What subject or field do you want to study?','job-international':'What is your profession or field of expertise?','professional-registration':'What is your profession?','india-job':'What is your profession or target role?','india-salary':'What is your current profession?','upskill':'Which field do you want to build skills in?','migrate':'What is your profession?'}[A.goal]||'What is your profession or field?'; },
    get hint(){ return {'phd-scholarship':'Be specific  -  this determines which funding bodies, supervisors, and universities are relevant to your profile.','study-abroad':'This determines universities, entry requirements, and scholarship options.','professional-registration':'This determines your registering body, route, and documents required.'}[A.goal]||'This shapes your salary benchmarks, skill gap, and pathway in the report.'; },
    opts:[
      {v:'stem-engineering',      t:'Engineering  -  Civil, Mechanical, Electrical, Chemical', d:''},
      {v:'stem-cs',               t:'Computer Science, AI, Data Science, or Software Engineering', d:''},
      {v:'stem-biomed',           t:'Biomedical, Life Sciences, or Biotechnology', d:''},
      {v:'stem-physics-chem',     t:'Physics, Chemistry, or Materials Science', d:''},
      {v:'stem-env',              t:'Environmental Science, Sustainability, or Energy', d:''},
      {v:'health-medicine',       t:'Medicine / MBBS', d:''},
      {v:'health-nursing',        t:'Nursing or Midwifery', d:''},
      {v:'health-physio',         t:'Physiotherapy / Physical Therapy', d:''},
      {v:'health-pharmacy',       t:'Pharmacy', d:''},
      {v:'health-dentistry',      t:'Dentistry', d:''},
      {v:'health-allied',         t:'Occupational Therapy, Radiography, Speech Therapy, or other Allied Health', d:''},
      {v:'business-finance',      t:'Finance, Banking, or Accounting', d:''},
      {v:'business-mgmt',         t:'Business, Management, or MBA', d:''},
      {v:'business-pm',           t:'Product Management or Project Management', d:''},
      {v:'business-marketing',    t:'Marketing, Digital, or Growth', d:''},
      {v:'social-law',            t:'Law / Legal', d:''},
      {v:'social-education',      t:'Education / Teaching', d:''},
      {v:'social-policy',         t:'Public Policy, International Relations, or Development', d:''},
      {v:'social-psychology',     t:'Psychology, Sociology, or Anthropology', d:''},
      {v:'creative-design',       t:'Design  -  UI/UX, Graphic, or Product Design', d:''},
      {v:'creative-architecture', t:'Architecture or Urban Planning', d:''},
      {v:'creative-arts',         t:'Fine Arts, Media, Film, or Performing Arts', d:''},
    ],
    key:'field', writeIn:true, writeInLabel:'My field is not listed  -  I will describe it...'
  },

  /* ── SHARED: qualification ── */
  'q-qual': {
    id:'q-qual', phase:2,
    get q(){ return {'phd-scholarship':'What is your highest completed academic qualification?','study-abroad':'What is your current or highest qualification?','job-international':'What is your highest qualification?','migrate':'What is your highest qualification?'}[A.goal]||'What is your current or highest qualification?'; },
    get hint(){ return {'phd-scholarship':'A Bachelors is the minimum for most funded PhDs. Masters holders are stronger candidates for fully funded positions.'}[A.goal]||'Include qualifications currently in progress. This determines your eligibility and pathway.'; },
    opts:[
      {v:'high-school',        t:'High school / 12th standard (completed)', d:''},
      {v:'diploma',            t:'Diploma - completed (1-2 year programme)', d:''},
      {v:'bachelors',          t:'Bachelor degree - completed (B.Tech, B.Sc, BA, B.Com)', d:''},
      {v:'bachelors-honours',  t:'Bachelor with Honours or First Class - completed', d:''},
      {v:'student-bachelors',  t:'Currently pursuing Bachelor degree (in progress)', d:'Final year or ongoing undergraduate student.'},
      {v:'student-mba',        t:'Currently pursuing MBA (in progress)', d:'Full-time, part-time, or online MBA student.'},
      {v:'student-masters',    t:'Currently pursuing Masters or MSc (in progress)', d:'Full-time or part-time postgraduate student.'},
      {v:'masters',            t:'Masters degree - completed (MBA, M.Tech, MSc, MA)', d:''},
      {v:'phd-student',        t:'Currently pursuing PhD (in progress)', d:''},
      {v:'phd',                t:'PhD or Doctoral degree - completed', d:''},
      {v:'professional-cert',  t:'Professional certification only (no degree)', d:'CPA, CFA, PMP, AWS, or similar.'},
    ],
    key:'qualification', writeIn:true, writeInLabel:'Other qualification...'
  },

  /* ── SHARED: experience ── */
  'q-exp': {
    id:'q-exp', phase:2,
    get q(){ return {'phd-scholarship':'How many years of relevant academic or research experience do you have?','study-abroad':'How many years of work or academic experience do you have after your last degree?'}[A.goal]||'How many years of relevant work experience do you have?'; },
    get hint(){ return {'phd-scholarship':'Include research assistantships, internships, publications, and any postdoctoral work. This affects your competitiveness for funded positions.','india-salary':'Count years in your current or closely related profession only.'}[A.goal]||'Count years in roles directly related to your profession. Internships count as partial years.'; },
    opts:[
      {v:'0',  t:'None  -  I am a student or recent graduate', d:''},
      {v:'1',  t:'Less than 1 year', d:''},
      {v:'2',  t:'1 to 2 years', d:''},
      {v:'4',  t:'3 to 5 years', d:''},
      {v:'7',  t:'6 to 8 years', d:''},
      {v:'10', t:'9 to 12 years', d:''},
      {v:'15', t:'13 or more years', d:''},
    ],
    key:'experience', writeIn:false
  },

  /* ── SHARED: target country ── */
  /* ── MIGRATE: where are you now? ── */
  'q-migrate-from': {
    id:'q-migrate-from', phase:3,
    q:'Where are you currently based?',
    hint:'This changes the visa routes, comparison points, and advice in your report significantly.',
    opts:[
      {v:'india',       t:'India', d:''},
      {v:'uk',          t:'United Kingdom', d:''},
      {v:'usa',         t:'United States of America', d:''},
      {v:'uae',         t:'UAE  -  Dubai, Abu Dhabi, Sharjah', d:''},
      {v:'canada',      t:'Canada', d:''},
      {v:'australia',   t:'Australia', d:''},
      {v:'germany',     t:'Germany', d:''},
      {v:'singapore',   t:'Singapore', d:''},
      {v:'new-zealand', t:'New Zealand', d:''},
      {v:'ireland',     t:'Ireland', d:''},
      {v:'netherlands', t:'Netherlands', d:''},
      {v:'gulf-other',  t:'Other Gulf country (Qatar, Kuwait, Bahrain, Oman)', d:''},
    ],
    key:'migrate-from', writeIn:true, writeInLabel:'Another country...'
  },

  'q-target': {
    id:'q-target', phase:3,
    get q(){
      if(A.goal==='migrate'){
        var from=A['migrate-from']||'';
        /* If currently abroad, offer "return to India" prominently */
        if(from && from!=='india') return 'Which country do you want to migrate to  -  or are you returning home?';
        return 'Which country do you want to migrate to?';
      }
      return {'phd-scholarship':'Which country do you most want to do your PhD or funded programme in?','study-abroad':'Which country do you most want to study in?','professional-registration':'Which country are you seeking registration in?'}[A.goal]||'Which country are you targeting?';
    },
    get hint(){ return {'phd-scholarship':'This determines the funding bodies, visa route, and supervisor search strategy in your report.','study-abroad':'Your report will cover entry requirements, costs, scholarships, and post-study work rights for this country.'}[A.goal]||'Select your primary destination. Your report will cover alternatives too.'; },
    get opts(){
      var from=A['migrate-from']||'';
      var base=[
        {v:'uk',          t:'United Kingdom', d:'Skilled Worker visa  -  5 years to ILR, 6 years to citizenship'},
        {v:'canada',      t:'Canada', d:'Express Entry  -  fastest PR route globally, 6-12 months ITA to PR'},
        {v:'australia',   t:'Australia', d:'Points-based 189/190  -  65+ points, or employer sponsored 482 to 186'},
        {v:'germany',     t:'Germany', d:'EU Blue Card  -  2 years to settlement permit, 5 years to citizenship'},
        {v:'ireland',     t:'Ireland', d:'Critical Skills Permit  -  2 years to Stamp 4, 5 years to citizenship'},
        {v:'netherlands', t:'Netherlands', d:'Highly Skilled Migrant  -  2-week processing, 5 years to citizenship'},
        {v:'singapore',   t:'Singapore', d:'Employment Pass  -  2-3 years to PR application (30-40% approval rate)'},
        {v:'new-zealand', t:'New Zealand', d:'Accredited Employer Work Visa  -  2 years to residence'},
        {v:'usa',         t:'United States of America', d:'H-1B lottery or O-1 extraordinary ability'},
        {v:'uae',         t:'UAE  -  Dubai / Abu Dhabi', d:'No standard PR route  -  Golden Visa or Green Visa for long-term stay'},
        {v:'open',        t:'I am open  -  show me the best options for my profile', d:'Your report will compare all pathways and recommend the strongest for your background'},
      ];
      /* If currently abroad, add return-to-India as first option */
      if(from && from!=='india'){
        base.unshift({v:'return-india',t:'Return to India  -  settle back home',d:'Leverage your international experience for senior roles in India\'s growing market'});
      }
      return base;
    },
    key:'target-country', writeIn:true, writeInLabel:'Another country...'
  },

  /* ── SHARED: english ── */
  'q-english': {
    id:'q-english', phase:4,
    get q(){ return {'phd-scholarship':'What is your English language test status?','study-abroad':'What is your English language test status?','job-international':'What is your English language test status?','professional-registration':'What is your English language test status?'}[A.goal]||'What is your English language test status?'; },
    get hint(){ return {'phd-scholarship':'Most fully funded programmes require IELTS 6.5–7.0 minimum. Top UK universities often require 7.0+ overall with no component below 6.5.','professional-registration':'Clinical regulators (HCPC, NMC, GMC) require IELTS 7.0 each band or OET Grade B each skill  -  these are strict thresholds with no exceptions.'}[A.goal]||'Required for most international visa, registration, and university applications.'; },
    opts:[
      {v:'ielts-high',     t:'IELTS Academic  -  7.0 or above overall', d:'Meets most university and registration requirements.'},
      {v:'ielts-65',       t:'IELTS Academic  -  6.5 overall', d:'Meets many universities; below clinical registration thresholds.'},
      {v:'ielts-mid',      t:'IELTS Academic  -  6.0 or below', d:'Below threshold for most funded programmes and registrations.'},
      {v:'oet-b',          t:'OET  -  Grade B or above in each skill', d:'Healthcare-specific. Accepted by HCPC, NMC, GMC, AHPRA.'},
      {v:'toefl-high',     t:'TOEFL iBT  -  90 or above', d:'Accepted by most universities worldwide.'},
      {v:'pte-high',       t:'PTE Academic  -  65 or above', d:'Accepted by most universities and Australian immigration.'},
      {v:'below-required', t:'I have a result but below the required threshold', d:''},
      {v:'not-taken',      t:'I have not taken any test yet', d:''},
      {v:'native',         t:'English is my first language / educated in English', d:'A formal test may still be required by regulators.'},
    ],
    key:'english', writeIn:false
  },

  /* ── SETTLE IN INDIA: citizenship status ── */
  'q-india-citizenship': {
    id:'q-india-citizenship', phase:4,
    q:'What is your citizenship status?',
    hint:'This determines which documents, visa requirements, and financial rules apply to your India move.',
    opts:[
      {v:'indian-citizen',    t:'Indian citizen (holding Indian passport)', d:'No visa needed. OCI does not apply.'},
      {v:'oci-holder',        t:'OCI card holder (Indian origin, foreign citizen)', d:'Overseas Citizen of India  -  can live and work in India freely.'},
      {v:'foreign-national',  t:'Foreign national (no Indian origin)', d:'Requires Employment Visa to work in India.'},
      {v:'nri-returning',     t:'NRI  -  Indian citizen who has been living abroad', d:'Indian passport holder returning to India permanently.'},
      {v:'pio',               t:'Person of Indian Origin (PIO / foreign passport, Indian origin)', d:'Eligible for OCI card if not already held.'},
    ],
    key:'india-citizenship', writeIn:false
  },

  /* ── SETTLE IN INDIA: masters specialisation ── */
  'q-masters-type': {
    id:'q-masters-type', phase:4,
    q:'What type of Masters or postgraduate degree did you complete?',
    hint:'The type of qualification changes which roles you are eligible for and how Indian employers will position you.',
    opts:[
      {v:'mba',           t:'MBA  -  Master of Business Administration', d:'General management, strategy, finance, marketing, consulting.'},
      {v:'ms-tech',       t:'MS / M.Tech  -  Technical Masters (Computer Science, Engineering, Data Science)', d:''},
      {v:'ms-finance',    t:'Masters in Finance, Economics, or Accounting (non-MBA)', d:'MFin, MFE, MSc Finance, CPA/CA equivalent.'},
      {v:'ma-social',     t:'MA  -  Humanities, Social Sciences, Policy, Law', d:''},
      {v:'msc-science',   t:'MSc  -  Natural Sciences, Biomedical, Pharma, Environmental', d:''},
      {v:'mpa-mpp',       t:'MPA / MPP  -  Public Administration or Public Policy', d:''},
      {v:'med-clinical',  t:'Postgraduate clinical qualification (MD, MS Surgery, Diploma)', d:'Medical specialist qualification.'},
      {v:'mba-exec',      t:'Executive MBA (part-time, while working)', d:''},
    ],
    key:'masters-type', writeIn:true, writeInLabel:'Another type of Masters...'
  },

  /* ── SHARED: timeline ── */
  'q-timeline': {
    id:'q-timeline', phase:5,
    q:'How soon are you looking to make this move?',
    hint:'This sets the urgency and sequencing of your action plan.',
    opts:[
      {v:'asap',      t:'As soon as possible  -  within 3 months', d:''},
      {v:'6months',   t:'Within 6 months', d:''},
      {v:'1year',     t:'Within the next year', d:''},
      {v:'2years',    t:'1 to 2 years from now', d:''},
      {v:'exploring', t:'Just exploring  -  no fixed timeline yet', d:''},
    ],
    key:'timeline', writeIn:false
  },

  /* ── SHARED: add-ons (dynamically filtered) ── */
  'q-addons': {
    id:'q-addons', phase:6,
    q:'Which additional sections do you want in your report?',
    hint:'Your core report is already being built. Select any extra sections to add.',
    opts:[], // populated dynamically by getAddonOpts()
    key:'addons', multi:true, writeIn:false
  },

  /* ══ PhD / SCHOLARSHIP SPECIFIC ══ */

  'q-phd-funding': {
    id:'q-phd-funding', phase:3,
    q:'What type of funding are you looking for?',
    hint:'This determines which scholarships, universities, and routes your report covers.',
    opts:[
      {v:'fully-funded',    t:'Fully funded only  -  tuition + living stipend',     d:'Chevening, Commonwealth, Fulbright, DAAD, UKRI, university stipends. Highly competitive.'},
      {v:'partial-funding', t:'Partial funding acceptable  -  tuition waiver or stipend only', d:'University merit awards, departmental bursaries, TA/RA positions.'},
      {v:'self-funded',     t:'Self-funded  -  I just need the right university and programme', d:'You are funding tuition yourself or through a loan.'},
      {v:'not-sure',        t:'Not sure yet  -  show me all options', d:'Your report will cover the full spectrum from fully funded to self-funded.'},
    ],
    key:'phd-funding', writeIn:false
  },

  'q-phd-proposal': {
    id:'q-phd-proposal', phase:4,
    q:'Where are you in your research proposal or study plan?',
    hint:'This is the most important indicator of your application readiness.',
    opts:[
      {v:'no-idea',      t:'I have a broad topic but no written proposal yet',           d:''},
      {v:'draft',        t:'I have a draft proposal  -  not yet reviewed by anyone',       d:''},
      {v:'reviewed',     t:'My proposal has been reviewed by a supervisor or academic',  d:''},
      {v:'supervisor',   t:'I have already contacted potential supervisors and had responses', d:''},
      {v:'conditional',  t:'I have a conditional offer from a university already',       d:''},
    ],
    key:'phd-proposal', writeIn:false
  },

  'q-phd-publications': {
    id:'q-phd-publications', phase:4,
    q:'Do you have any research publications, conference papers, or academic projects?',
    hint:'Publications significantly strengthen funded PhD applications, especially at research-intensive universities.',
    opts:[
      {v:'none',         t:'None yet', d:''},
      {v:'project-only', t:'Completed dissertation or capstone project only', d:''},
      {v:'conference',   t:'Conference paper or poster presentation', d:''},
      {v:'journal',      t:'One or more journal publications (any tier)', d:''},
      {v:'top-journal',  t:'Published in a peer-reviewed Q1/Q2 journal', d:'This significantly improves competitiveness for top funded positions.'},
    ],
    key:'phd-publications', writeIn:false
  },

  /* ══ STUDY ABROAD SPECIFIC ══ */

  'q-study-level': {
    id:'q-study-level', phase:3,
    q:'What level of programme are you applying for?',
    hint:'',
    opts:[
      {v:'masters',         t:'Masters degree (MSc, MA, MBA, MEng)', d:'1–2 year taught or research programme.'},
      {v:'postgrad-diploma',t:'Postgraduate Diploma or Certificate', d:'Shorter taught programme, often a pathway to a Masters.'},
      {v:'phd-taught',      t:'PhD by taught route (integrated programme)', d:'Some universities offer 4-year programmes starting without a Masters.'},
      {v:'undergrad',       t:'Undergraduate degree (Bachelors abroad)', d:'3–4 year programme. Different entry requirements.'},
      {v:'not-decided',     t:'Not decided yet  -  want to understand options', d:''},
    ],
    key:'study-level', writeIn:false
  },

  'q-study-grades': {
    id:'q-study-grades', phase:4,
    q:'What is your approximate academic grade or percentage in your most recent qualification?',
    hint:'Most competitive universities require a 2:1 equivalent (60%+) for Masters admission. Top universities expect 70%+.',
    opts:[
      {v:'distinction',   t:'Distinction / First Class / 75% and above', d:'Competitive for top 50 world-ranked universities.'},
      {v:'merit',         t:'Merit / Upper Second / 60–74%', d:'Eligible for most programmes. Scholarship-competitive at mid-tier universities.'},
      {v:'pass',          t:'Pass / Second Class / 50–59%', d:'Eligible for many programmes; fewer scholarship options.'},
      {v:'below-pass',    t:'Below 50% or a gap year since last degree', d:''},
      {v:'in-progress',   t:'Currently studying  -  result not yet available', d:''},
    ],
    key:'grades', writeIn:false
  },

  /* ══ JOB INTERNATIONAL SPECIFIC ══ */

  'q-job-current-country': {
    id:'q-job-current-country', phase:3,
    q:'Which country are you currently based in?',
    hint:'This determines your current visa status and what route you are applying from.',
    opts:[
      {v:'india',             t:'India', d:''},
      {v:'uk-current',        t:'United Kingdom', d:''},
      {v:'usa-current',       t:'United States', d:''},
      {v:'canada-current',    t:'Canada', d:''},
      {v:'australia-current', t:'Australia', d:''},
      {v:'uae-current',       t:'UAE', d:''},
      {v:'nigeria-current',   t:'Nigeria', d:''},
      {v:'philippines-current',t:'Philippines', d:''},
      {v:'sri-lanka-current', t:'Sri Lanka', d:''},
      {v:'nepal-current',     t:'Nepal', d:''},
      {v:'pakistan-current',  t:'Pakistan', d:''},
    ],
    key:'current-country', writeIn:true, writeInLabel:'I am in another country...'
  },

  'q-job-salary': {
    id:'q-job-salary', phase:4,
    get q(){ return 'What is your current annual salary?'; },
    hint:'Used to verify you meet minimum salary thresholds for sponsored visas and to calculate your earnings uplift.',
    opts:[], // populated dynamically by getSalaryOpts()
    key:'salary', writeIn:false
  },

  'q-job-visa-awareness': {
    id:'q-job-visa-awareness', phase:4,
    q:'How much do you know about the visa and sponsorship process for your target country?',
    hint:'This helps calibrate how much detail to include in your report.',
    opts:[
      {v:'nothing',     t:'Very little  -  I need everything explained from scratch', d:''},
      {v:'basic',       t:'I understand the basics but need a clear action plan', d:''},
      {v:'researched',  t:'I have researched the route and need help with my application', d:''},
      {v:'applied',     t:'I have already applied or been through the process before', d:''},
    ],
    key:'visa-awareness', writeIn:false
  },

  /* ══ PROFESSIONAL REGISTRATION SPECIFIC ══ */

  'q-reg-country': {
    id:'q-reg-country', phase:3,
    q:'Which country are you seeking professional registration in?',
    hint:'',
    opts:[
      {v:'uk',        t:'United Kingdom', d:'HCPC, NMC, GMC, GPhC, GDC, DfE'},
      {v:'australia', t:'Australia', d:'AHPRA, AMC, ADC, AITSL'},
      {v:'canada',    t:'Canada', d:'Provincial bodies  -  NNAS, MCCQE, PEBC'},
      {v:'usa',       t:'United States', d:'State boards  -  NCLEX, USMLE, NAPLEX, FCCPT'},
      {v:'ireland',   t:'Ireland', d:'CORU, IMC, PSI'},
      {v:'uae',       t:'UAE', d:'DHA, HAAD, MOH'},
      {v:'new-zealand',t:'New Zealand', d:'MCNZ, NCNZ, HPCAA'},
    ],
    key:'target-country', writeIn:true, writeInLabel:'Another country...'
  },

  'q-reg-status': {
    id:'q-reg-status', phase:4,
    get q(){ return 'What is your current registration status for ' + getFieldDisplay(A.field) + '?'; },
    hint:'This is the single most important factor in determining your route  -  equivalence, adaptation, or full exam.',
    opts:[
      {v:'fully-registered',   t:'Fully registered and currently practising in my home country', d:'Active, unexpired licence.'},
      {v:'registered-gap',     t:'Registered but not practising / gap in practice', d:'You hold registration but have not been in active clinical practice recently.'},
      {v:'registered-lapsed',  t:'Previously registered  -  now lapsed or expired', d:''},
      {v:'in-training',        t:'Currently in training  -  not yet registered', d:'Final year student or newly qualified awaiting registration.'},
      {v:'not-registered',     t:'Not formally registered anywhere', d:'Working in a related role without statutory registration.'},
    ],
    key:'reg-status', writeIn:false
  },

  'q-reg-documents': {
    id:'q-reg-documents', phase:5,
    q:'Which documents do you already have ready?',
    hint:'Select all that apply. Missing documents are the most common cause of application delays.',
    opts:[
      {v:'qualification-cert',   t:'Original qualification certificate (degree/diploma)', d:''},
      {v:'transcripts',          t:'Academic transcripts (official sealed copy)', d:''},
      {v:'home-registration',    t:'Current registration certificate from your home regulator', d:''},
      {v:'good-standing',        t:'Certificate of good standing from your home regulator', d:''},
      {v:'passport',             t:'Valid passport (at least 12 months remaining)', d:''},
      {v:'police-clearance',     t:'Police clearance certificate(s)', d:'Required from every country you have lived in 12+ months in the past 5 years.'},
      {v:'references',           t:'Professional references (2 supervisors on headed paper)', d:''},
      {v:'english-result',       t:'IELTS / OET result meeting the required threshold', d:''},
    ],
    key:'reg-documents', multi:true, writeIn:false
  },

  /* ══ INDIA JOB SPECIFIC ══ */

  'q-india-target-role': {
    id:'q-india-target-role', phase:3,
    q:'What type of role or level are you targeting?',
    hint:'',
    opts:[
      {v:'fresher',       t:'Fresher / campus placement  -  first job', d:''},
      {v:'lateral-same',  t:'Lateral move  -  same role, better company or salary', d:''},
      {v:'promotion',     t:'Step up to the next level in the same field', d:''},
      {v:'career-switch', t:'Career switch  -  moving to a different field or role', d:''},
      {v:'freelance',     t:'Freelance / consulting / independent work', d:''},
      {v:'leadership',    t:'Senior / leadership / VP or above', d:''},
    ],
    key:'india-target-role', writeIn:false
  },

  'q-india-current-situation': {
    id:'q-india-current-situation', phase:3,
    q:'What is your current situation?',
    hint:'',
    opts:[
      {v:'employed-unhappy',  t:'Currently employed but want to move', d:''},
      {v:'employed-laid-off', t:'Currently employed but expecting / facing layoff', d:''},
      {v:'unemployed-recent', t:'Unemployed  -  left within the last 6 months', d:''},
      {v:'unemployed-long',   t:'Unemployed  -  gap of 1 year or more', d:''},
      {v:'student',           t:'Studying  -  looking for placement during or after degree', d:''},
      {v:'returning',         t:'Returning to India from abroad', d:''},
    ],
    key:'india-situation', writeIn:false
  },

  /* ══ INDIA SALARY SPECIFIC ══ */

  'q-salary-current': {
    id:'q-salary-current', phase:3,
    q:'What is your current annual salary (CTC)?',
    hint:'This is the baseline for your gap analysis. All figures are private and used only for your report.',
    opts:[
      {v:'0-3lpa',   t:'\u20b9 Under 3 LPA', d:''},
      {v:'3-7lpa',   t:'\u20b9 3 - 7 LPA', d:''},
      {v:'7-12lpa',  t:'\u20b9 7 - 12 LPA', d:''},
      {v:'12-20lpa', t:'\u20b9 12 - 20 LPA', d:''},
      {v:'20-35lpa', t:'\u20b9 20 - 35 LPA', d:''},
      {v:'35-60lpa', t:'\u20b9 35 - 60 LPA', d:''},
      {v:'60lpa+',   t:'\u20b9 Above 60 LPA', d:''},
      {v:'prefer-not',t:'Prefer not to say', d:''},
    ],
    key:'salary-current', writeIn:false
  },

  'q-salary-target': {
    id:'q-salary-target', phase:4,
    q:'What is your target salary  -  what do you believe you should be earning?',
    hint:'Be honest. This gap between current and target is what your action plan is built around.',
    opts:[
      {v:'5-10lpa',   t:'\u20b9 5 - 10 LPA', d:''},
      {v:'10-20lpa',  t:'\u20b9 10 - 20 LPA', d:''},
      {v:'20-35lpa',  t:'\u20b9 20 - 35 LPA', d:''},
      {v:'35-60lpa',  t:'\u20b9 35 - 60 LPA', d:''},
      {v:'60-100lpa', t:'\u20b9 60 - 100 LPA', d:''},
      {v:'100lpa+',   t:'\u20b9 Above 100 LPA', d:''},
    ],
    key:'salary-target', writeIn:false
  },

  'q-salary-blocker': {
    id:'q-salary-blocker', phase:4,
    q:'What do you think is the main reason your salary has not grown?',
    hint:'Select the most honest answer. Your report will address this directly.',
    opts:[
      {v:'skill-gap',        t:'I lack specific skills my market peers have', d:''},
      {v:'no-cert',          t:'I do not have the certifications recruiters filter for', d:''},
      {v:'company-ceiling',  t:'My current company / role has a salary ceiling', d:''},
      {v:'no-interview',     t:'I get interviews but fail at the offer stage', d:''},
      {v:'no-applications',  t:'I am not applying actively enough', d:''},
      {v:'profile-weak',     t:'My CV and LinkedIn are not attracting the right attention', d:''},
      {v:'not-sure',         t:'I am not sure  -  I need an honest external assessment', d:''},
    ],
    key:'salary-blocker', writeIn:false
  },

  /* ══ UPSKILL SPECIFIC ══ */

  'q-upskill-goal': {
    id:'q-upskill-goal', phase:3,
    get q(){ return 'What specifically do you want to achieve by upskilling?'; },
    hint:'Be honest  -  this shapes the entire plan in your report.',
    opts:[
      {v:'get-promoted',    t:'Get promoted to the next level in my current role',    d:''},
      {v:'switch-role',     t:'Move into a different role or specialisation',         d:''},
      {v:'get-hired',       t:'Land a better job at a better company',                d:''},
      {v:'freelance',       t:'Build skills to freelance or consult independently',   d:''},
      {v:'start-business',  t:'Build the skills to launch my own product or business',d:''},
      {v:'international',   t:'Qualify for international opportunities in my field',  d:''},
      {v:'stay-relevant',   t:'Stay current with new tools or technologies in my field', d:''},
    ],
    key:'upskill-goal', writeIn:false
  },

  'q-upskill-level': {
    id:'q-upskill-level', phase:4,
    get q(){ return 'How would you honestly describe your current skill level in '+getFieldDisplay(A.field)+'?'; },
    hint:'This is not about your job title  -  it is about your actual working competency.',
    opts:[
      {v:'beginner',     t:'Beginner  -  I know the basics but have never done this professionally', d:''},
      {v:'practitioner', t:'Practitioner  -  I do this in my current role but am not confident in all areas', d:''},
      {v:'competent',    t:'Competent  -  solid in most areas, some specific gaps to fill', d:''},
      {v:'advanced',     t:'Advanced  -  strong practitioner, want to reach expert level', d:''},
      {v:'expert',       t:'Expert  -  want to formalise or signal my expertise externally', d:''},
    ],
    key:'upskill-level', writeIn:false
  },


  /* ══════════════════════════════════
     DEEP CONDITIONAL QUESTIONS
     These only appear when the specific
     goal+field+exp combination makes
     them relevant. Each question is
     shown only when it changes what
     the report says.
  ══════════════════════════════════ */

  /* ── Target certification (upskill) ── */
  'q-upskill-target-cert': {
    id:'q-upskill-target-cert', phase:3,
    get q(){
      var f=A.field||'';
      if(f==='business-pm') return 'Which specific certification or skill area are you targeting?';
      if(f==='stem-cs') return 'Which technical area or certification are you targeting?';
      if(f==='stem-engineering') return 'Which engineering certification or specialisation are you targeting?';
      if(f.indexOf('health-')===0) return 'Which clinical certification or advanced practice area are you targeting?';
      if(f==='business-finance') return 'Which finance certification are you targeting?';
      return 'Which specific certification or skill are you targeting?';
    },
    get hint(){
      var f=A.field||'';
      var e=parseInt(A.experience||'0');
      if(f==='business-pm'&&e<2) return 'With under 2 years experience, only CAPM is open to you right now. PMP requires a minimum of 24 months leading projects.';
      if(f==='business-pm'&&e>=2&&e<5) return 'With 2–4 years experience and a degree, PMP is borderline  -  it depends on how much of that time was spent leading projects, not just working on them.';
      if(f==='business-pm'&&e>=5) return 'With '+e+' years experience and a degree, you are eligible for PMP. The question is whether it is the right investment given your specific goal.';
      return 'Select the most specific option you can. If you are unsure, select "Explore options first" and your report will map the landscape for you.';
    },
    get opts(){
      var f=A.field||'';
      var e=parseInt(A.experience||'0');
      var qual=A.qualification||'bachelors';
      var hasDegree=qual==='bachelors'||qual==='bachelors-honours'||qual==='masters'||qual==='phd';
      if(f==='business-pm'||f==='business-pm'){
        var opts=[
          {v:'explore',t:'Explore options first  -  not sure which cert is right',d:'Your report will map the full PM certification landscape and make a recommendation for your profile.'},
          {v:'pmp',t:'PMP  -  Project Management Professional',d:'PMI. Requires '+( hasDegree?'24':'36')+' months leading projects. The gold standard for project managers globally.'},
          {v:'capm',t:'CAPM  -  Certified Associate in Project Management',d:'PMI. No experience required. Entry-level cert. Often done before PMP.'},
          {v:'prince2',t:'PRINCE2 Foundation or Practitioner',d:'Axelos. Dominant in UK, Australia, government. No experience required for Foundation.'},
          {v:'csm',t:'CSM  -  Certified Scrum Master',d:'Scrum Alliance. 2-day course. Widely requested in tech companies. No experience requirement.'},
          {v:'psm',t:'PSM  -  Professional Scrum Master (Scrum.org)',d:'Harder than CSM. Exam-based. More respected technically.'},
          {v:'safe-agilist',t:'SAFe Agilist',d:'Scaled Agile. Relevant at enterprise/large org level.'},
          {v:'pmi-acp',t:'PMI-ACP  -  Agile Certified Practitioner',d:'PMI. Requires 21 hours agile education + 8 months agile projects. More rigorous than CSM.'},
          {v:'pgmp',t:'PgMP  -  Program Management Professional',d:'PMI. Senior cert for managing multiple projects. Requires 4+ years program management.'},
        ];
        // Filter out certs the person is clearly ineligible for
        if(e<3) opts=opts.filter(function(o){return o.v!=='pgmp'&&o.v!=='pmi-acp';});
        if(e<1) opts=opts.filter(function(o){return o.v!=='pmp';});
        return opts;
      }
      if(f==='stem-cs'||f==='stem-cs'){
        return [
          {v:'explore',t:'Explore options first',d:''},
          {v:'aws-saa',t:'AWS Solutions Architect Associate',d:'Amazon. Most popular cloud cert globally. Exam only. 10–15 hours study recommended.'},
          {v:'aws-pro',t:'AWS Solutions Architect Professional',d:'Advanced. Requires SAA or equivalent experience. Much harder.'},
          {v:'gcp-ace',t:'Google Cloud Associate Cloud Engineer',d:'Google. Popular for GCP-heavy organisations.'},
          {v:'az-900',t:'Microsoft Azure Fundamentals (AZ-900)',d:'Entry level. Good starting point if using Azure stack.'},
          {v:'az-104',t:'Microsoft Azure Administrator (AZ-104)',d:'Mid-level. Requires real Azure experience.'},
          {v:'cka',t:'CKA  -  Certified Kubernetes Administrator',d:'CNCF. Hands-on exam. High demand in DevOps/platform engineering.'},
          {v:'ckad',t:'CKAD  -  Certified Kubernetes Application Developer',d:'Developer-focused Kubernetes cert.'},
          {v:'ceh',t:'CEH  -  Certified Ethical Hacker',d:'EC-Council. Cybersecurity focus. Not the most respected but very commonly requested by employers.'},
          {v:'cissp',t:'CISSP  -  Certified Information Systems Security Professional',d:'ISC². Requires 5 years experience. The gold standard for senior security professionals.'},
          {v:'terraform',t:'HashiCorp Terraform Associate',d:'Infrastructure-as-code. Increasingly required for cloud/DevOps roles.'},
          {v:'ml-gcp',t:'Google Professional ML Engineer',d:'Machine learning focused. Requires solid ML fundamentals.'},
        ];
      }
      if(f==='business-finance'){
        return [
          {v:'explore',t:'Explore options first',d:''},
          {v:'cfa-1',t:'CFA Level 1',d:'CFA Institute. 300 hours study. Global standard for investment analysis. No work experience required to sit Level 1.'},
          {v:'cfa-2',t:'CFA Level 2',d:'Requires passing Level 1. Significantly harder. Corporate finance and equity valuation focus.'},
          {v:'cfa-3',t:'CFA Level 3',d:'Portfolio management and wealth management focus. Final level.'},
          {v:'cpa',t:'CPA  -  Certified Public Accountant',d:'AICPA (USA). Requires 150 credit hours of education. State-specific licensing.'},
          {v:'ca-icai',t:'CA  -  Chartered Accountant (ICAI)',d:'Institute of Chartered Accountants of India. Most rigorous Indian finance qualification.'},
          {v:'acca',t:'ACCA  -  Association of Chartered Certified Accountants',d:'UK-based. Globally recognised. Can complete while working. No strict experience requirement to start.'},
          {v:'frm',t:'FRM  -  Financial Risk Manager',d:'GARP. Risk management focus. Requires passing 2 exams. Good for banking/insurance.'},
          {v:'cma',t:'CMA  -  Certified Management Accountant',d:'IMA. 2 exams. Financial planning and analysis focus. Popular for corporate finance roles.'},
        ];
      }
      if(f==='stem-engineering'){
        return [
          {v:'explore',t:'Explore options first',d:''},
          {v:'pe',t:'PE  -  Professional Engineer (USA)',d:'NCEES. Requires passing FE exam first, then 4 years experience. Required for independent practice in USA.'},
          {v:'charteng',t:'Chartered Engineer (CEng)  -  UK',d:'Engineering Council. Requires degree + significant experience. Highest professional recognition in UK.'},
          {v:'pmp',t:'PMP for Engineering Managers',d:'PMI. Relevant if moving into project/programme management within engineering.'},
          {v:'six-sigma-gb',t:'Six Sigma Green Belt',d:'Process improvement. Widely used in manufacturing, operations, quality management.'},
          {v:'six-sigma-bb',t:'Six Sigma Black Belt',d:'Advanced process improvement. Requires Green Belt or equivalent experience.'},
          {v:'lean',t:'Lean Manufacturing / Lean Practitioner',d:'Waste reduction methodology. Essential for manufacturing and operations.'},
          {v:'bim',t:'BIM Certification (Civil/Construction)',d:'Building Information Modelling. Required for major UK/Australian construction projects.'},
        ];
      }
      // Default
      return [
        {v:'explore',t:'Explore options in my field',d:'Your report will map the certification landscape for your specific profession.'},
        {v:'specific',t:'I know the specific cert I want  -  I will describe it',d:''},
      ];
    },
    key:'target-cert', writeIn:true, writeInLabel:'Different certification  -  I will specify...'
  },

  /* ── PMP eligibility deep-dive ── */
  'q-pmp-project-months': {
    id:'q-pmp-project-months', phase:4,
    get q(){
      var qual=A.qualification||'bachelors';
      var hasDeg=qual==='bachelors'||qual==='bachelors-honours'||qual==='masters'||qual==='phd';
      return 'PMP requires '+(hasDeg?'24':'36')+' months of experience leading projects. Of your '+A.experience+' year'+(parseInt(A.experience||'0')===1?'':'s')+' in '+getFieldDisplay(A.field)+', how many months were spent actively leading a project  -  owning the plan, the team, and the delivery?';
    },
    hint:'Be honest  -  PMI audits applications. "Leading" means you were responsible for the outcome, not just a team member contributing to it.',
    opts:[
      {v:'under-12',  t:'Under 12 months',     d:''},
      {v:'12-23',     t:'12 to 23 months',      d:''},
      {v:'24-35',     t:'24 to 35 months',      d:'PMI requirement met if you hold a degree.'},
      {v:'36-plus',   t:'36 months or more',    d:'PMI requirement met with or without a degree.'},
      {v:'not-sure',  t:'Not sure  -  I have managed work but not sure if it counts as "leading"', d:''},
    ],
    key:'pmp-project-months', writeIn:false
  },

  /* ── Existing certifications (multi-select) ── */
  'q-existing-certs': {
    id:'q-existing-certs', phase:4,
    get q(){ return 'Which certifications or formal qualifications do you already hold?'; },
    hint:'Select all that apply. This prevents your report from recommending things you already have, and identifies what you can skip.',
    get opts(){
      var f=A.field||'';
      if(f==='business-pm') return [
        {v:'none',t:'None  -  no certifications yet',d:''},
        {v:'capm',t:'CAPM (PMI)',d:''},
        {v:'prince2-f',t:'PRINCE2 Foundation',d:''},
        {v:'prince2-p',t:'PRINCE2 Practitioner',d:''},
        {v:'csm',t:'CSM / CSPO (Scrum Alliance)',d:''},
        {v:'psm',t:'PSM / PSPO (Scrum.org)',d:''},
        {v:'safe',t:'SAFe Agilist or higher',d:''},
        {v:'pmi-acp',t:'PMI-ACP',d:''},
        {v:'mba',t:'MBA (any institution)',d:''},
        {v:'six-sigma',t:'Six Sigma (any level)',d:''},
      ];
      if(f==='stem-cs') return [
        {v:'none',t:'None  -  no certifications yet',d:''},
        {v:'aws-saa',t:'AWS Solutions Architect Associate',d:''},
        {v:'aws-dev',t:'AWS Developer / SysOps',d:''},
        {v:'aws-pro',t:'AWS Professional (any)',d:''},
        {v:'gcp',t:'Google Cloud (any)',d:''},
        {v:'azure',t:'Microsoft Azure (any)',d:''},
        {v:'cka',t:'CKA / CKAD',d:''},
        {v:'terraform',t:'Terraform Associate',d:''},
        {v:'cissp',t:'CISSP or CISM',d:''},
        {v:'ceh',t:'CEH or CompTIA Security+',d:''},
      ];
      if(f==='business-finance') return [
        {v:'none',t:'None  -  no certifications yet',d:''},
        {v:'cfa-1',t:'CFA Level 1 passed',d:''},
        {v:'cfa-2',t:'CFA Level 2 passed',d:''},
        {v:'cfa-charter',t:'CFA Charterholder',d:''},
        {v:'acca-part',t:'ACCA (partial  -  some papers passed)',d:''},
        {v:'acca-full',t:'ACCA (fully qualified)',d:''},
        {v:'ca-icai',t:'CA (ICAI)',d:''},
        {v:'frm-1',t:'FRM Part 1',d:''},
        {v:'frm',t:'FRM (both parts)',d:''},
        {v:'cma',t:'CMA',d:''},
      ];
      return [
        {v:'none',t:'None  -  no certifications yet',d:''},
        {v:'has-some',t:'Yes  -  I have some (I will describe in the write-in)',d:''},
      ];
    },
    key:'existing-certs', multi:true, writeIn:true, writeInLabel:'Other certifications...'
  },

  /* ── PHD specific: research sub-area ── */
  'q-phd-subfield': {
    id:'q-phd-subfield', phase:3,
    get q(){ return 'What is your specific research area within '+getFieldDisplay(A.field)+'?'; },
    hint:'Be as specific as possible. "Computer Science" is not enough  -  "machine learning applied to healthcare imaging" is. The more specific you are, the more precisely your report can identify supervisors and funding bodies.',
    get opts(){
      var f=A.field||'';
      if(f==='stem-cs') return [
        {v:'ai-ml',t:'Artificial Intelligence or Machine Learning',d:'Supervised/unsupervised learning, deep learning, reinforcement learning.'},
        {v:'nlp',t:'Natural Language Processing',d:'Text analysis, language models, computational linguistics.'},
        {v:'cv',t:'Computer Vision',d:'Image recognition, object detection, medical imaging AI.'},
        {v:'security',t:'Cybersecurity / Information Security',d:'Cryptography, network security, privacy, formal verification.'},
        {v:'systems',t:'Systems / Distributed Computing',d:'Operating systems, distributed databases, cloud infrastructure.'},
        {v:'hci',t:'Human-Computer Interaction',d:'UX research, accessibility, social computing.'},
        {v:'theory',t:'Theoretical Computer Science',d:'Algorithms, complexity theory, formal methods.'},
        {v:'data-eng',t:'Data Engineering or Databases',d:'Data systems, query optimisation, data pipelines.'},
        {v:'bioinformatics',t:'Bioinformatics / Computational Biology',d:'Genomics, drug discovery, health data.'},
        {v:'robotics',t:'Robotics or Autonomous Systems',d:''},
      ];
      if(f==='stem-engineering') return [
        {v:'structural',t:'Structural or Civil Engineering',d:''},
        {v:'mechanical',t:'Mechanical or Aerospace Engineering',d:''},
        {v:'electrical',t:'Electrical or Power Systems',d:''},
        {v:'chemical',t:'Chemical or Process Engineering',d:''},
        {v:'materials',t:'Materials Science',d:''},
        {v:'environmental',t:'Environmental or Sustainability Engineering',d:''},
        {v:'biomedical',t:'Biomedical Engineering',d:''},
        {v:'manufacturing',t:'Manufacturing or Industrial Engineering',d:''},
      ];
      if(f==='stem-biomed') return [
        {v:'genomics',t:'Genomics or Molecular Biology',d:''},
        {v:'cancer',t:'Cancer Biology or Oncology',d:''},
        {v:'neuro',t:'Neuroscience',d:''},
        {v:'immunology',t:'Immunology',d:''},
        {v:'drug-discovery',t:'Drug Discovery or Pharmacology',d:''},
        {v:'biotech',t:'Biotechnology or Synthetic Biology',d:''},
        {v:'epidemiology',t:'Epidemiology or Public Health',d:''},
        {v:'bioinformatics',t:'Bioinformatics or Computational Biology',d:''},
      ];
      if(f==='social-policy') return [
        {v:'development',t:'International Development or Global Health',d:''},
        {v:'education-policy',t:'Education Policy',d:''},
        {v:'health-policy',t:'Health Policy',d:''},
        {v:'climate',t:'Climate or Environmental Policy',d:''},
        {v:'migration',t:'Migration, Refugees, or Human Rights',d:''},
        {v:'governance',t:'Governance, Institutions, or Democracy',d:''},
        {v:'economics',t:'Development Economics',d:''},
      ];
      // Generic fallback
      return [
        {v:'applied',t:'Applied research  -  solving a practical problem',d:''},
        {v:'theoretical',t:'Theoretical / foundational research',d:''},
        {v:'interdisciplinary',t:'Interdisciplinary  -  crossing two or more fields',d:''},
      ];
    },
    key:'phd-subfield', writeIn:true, writeInLabel:'My specific area is...'
  },

  /* ── PHD: undergraduate grade (critical for funding eligibility) ── */
  'q-phd-ugrad-grade': {
    id:'q-phd-ugrad-grade', phase:3,
    get q(){
      return 'What grade or classification did you achieve in your Bachelor\u2019s degree?';
    },
    hint:'This is one of the strongest predictors of funded PhD eligibility. UK universities use the 1st/2:1/2:2 scale. If you studied in India, use your percentage or CGPA.',
    opts:[
      {v:'first',    t:'First Class Honours / Distinction / 75% or above / CGPA 8.5+', d:'Competitive for UKRI, top Russell Group, and Ivy League funded positions.'},
      {v:'upper-two',t:'Upper Second / 2:1 / 60–74% / CGPA 7.0–8.4',                 d:'Eligible for most funded programmes. Strong at mid-to-top universities.'},
      {v:'lower-two',t:'Lower Second / 2:2 / 50–59% / CGPA 6.0–6.9',                 d:'Very limited funded options. Research experience matters more at this grade.'},
      {v:'third',    t:'Third / Pass / Below 50%',                                     d:'Most funded PhD routes are not accessible without additional research qualifications.'},
      {v:'masters-override',t:'My Bachelor\u2019s was not strong but I hold a Master\u2019s with a strong grade', d:'A strong Master\u2019s can substitute for a weaker Bachelor\u2019s at some universities.'},
      {v:'not-disclosed',t:'Prefer not to disclose',d:''},
    ],
    key:'phd-ugrad-grade', writeIn:false
  },

};

/* ═══════════════════════════════════
   ADAPTIVE ROUTER
   One switch per goal  -  explicit, readable,
   no magic. Each goal gets its own path.
═══════════════════════════════════ */

var currentQId = 'q-goal';
var PHASE_NAMES = ['','Goal','Background','Target','Status','Details','Add-ons'];

function getNextQ(fromId){
  /* Name question always leads to goal */
  if(fromId==='q-name') return 'q-goal';
  var g = A.goal || '';

  /* ── PhD / Scholarship ── */
  if(g === 'phd-scholarship'){
    switch(fromId){
      case 'q-goal':        return 'q-field';
      case 'q-field':       return 'q-phd-subfield';
      case 'q-phd-subfield':return 'q-qual';
      case 'q-qual':
        /* Only ask for undergrad grade if bachelor's  -  most important for funding */
        if(A.qualification==='bachelors'||A.qualification==='bachelors-honours') return 'q-phd-ugrad-grade';
        return 'q-exp';
      case 'q-phd-ugrad-grade': return 'q-exp';
      case 'q-exp':         return 'q-target';
      case 'q-target':      return 'q-phd-funding';
      case 'q-phd-funding':
        if(A['phd-funding']==='self-funded') return 'q-english';
        return 'q-phd-proposal';
      case 'q-phd-proposal':return 'q-phd-publications';
      case 'q-phd-publications': return 'q-english';
      case 'q-english':     return 'q-timeline';
      case 'q-timeline':    return 'q-addons';
      case 'q-addons':      return null;
    }
  }

  /* ── Study Abroad (Masters / Undergrad) ── */
  if(g === 'study-abroad'){
    switch(fromId){
      case 'q-goal':        return 'q-field';
      case 'q-field':       return 'q-study-level';
      case 'q-study-level': return 'q-qual';
      case 'q-qual':        return 'q-study-grades';
      case 'q-study-grades':return 'q-target';
      case 'q-target':      return 'q-english';
      case 'q-english':     return 'q-timeline';
      case 'q-timeline':    return 'q-addons';
      case 'q-addons':      return null;
    }
  }

  /* ── International Job ── */
  if(g === 'job-international'){
    switch(fromId){
      case 'q-goal':        return 'q-field';
      case 'q-field':       return 'q-qual';
      case 'q-qual':        return 'q-exp';
      case 'q-exp':
        // Skip current-country q if gate pre-filled it
        if(A['current-country'] && A['current-country'] !== '') return 'q-target';
        return 'q-job-current-country';
      case 'q-job-current-country': return 'q-target';
      case 'q-target':      return 'q-job-salary';
      case 'q-job-salary':  return 'q-english';
      case 'q-english':     return 'q-job-visa-awareness';
      case 'q-job-visa-awareness': return 'q-timeline';
      case 'q-timeline':    return 'q-addons';
      case 'q-addons':      return null;
    }
  }

  /* ── Professional Registration ── */
  if(g === 'professional-registration'){
    switch(fromId){
      case 'q-goal':        return 'q-field';
      case 'q-field':       return 'q-qual';
      case 'q-qual':        return 'q-exp';
      case 'q-exp':         return 'q-reg-country';
      case 'q-reg-country': return 'q-reg-status';
      case 'q-reg-status':  return 'q-english';
      case 'q-english':     return 'q-reg-documents';
      case 'q-reg-documents':return 'q-timeline';
      case 'q-timeline':    return 'q-addons';
      case 'q-addons':      return null;
    }
  }

  /* ── India Job ── */
  if(g === 'india-job'){
    switch(fromId){
      case 'q-goal':                  return 'q-field';
      case 'q-field':                 return 'q-qual';
      case 'q-qual':                  return 'q-exp';
      case 'q-exp':                   return 'q-india-current-situation';
      case 'q-india-current-situation':return 'q-india-target-role';
      case 'q-india-target-role':     return 'q-timeline';
      case 'q-timeline':              return 'q-addons';
      case 'q-addons':                return null;
    }
  }

  /* ── India Salary ── */
  if(g === 'india-salary'){
    switch(fromId){
      case 'q-goal':          return 'q-field';
      case 'q-field':         return 'q-qual';
      case 'q-qual':          return 'q-exp';
      case 'q-exp':           return 'q-salary-current';
      case 'q-salary-current':return 'q-salary-target';
      case 'q-salary-target': return 'q-salary-blocker';
      case 'q-salary-blocker':return 'q-timeline';
      case 'q-timeline':      return 'q-addons';
      case 'q-addons':        return null;
    }
  }

  /* ── Upskill / Migrate / Other (simplified path) ── */
  switch(fromId){
    case 'q-goal':    return 'q-field';
    case 'q-field':   return 'q-qual';
    case 'q-qual':    return 'q-exp';
    case 'q-exp':
      if(g === 'upskill') return 'q-upskill-goal';
      if(g === 'migrate') return 'q-migrate-from';
      return 'q-target';
    case 'q-migrate-from': return 'q-target';
    case 'q-india-citizenship':
      if(A.qualification==='masters'||A.qualification==='phd') return 'q-masters-type';
      return 'q-timeline';
    case 'q-masters-type': return 'q-timeline';
    case 'q-upskill-goal': return 'q-upskill-target-cert';
    case 'q-upskill-target-cert':
      /* PMP deep-dive only if: field is PM, cert is PMP, exp is borderline */
      if((A.field==='business-pm')&&(A['target-cert']==='pmp')){
        var expYrs=parseInt(A.experience||'0');
        var hasDeg=A.qualification==='bachelors'||A.qualification==='bachelors-honours'||A.qualification==='masters'||A.qualification==='phd';
        /* Only ask if experience is 1-4 years (borderline) */
        if(expYrs>=1&&expYrs<=4) return 'q-pmp-project-months';
      }
      return 'q-existing-certs';
    case 'q-pmp-project-months': return 'q-existing-certs';
    case 'q-existing-certs': return 'q-upskill-level';
    case 'q-upskill-level': return 'q-timeline';
    case 'q-target':
      if(A.goal==='migrate'){
        var t=A['target-country']||'';
        /* return-india: ask citizenship then possibly masters type */
        if(t==='return-india') return 'q-india-citizenship';
        /* Other destinations where English test is not relevant */
        var noEnglishNeeded=(t==='uae'||t==='germany'||t==='singapore'||t==='usa'||t==='gulf-other');
        if(noEnglishNeeded) return 'q-timeline';
      }
      return 'q-english';
    case 'q-english': return 'q-timeline';
    case 'q-timeline':return 'q-addons';
    case 'q-addons':  return null;
    default:          return null;
  }
}

/* ── helpers ── */
function getQ(id){
  return QB[id] || null;
}

function totalQCount(){
  var count=0, id='q-goal', seen={};
  while(id && !seen[id] && count<20){
    seen[id]=true;
    /* Don't count q-addons in the total — it's a bonus step, not a real question */
    if(id!=='q-addons') count++;
    id=getNextQ(id);
  }
  return count;
}
function currentQNum(){ return hist.length + 1; }

function gateCountryToKey(c){
  var m={'India':'india','United Kingdom':'uk-current','United States':'usa-current',
    'Canada':'canada-current','Australia':'australia-current','UAE':'uae-current',
    'Nigeria':'nigeria-current','Philippines':'philippines-current','Sri Lanka':'sri-lanka-current',
    'Nepal':'nepal-current','Pakistan':'pakistan-current','Germany':'germany-current',
    'Ireland':'ireland-current','Singapore':'singapore-current','New Zealand':'nz-current'};
  return m[c]||'other-current';
}

function getSalaryOpts(){
  var cc = A['current-country'] || gateCountryToKey(P.country||'');
  if(cc==='india') return [
    {v:'none',t:'No income / full-time student',d:''},
    {v:'0-3lpa',t:'\u20b9 Under 3 LPA',d:'Under USD 4,000/year'},
    {v:'3-7lpa',t:'\u20b9 3-7 LPA',d:'USD 4,000-9,000/year'},
    {v:'7-15lpa',t:'\u20b9 7-15 LPA',d:'USD 9,000-18,000/year'},
    {v:'15-30lpa',t:'\u20b9 15-30 LPA',d:'USD 18,000-36,000/year'},
    {v:'30-60lpa',t:'\u20b9 30-60 LPA',d:'USD 36,000-72,000/year'},
    {v:'60lpa+',t:'\u20b9 Above 60 LPA',d:'Above USD 72,000/year'},
    {v:'prefer-not',t:'Prefer not to say',d:''},
  ];
  if(cc==='uk-current') return [
    {v:'none',t:'No income / full-time student',d:''},
    {v:'uk-u20k',t:'\u00a3 Under 20,000/year',d:''},
    {v:'uk-20-30',t:'\u00a3 20,000-30,000',d:''},
    {v:'uk-30-45',t:'\u00a3 30,000-45,000',d:''},
    {v:'uk-45-65',t:'\u00a3 45,000-65,000',d:''},
    {v:'uk-65-90',t:'\u00a3 65,000-90,000',d:''},
    {v:'uk-90k+',t:'\u00a3 Above 90,000',d:''},
    {v:'prefer-not',t:'Prefer not to say',d:''},
  ];
  if(cc==='usa-current') return [
    {v:'none',t:'No income / full-time student',d:''},
    {v:'usd-u40k',t:'USD Under 40,000',d:''},
    {v:'usd-40-70',t:'USD 40,000-70,000',d:''},
    {v:'usd-70-110',t:'USD 70,000-110,000',d:''},
    {v:'usd-110-160',t:'USD 110,000-160,000',d:''},
    {v:'usd-160plus',t:'USD Above 160,000',d:''},
    {v:'prefer-not',t:'Prefer not to say',d:''},
  ];
  if(cc==='canada-current') return [
    {v:'none',t:'No income / full-time student',d:''},
    {v:'cad-u40k',t:'CAD Under 40,000',d:''},
    {v:'cad-40-65',t:'CAD 40,000-65,000',d:''},
    {v:'cad-65-95',t:'CAD 65,000-95,000',d:''},
    {v:'cad-95-130',t:'CAD 95,000-130,000',d:''},
    {v:'cad-130plus',t:'CAD Above 130,000',d:''},
    {v:'prefer-not',t:'Prefer not to say',d:''},
  ];
  if(cc==='australia-current') return [
    {v:'none',t:'No income / full-time student',d:''},
    {v:'aud-u55k',t:'AUD Under 55,000',d:''},
    {v:'aud-55-80',t:'AUD 55,000-80,000',d:''},
    {v:'aud-80-110',t:'AUD 80,000-110,000',d:''},
    {v:'aud-110-150',t:'AUD 110,000-150,000',d:''},
    {v:'aud-150plus',t:'AUD Above 150,000',d:''},
    {v:'prefer-not',t:'Prefer not to say',d:''},
  ];
  return [
    {v:'none',t:'No income / full-time student',d:''},
    {v:'usd-u25k',t:'Under USD 25,000/year',d:''},
    {v:'usd-25-50',t:'USD 25,000-50,000',d:''},
    {v:'usd-50-90',t:'USD 50,000-90,000',d:''},
    {v:'usd-90-140',t:'USD 90,000-140,000',d:''},
    {v:'usd-140plus',t:'Above USD 140,000',d:''},
    {v:'prefer-not',t:'Prefer not to say',d:''},
  ];
}

function getAddonOpts(){
  var g = A.goal||'';
  var opts=[];
  if(g==='phd-scholarship'||g==='study-abroad'){
    opts.push({v:'scholarship-list',   t:'Full scholarship list with deadlines and eligibility', d:''});
    opts.push({v:'university-shortlist',t:'University shortlist matched to my profile', d:''});
    opts.push({v:'personal-statement', t:'Personal statement / SOP guidance', d:''});
  }
  if(g==='job-international'||g==='migrate'){
    opts.push({v:'visa-detail',   t:'Detailed visa routes, costs, and timelines', d:''});
    opts.push({v:'pr-pathway',    t:'Permanent residency and citizenship pathway', d:''});
    opts.push({v:'cv-guide',      t:'CV/resume format guide for target country', d:''});
  }
  if(g==='professional-registration'){
    opts.push({v:'doc-checklist', t:'Full document checklist for my specific registration', d:''});
    opts.push({v:'visa-detail',   t:'Visa route after registration is complete', d:''});
  }
  if(g==='india-job'){
    opts.push({v:'cv-review',     t:'CV review checklist against ATS standards', d:''});
    opts.push({v:'interview-prep',t:'Interview preparation framework for my target role', d:''});
  }
  if(g==='india-salary'){
    opts.push({v:'negotiation',   t:'Salary negotiation script and strategy', d:''});
    opts.push({v:'market-data',   t:'Market salary benchmarks for my role and city', d:''});
  }
  opts.push({v:'action-detail',   t:'Detailed week-by-week action plan', d:''});
  return opts;
}

/* ── RENDER ── */
function renderQ(q){
  if(!q){ console.error('renderQ called with null  -  check getQ()/router'); return; }
  var phase = q.phase||1;
  for(var i=1;i<=6;i++){
    var el=document.getElementById('ps'+i);
    if(el) el.className='prog-step'+(i<=phase?' on':'');
  }
  var total=totalQCount(), current=currentQNum();
  var pct=Math.round(((current-1)/Math.max(total,1))*95)+5;
  document.getElementById('pgFill').style.width=pct+'%';

  var numLabel;
  if(q.id==='q-addons'){
    numLabel='Final step  -  optional additions';
  } else {
    numLabel='Question '+current+' of '+total;
  }
  var qText=typeof q.q==='function'?q.q():(q.qFunc?q.qFunc():q.q);

  var html='<button class="back-btn" onclick="goBack()" style="'+(hist.length===0?'opacity:0;pointer-events:none':'')+'">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7-7 7 7 7"/></svg> Back</button>'
    +'<div class="q-num">'+numLabel+'</div>'
    +'<div class="q-main">'+qText+'</div>'
    +(q.hint?'<div class="q-hint">'+q.hint+'</div>':'');

  if(q.multi) html+='<div class="multi-hint">Select all that apply, then tap Continue</div>';

  var _opts;
  if(q.id==='q-job-salary') _opts=getSalaryOpts();
  else if(q.id==='q-addons') _opts=getAddonOpts();
  else _opts=(q.optsFunc?q.optsFunc():q.opts)||[];

  html+='<div class="opts" id="opts-container">';
  _opts.forEach(function(o){
    html+='<button class="opt" id="opt-'+o.v+'" onclick="selectOpt(\''+q.key+'\',\''+o.v+'\','+!!q.multi+',this)">'
      +'<div class="opt-radio"></div>'
      +'<div><div class="opt-t">'+o.t+'</div>'+(o.d?'<div class="opt-d">'+o.d+'</div>':'')+'</div>'
      +'</button>';
  });
  html+='</div>';

  if(q.writeIn){
    html+='<div class="or-divider"><span>or write your own</span></div>'
      +'<input class="write-in" id="write-in-field" placeholder="'+q.writeInLabel+'" oninput="handleWriteIn(\''+q.key+'\',this.value)">';
  }
  if(q.nameOnly){
    html+='<button class="gen-btn" onclick="submitName()" style="margin-top:20px">Continue</button>';
  } else if(q.multi && q.id!=='q-addons'){
    html+='<button class="gen-btn" onclick="nextQ()" style="margin-top:20px">Continue to next question</button>';
  } else if(q.writeIn && !q.nameOnly){
    /* Single-select with write-in: show Continue only when write-in has content */
    html+='<button class="gen-btn" id="writein-continue-btn" onclick="nextQ()" style="margin-top:16px;opacity:.4;pointer-events:none" disabled>Continue with my answer above</button>';
  }
  if(q.id==='q-addons'){
    html+='<button class="gen-btn" onclick="generateReport()" style="margin-top:28px;background:linear-gradient(135deg,#0a7c3e,#15803d);font-size:16px;padding:16px 32px;letter-spacing:.02em">Generate my report →</button>';
  }

  document.getElementById('q-container').innerHTML=html;

  var prevVal=A[q.key];
  if(prevVal&&!q.multi){var pb=document.getElementById('opt-'+prevVal);if(pb)pb.classList.add('sel');}
  if(prevVal&&q.multi){(prevVal||[]).forEach(function(v){var b=document.getElementById('opt-'+v);if(b)b.classList.add('sel');});}
  var wi=document.getElementById('write-in-field');
  if(wi&&prevVal&&typeof prevVal==='string'){
    var inOpts=_opts&&_opts.some(function(o){return o.v===prevVal;});
    if(!inOpts) wi.value=prevVal;
  }
  var ck=document.getElementById('page-checker');
  if(ck) window.scrollTo({top:ck.getBoundingClientRect().top+window.pageYOffset-80,behavior:'smooth'});
}

var OPTIONAL_KEYS=['salary','english','addons','timeline','reg-documents','visa-awareness',
                   'phd-publications','grades','salary-blocker','india-situation'];

function selectOpt(key,val,multi,btn){
  if(multi){
    btn.classList.toggle('sel');
    var arr=A[key]||[]; var idx=arr.indexOf(val);
    if(idx===-1) arr.push(val); else arr.splice(idx,1);
    A[key]=arr;
  } else {
    document.querySelectorAll('.opt').forEach(function(b){b.classList.remove('sel');});
    btn.classList.add('sel'); A[key]=val;
    var wi=document.getElementById('write-in-field'); if(wi) wi.value='';
    setTimeout(function(){nextQ();},380);
  }
}

function handleWriteIn(key,val){
  if(val.trim()){
    document.querySelectorAll('.opt').forEach(function(b){b.classList.remove('sel');});
    A[key]=val.trim();
    /* Enable the continue button when user has typed something */
    var btn=document.getElementById('writein-continue-btn');
    if(btn){btn.style.opacity='1';btn.style.pointerEvents='auto';btn.disabled=false;}
  } else {
    /* Disable if field cleared */
    var btn=document.getElementById('writein-continue-btn');
    if(btn&&!document.querySelector('.opt.sel')){btn.style.opacity='.4';btn.style.pointerEvents='none';btn.disabled=true;}
  }
}

function nextQ(){
  var q=getQ(currentQId);
  if(!A[q.key]||(Array.isArray(A[q.key])&&A[q.key].length===0)){
    if(OPTIONAL_KEYS.indexOf(q.key)!==-1){
      A[q.key]=q.multi?[]:'not-specified';
    } else {
      document.getElementById('q-container').style.outline='2px solid #dc2626';
      setTimeout(function(){document.getElementById('q-container').style.outline='';},800);
      return;
    }
  }
  hist.push(currentQId);
  var nextId=getNextQ(currentQId);
  if(nextId){currentQId=nextId; renderQ(getQ(currentQId));}
  else{generateReport();}
}

function goBack(){
  if(hist.length===0) return;
  currentQId=hist.pop();
  renderQ(getQ(currentQId));
}


/* ═══════════════════════════════════
   HELPERS & DATA
═══════════════════════════════════ */

function submitName(){
  var wi=document.getElementById('write-in-field');
  var val=(wi&&wi.value||'').trim();
  if(val){
    P.firstName=val;
    A._fn=val;
  }
  hist.push(currentQId);
  currentQId='q-goal';
  renderQ(getQ(currentQId));
}

function generateReport(){
  /* A['addons'] is already populated by selectOpt() as user clicks options.
     Sync addOns global from DOM as backup, but preserve any already-set values. */
  var addOnBtns=document.querySelectorAll('#opts-container .opt.sel');
  var domAddons=[];
  addOnBtns.forEach(function(b){domAddons.push(b.id.replace('opt-',''));});
  /* Use DOM values if present, otherwise keep what selectOpt already set */
  if(domAddons.length>0){addOns=domAddons; A['addons']=domAddons;}
  else if(!A['addons']){A['addons']=[];}
  document.getElementById('page-checker').style.display='none';
  document.getElementById('page-report').style.display='block';
  document.getElementById('page-report').classList.add('active');
  document.getElementById('report-html').innerHTML='<div style="text-align:center;padding:80px;color:#667085;font-size:16px">Building your personalised report...</div>';
  window.scrollTo({top:0,behavior:'instant'});
  setTimeout(buildFullReportTemplate,400);
}

/* Display helpers */
function getFieldDisplay(f){
  var m={'stem-engineering':'Engineering','stem-cs':'Computer Science / Software Engineering',
    'stem-biomed':'Biomedical / Life Sciences','stem-physics-chem':'Physics / Chemistry',
    'stem-env':'Environmental Science / Sustainability','health-medicine':'Medicine / MBBS',
    'health-nursing':'Nursing / Midwifery','health-physio':'Physiotherapy',
    'health-pharmacy':'Pharmacy','health-dentistry':'Dentistry',
    'health-allied':'Allied Health (OT / Radiography / Speech Therapy)',
    'business-finance':'Finance / Banking / Accounting','business-mgmt':'Business / Management / MBA',
    'business-pm':'Product / Project Management','business-marketing':'Marketing / Digital / Growth',
    'social-law':'Law / Legal','social-education':'Education / Teaching',
    'social-policy':'Public Policy / International Relations','social-psychology':'Psychology / Sociology',
    'creative-design':'UI/UX / Graphic / Product Design','creative-architecture':'Architecture',
    'creative-arts':'Fine Arts / Media / Film'};
  return m[f]||(f||'your field');
}

function getGoalDisplay(g){
  var m={'phd-scholarship':'Funded PhD / Scholarship','study-abroad':'University Study Abroad',
    'job-international':'International Job Search','professional-registration':'Professional Registration Abroad',
    'india-job':'Job Placement in India','india-salary':'Salary Enhancement in India',
    'upskill':'Professional Upskilling','migrate':'Permanent Migration'};
  return m[g]||(g||'Career Goal').replace(/-/g,' ').replace(/\b[a-z]/g,function(c){return c.toUpperCase();});
}

function getCountryDisplay(c){
  var m={uk:'United Kingdom',usa:'United States',canada:'Canada',australia:'Australia',
    germany:'Germany',ireland:'Ireland',netherlands:'Netherlands',singapore:'Singapore',
    'new-zealand':'New Zealand',uae:'UAE',india:'India',open:'Global',
    'return-india':'India (returning home)','gulf-other':'Gulf Region'};
  return m[c]||c||'your target country';
}

function getQualDisplay(q){
  var m={
    'high-school':'High School / 12th Standard',
    'diploma':'Diploma',
    'bachelors':"Bachelor's Degree",
    'bachelors-honours':"Bachelor's with Honours / First Class",
    'student-bachelors':'Bachelor degree (currently in progress)',
    'student-mba':'MBA (currently in progress)',
    'student-masters':"Master's degree (currently in progress)",
    'masters':"Master's Degree",
    'phd-student':'PhD (currently in progress)',
    'phd':'PhD / Doctoral Degree',
    'professional-cert':'Professional Certification'
  };
  return m[q]||q||'degree';
}

function isStudent(qual){
  return qual==='student-bachelors'||qual==='student-mba'||qual==='student-masters'||qual==='phd-student';
}

function effectiveQual(qual){
  /* For eligibility purposes, treat in-progress quals as the completed version */
  var m={'student-bachelors':'bachelors','student-mba':'masters','student-masters':'masters','phd-student':'masters'};
  return m[qual]||qual;
}

/* ═══════════════════════════════════
   DESIGN SYSTEM
   Light sections: bg #ffffff, text #0f172a
   Dark sections:  bg #0f172a, text #f1f5f9
   Accent sections: bg #f8fafc (off-white), text #0f172a
   No min-height anywhere. No whitespace gaps.
═══════════════════════════════════ */

/* Section wrapper  -  handles all background + spacing */
function section(bg,content,extraStyle){
  var textColor=_isDark(bg)?'#f1f5f9':'#0f172a';
  return '<div style="background:'+bg+';'+(extraStyle||'')+'">'
    +'<div style="max-width:900px;margin:0 auto;padding:48px 44px;font-family:Inter,sans-serif;color:'+textColor+'">'
    +content
    +'</div></div>';
}

function _isDark(bg){
  // detect dark colours
  return bg.indexOf('#0')===0||bg.indexOf('linear-gradient(135deg,#0')===0||bg.indexOf('linear-gradient(150deg')===0||bg.indexOf('#1')===0;
}

/* Section heading  -  adapts text colour to background */
function sectionHead(title,subtitle,accentColor,dark){
  var ac=accentColor||'#00B3A4';
  var titleColor=dark?'#f8fafc':'#0f172a';
  var subColor=dark?'rgba(255,255,255,.58)':'#64748b';
  return '<div style="margin-bottom:36px">'
    +'<span style="font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:'+ac+';display:block;margin-bottom:12px;font-family:Inter,sans-serif">The Tutorment</span>'
    +'<h2 style="font-size:28px;font-weight:800;font-family:Manrope,Inter,sans-serif;color:'+titleColor+';line-height:1.2;margin:0 0 10px 0">'+title+'</h2>'
    +(subtitle?'<p style="font-size:14px;color:'+subColor+';margin:0;line-height:1.65">'+subtitle+'</p>':'')
    +'<div style="height:3px;background:linear-gradient(90deg,'+ac+' 0%,'+ac+'44 60%,transparent 100%);margin-top:20px;border-radius:2px;-webkit-print-color-adjust:exact;print-color-adjust:exact"></div>'
    +'</div>';
}

/* Info box  -  always on white/light backgrounds */
function infoBox(color,title,body){
  var palette={
    blue: {bg:'#eff6ff',left:'#1d4ed8',titleC:'#1e3a8a',bodyC:'#1e293b'},
    green:{bg:'#f0fdf4',left:'#16a34a',titleC:'#14532d',bodyC:'#1e293b'},
    amber:{bg:'#fffbeb',left:'#d97706',titleC:'#92400e',bodyC:'#1e293b'},
    red:  {bg:'#fef2f2',left:'#dc2626',titleC:'#991b1b',bodyC:'#1e293b'},
    teal: {bg:'#f0fdfa',left:'#0d9488',titleC:'#134e4a',bodyC:'#1e293b'},
    navy: {bg:'#eef2ff',left:'#0A2E73',titleC:'#0A2E73',bodyC:'#1e293b'},
  }[color]||{bg:'#eff6ff',left:'#1d4ed8',titleC:'#1e3a8a',bodyC:'#1e293b'};
  return '<div style="background:'+palette.bg+';border-left:4px solid '+palette.left+';border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:20px">'
    +'<div style="font-size:11px;font-weight:800;color:'+palette.titleC+';text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">'+title+'</div>'
    +'<p style="font-size:13.5px;color:'+palette.bodyC+';line-height:1.78;margin:0">'+body+'</p></div>';
}

/* Stat tile */
function statTile(value,label,sub,bg,tc){
  var b=bg||'#eff6ff'; var t=tc||'#0A2E73';
  return '<div style="background:'+b+';border-radius:12px;padding:22px 18px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact">'
    +'<div style="font-size:30px;font-weight:800;color:'+t+';line-height:1;font-family:Manrope,Inter,sans-serif">'+value+'</div>'
    +'<div style="font-size:11px;font-weight:700;color:'+t+';margin-top:7px;text-transform:uppercase;letter-spacing:.06em">'+label+'</div>'
    +(sub?'<div style="font-size:11px;color:'+t+'bb;margin-top:4px;line-height:1.4">'+sub+'</div>':'')
    +'</div>';
}

/* Timeline step */
function timelineStep(num,color,title,body,badge){
  return '<div style="display:flex;gap:18px;margin-bottom:24px">'
    +'<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center">'
    +'<div style="width:42px;height:42px;border-radius:50%;background:'+color+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;-webkit-print-color-adjust:exact;print-color-adjust:exact;flex-shrink:0">'+num+'</div>'
    +'<div style="width:2px;flex:1;background:#e2e8f0;margin-top:6px;min-height:24px"></div>'
    +'</div>'
    +'<div style="padding-bottom:20px;flex:1">'
    +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">'
    +'<div style="font-size:15px;font-weight:700;color:#0f172a">'+title+'</div>'
    +(badge?'<span style="font-size:10px;font-weight:700;background:'+color+'1a;color:'+color+';padding:3px 10px;border-radius:20px;-webkit-print-color-adjust:exact;print-color-adjust:exact;border:1px solid '+color+'44">'+badge+'</span>':'')
    +'</div>'
    +'<p style="font-size:13.5px;color:#475569;line-height:1.72;margin:0">'+body+'</p>'
    +'</div></div>';
}

/* Data table */
function reqTable(rows,dark){
  var headBg=dark?'rgba(255,255,255,.06)':'#f1f5f9';
  var rowABg=dark?'rgba(255,255,255,.03)':'#f8fafc';
  var rowBBg=dark?'transparent':'#ffffff';
  var labelC=dark?'#94a3b8':'#64748b';
  var valC=dark?'#f1f5f9':'#0f172a';
  var borderC=dark?'rgba(255,255,255,.08)':'#e2e8f0';
  return '<table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid '+borderC+';margin-bottom:24px"><tbody>'
    +rows.map(function(r,i){
      return '<tr style="border-bottom:1px solid '+borderC+';background:'+(i%2===0?rowABg:rowBBg)+'">'
        +'<td style="padding:11px 16px;font-size:12.5px;font-weight:700;color:'+labelC+';width:32%;text-transform:uppercase;letter-spacing:.04em">'+r[0]+'</td>'
        +'<td style="padding:11px 16px;font-size:13.5px;color:'+valC+';line-height:1.6">'+r[1]+'</td>'
        +'</tr>';
    }).join('')+'</tbody></table>';
}

/* Readiness meter bar */
function meter(label,val,color,dark){
  var p=Math.min(100,Math.round(val));
  var labelC=dark?'#cbd5e1':'#475569';
  var trackC=dark?'rgba(255,255,255,.1)':'#e2e8f0';
  var badgeBg=dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)';
  return '<div style="margin-bottom:16px">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
    +'<span style="font-size:13px;font-weight:600;color:'+labelC+'">'+label+'</span>'
    +'<span style="font-size:12px;font-weight:700;color:'+color+';background:'+badgeBg+';padding:2px 9px;border-radius:4px">'+p+'%</span>'
    +'</div>'
    +'<div style="height:7px;background:'+trackC+';border-radius:4px;overflow:hidden">'
    +'<div style="height:7px;width:'+p+'%;background:'+color+';border-radius:4px;-webkit-print-color-adjust:exact;print-color-adjust:exact"></div>'
    +'</div></div>';
}

function doPrint(){
  var s=document.getElementById('pfs');
  if(!s){s=document.createElement('style');s.id='pfs';
    s.textContent='*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}';
    document.head.appendChild(s);}
  setTimeout(function(){window.print();},100);
}

/* Legacy shim  -  page() used in old builder calls, now maps to section() */
function page(id,content){
  var bgs={
    profile:'#111827',
    action:'#0f172a',
    position:'#f8fafc',
    skills:'#ffffff',
    pathway:'#f0f6ff',
  };
  return section(bgs[id]||'#ffffff',content);
}


/* ═══════════════════════════════════
   COVER PAGE  -  tight, no whitespace
═══════════════════════════════════ */
function buildCover(name,fieldDisplay,goalDisplay,targetDisplay,readinessScore,date,RD){
  var sc=readinessScore>=70?'#4ade80':readinessScore>=50?'#fbbf24':'#f87171';
  var fn=name&&name!=='there'?name.split(' ')[0]:'';
  return '<div style="background:linear-gradient(150deg,#040c1f 0%,#0a1c4d 40%,#0A2E73 75%,#1565c0 100%);font-family:Inter,sans-serif">'
    // topbar
    +'<div style="padding:13px 44px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.1)">'
    +'<div style="display:flex;align-items:center;gap:10px">'
    +'<div style="width:30px;height:30px;border-radius:6px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">'
    +'<div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#0A2E73,#1E88E5)"></div></div>'
    +'<span style="color:#fff;font-size:14px;font-weight:700">The Tutorment</span></div>'
    +'<div style="display:flex;align-items:center;gap:14px">'
    +'<span style="color:rgba(255,255,255,.45);font-size:12px">thetutorment.com</span>'
    +'<button onclick="doPrint()" class="no-print" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:11px;font-weight:600;padding:5px 12px;border-radius:4px;cursor:pointer;font-family:inherit">Save PDF</button>'
    +'</div></div>'
    // body
    +'<div style="padding:40px 44px 36px">'
    +'<div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:10px">Personalised Career Eligibility Report</div>'
    +'<h1 style="font-size:clamp(28px,4vw,42px);font-weight:800;color:#fff;line-height:1.15;margin:0 0 8px;font-family:Manrope,Inter,sans-serif">'+(fn?fn+'\u2019s':'Your')+' Career Report</h1>'
    +'<p style="font-size:15px;color:rgba(255,255,255,.6);margin:0 0 28px;line-height:1.5">'+fieldDisplay+' \u00b7 '+goalDisplay+'</p>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:30px">'
    +(RD&&RD.blockers&&RD.blockers.length?'<div style="background:rgba(220,38,38,.15);border:1px solid rgba(220,38,38,.4);border-radius:7px;padding:10px 16px;margin-bottom:20px"><span style="font-size:11px;font-weight:800;color:#fca5a5;text-transform:uppercase;letter-spacing:.07em">'+RD.blockers.length+' Critical blocker'+(RD.blockers.length>1?'s':'')+' identified</span><p style="font-size:12.5px;color:rgba(255,255,255,.75);margin:4px 0 0;line-height:1.5">'+RD.blockers[0].factor+'  -  see Section 1 of your report for the specific fix required.</p></div>':'')
    +[['Target',targetDisplay,'#fff'],['Readiness',readinessScore+'%',sc],['Report Date',date,'#fff']].map(function(c){
      return '<div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:7px;padding:11px 16px">'
        +'<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.4);margin-bottom:4px">'+c[0]+'</div>'
        +'<div style="font-size:14px;font-weight:700;color:'+c[2]+'">'+c[1]+'</div></div>';
    }).join('')+'</div>'
    +'<div style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:16px 20px;max-width:640px">'
    +'<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.35);margin-bottom:6px">About The Tutorment</div>'
    +'<p style="font-size:13px;color:rgba(255,255,255,.72);line-height:1.7;margin:0">Career counselling for students and professionals across India, the UK, USA, Canada, Australia, UAE, and beyond. Funded PhDs, international job placement, professional registration, university admissions, salary enhancement, and skills development. We work alongside you until the outcome is real. Backed by Workingment UK. Co-founded by Priyanshu Goyal and Vipul Jain.</p>'
    +'</div></div>'
    +'<div style="background:rgba(0,0,0,.18);padding:11px 44px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">'
    +'<span style="font-size:11px;color:rgba(255,255,255,.35)">support@thetutorment.com \u00b7 +91 90570 54077 \u00b7 Backed by Workingment UK</span>'
    +'<span style="font-size:11px;color:rgba(255,255,255,.28)">Confidential \u00b7 '+date+'</span>'
    +'</div></div>';
}

/* ═══════════════════════════════════
   PROFILE SUMMARY
═══════════════════════════════════ */
function buildProfileSection(rows,RD,targetDisplay,fn){
  var overallReadiness,blockers,factors;
  if(RD&&typeof RD==='object'&&RD.overall!==undefined){
    overallReadiness=RD.overall; blockers=RD.blockers||[]; factors=RD.factors||{};
  } else {
    overallReadiness=(typeof targetDisplay==='number'?targetDisplay:50);
    targetDisplay=fn||'your target'; fn=''; blockers=[]; factors=RD||{};
  }
  var firstName=fn&&fn!=='there'?fn:'';
  var gc1=overallReadiness>=70?'#065f46':overallReadiness>=45?'#1e3a8a':'#7f1d1d';
  var gc2=overallReadiness>=70?'#16a34a':overallReadiness>=45?'#2563eb':'#dc2626';
  var scoreLabel=overallReadiness>=70?'Ready to apply':overallReadiness>=45?'Preparation needed':blockers.length?'Blocked  -  fix first':'Needs significant work';
  var scoreSub=blockers.length
    ?(firstName?firstName+', your score is held at '+overallReadiness+'% by the blocker below. Fix that one thing first  -  the rest of your profile is much stronger than this number suggests.':'Your score is capped by a hard blocker. Fix it first and your real readiness is significantly higher.')
    :(firstName?firstName+', your profile sits at '+overallReadiness+'% readiness for '+targetDisplay+'. The meters below show which areas to prioritise.':'Your profile is at '+overallReadiness+'% readiness for '+targetDisplay+'.');

  var profileTable='<table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0">'
    +rows.map(function(r,i){
      return '<tr style="border-bottom:1px solid #f0f4f8;background:'+(i%2===0?'#f8fafc':'#fff')+'">'
        +'<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;width:36%">'+r[0]+'</td>'
        +'<td style="padding:10px 14px;font-size:13.5px;font-weight:600;color:#0f172a;line-height:1.4">'+r[1]+'</td></tr>';
    }).join('')+'</table>';

  var scoreCard='<div style="background:linear-gradient(150deg,'+gc1+','+gc2+');border-radius:10px;padding:18px 20px;margin-bottom:12px;-webkit-print-color-adjust:exact;print-color-adjust:exact">'
    +'<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px">'
    +'<div style="font-size:56px;font-weight:800;color:#fff;line-height:1;font-family:Manrope,Inter,sans-serif;flex-shrink:0">'+overallReadiness+'%</div>'
    +'<div><div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:2px">'+scoreLabel+'</div>'
    +'<div style="font-size:12px;color:rgba(255,255,255,.65)">for '+targetDisplay+'</div></div></div>'
    +'<p style="font-size:12.5px;color:rgba(255,255,255,.82);line-height:1.65;margin:0;border-top:1px solid rgba(255,255,255,.15);padding-top:10px">'+scoreSub+'</p>'
    +'</div>';

  var blockerHtml='';
  if(blockers.length){
    blockers.forEach(function(b){
      var crit=b.severity==='critical';
      var label=crit?'Hard gate  -  must fix before anything else':'Important gap  -  address soon';
      blockerHtml+='<div style="background:'+(crit?'#fef2f2':'#fffbeb')+';border:1px solid '+(crit?'#fca5a5':'#fcd34d')+';border-radius:8px;padding:14px 16px;margin-bottom:12px">'
        +'<div style="font-size:11px;font-weight:800;color:'+(crit?'#991b1b':'#92400e')+';text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">'+label+'</div>'
        +'<div style="font-size:13px;font-weight:700;color:'+(crit?'#7f1d1d':'#78350f')+';margin-bottom:7px">'+b.factor+'</div>'
        +'<p style="font-size:13px;color:'+(crit?'#7f1d1d':'#78350f')+';line-height:1.72;margin:0 0 10px">'+b.msg+'</p>'
        +'<div style="background:'+(crit?'rgba(220,38,38,.1)':'rgba(217,119,6,.1)')+';border-radius:6px;padding:8px 12px;font-size:12px;font-weight:700;color:'+(crit?'#dc2626':'#d97706')+'">Next action: '+b.fix+'</div>'
        +'</div>';
    });
  }

  return '<div style="display:grid;grid-template-columns:3fr 2fr;gap:28px;align-items:start">'
    +'<div><div style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Your Profile</div>'+profileTable+'</div>'
    +'<div><div style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Readiness Assessment</div>'
    +scoreCard+blockerHtml
    +meter('Qualification level',factors.qualification||65,'#0A2E73',false)
    +meter('Work experience',factors.experience||50,'#1565c0',false)
    +meter('Language / English',(factors.language!==undefined?factors.language:factors.english)||0,'#0d9488',false)
    +meter('Preparation / docs',factors.docs||30,'#7c3aed',false)
    +'<p style="font-size:11.5px;color:#94a3b8;line-height:1.6;margin-top:8px">A blocker caps the overall score regardless of other factors. Each meter shows your standing against your specific goal requirements.</p>'
    +'</div></div>';
}


/* ═══════════════════════════════════
   GOAL-SPECIFIC REPORT BUILDERS
   Each function returns an HTML string
   for all pages specific to that goal.
═══════════════════════════════════ */

/* ──────────────────────────────────
   PhD / SCHOLARSHIP REPORT
────────────────────────────────── */
function buildPhdReport(A,name,fieldDisplay,targetDisplay,targetCountry,qualification,experience,english,addons){
  var html='';
  var expYrs=parseInt(experience||'0');
  var funding=A['phd-funding']||'not-sure';
  var proposal=A['phd-proposal']||'no-idea';
  var publications=A['phd-publications']||'none';
  var timeline=A.timeline||'1year';

  /* ── Readiness ── */
  var r={
    qualification:({'high-school':10,'diploma':20,'bachelors':65,'bachelors-honours':80,'masters':95,'phd':98}[qualification])||65,
    experience:Math.min(100,expYrs*12+10),
    english:({'ielts-high':100,'ielts-65':75,'ielts-mid':40,'oet-b':90,'toefl-high':85,'pte-high':80,'below-required':30,'not-taken':0,'native':60,'not-specified':0}[english])||0,
    docs:({'conditional':95,'supervisor':80,'reviewed':60,'draft':35,'no-idea':10}[proposal])||10,
  };
  var overall=Math.round(r.qualification*0.22+r.experience*0.28+r.english*0.32+r.docs*0.18);
  var profileRows=[
    ['Name',name],['Field / Research Area',fieldDisplay],
    ['Qualification',getQualDisplay(qualification)],
    ['Experience',expYrs===0?'Student / No experience':expYrs+' years'],
    ['Target Country',targetDisplay],
    ['Funding type',({'fully-funded':'Fully funded only','partial-funding':'Partial funding acceptable','self-funded':'Self-funded','not-sure':'Open to all options'}[funding])||funding],
    ['Proposal status',({'no-idea':'Broad topic  -  no written proposal','draft':'Draft proposal written','reviewed':'Proposal reviewed by academic','supervisor':'Supervisor contacted with responses','conditional':'Conditional offer held'}[proposal])||proposal],
    ['Publications',({'none':'None','project-only':'Dissertation / capstone project','conference':'Conference paper / poster','journal':'Journal publication(s)','top-journal':'Q1/Q2 peer-reviewed journal'}[publications])||publications],
    ['English test',({'ielts-high':'IELTS 7.0+','ielts-65':'IELTS 6.5','ielts-mid':'IELTS 6.0 or below','oet-b':'OET Grade B+','toefl-high':'TOEFL 90+','pte-high':'PTE 65+','below-required':'Below threshold','not-taken':'Not yet taken','native':'Native / educated in English','not-specified':'Not specified'}[english])||english],
  ];
  html+=page('profile',sectionHead('Section 1: Your Profile and Application Readiness','An honest assessment of where you stand for funded PhD and scholarship applications','#0A2E73',true)+buildProfileSection(profileRows,{overall:overall,blockers:[],factors:{qualification:r.qualification,experience:r.experience,language:r.english||r.language||0,docs:r.docs}},targetDisplay,A._fn||''));

  /* ── Eligibility Assessment ── */
  var eligible=qualification==='bachelors'||qualification==='bachelors-honours'||qualification==='masters'||qualification==='phd';
  var eligColor=eligible?'green':'red';
  var eligMsg=eligible
    ?'Your qualification level makes you eligible to apply for PhD programmes. A '+getQualDisplay(qualification)+' is the standard entry qualification. Masters holders have a stronger competitive position for fully funded stipend positions, particularly at research-intensive universities.'
    :'A '+getQualDisplay(qualification)+' is below the standard entry requirement for PhD programmes globally. Most programmes require a minimum Bachelor\'s degree. You should complete your undergraduate qualification before applying.';

  /* Competitiveness score */
  var compScore=0;
  if(qualification==='masters'||qualification==='phd') compScore+=30;
  else if(qualification==='bachelors-honours') compScore+=20;
  else if(qualification==='bachelors') compScore+=15;
  if(publications==='top-journal') compScore+=30;
  else if(publications==='journal') compScore+=20;
  else if(publications==='conference') compScore+=10;
  else if(publications==='project-only') compScore+=5;
  if(proposal==='conditional') compScore+=30;
  else if(proposal==='supervisor') compScore+=20;
  else if(proposal==='reviewed') compScore+=12;
  else if(proposal==='draft') compScore+=6;
  if(english==='ielts-high'||english==='oet-b') compScore+=10;
  else if(english==='ielts-65'||english==='toefl-high') compScore+=6;
  if(expYrs>=3) compScore+=5;
  compScore=Math.min(compScore,100);

  var compLabel=compScore>=70?'Strong Candidate':compScore>=45?'Competitive  -  with targeted preparation':'Needs Development';
  var compColor=compScore>=70?'#14532d':compScore>=45?'#b45309':'#991b1b';

  /* Country-specific PhD landscape */
  var countryData={
    uk:{
      funding:funding==='fully-funded'?'UKRI (£18,622/year stipend + fees), Wellcome Trust, Royal Society, Leverhulme, and university-specific departmental studentships. Competition is extremely high  -  UKRI funds approximately 1 in 8 applicants in popular fields. Industrial CASE studentships (with company co-funding) are less competitive and pay above the standard stipend.':'University merit scholarships (£3,000–£10,000/year fee reduction), departmental bursaries, teaching assistantships (£8,000–£12,000/year), and partial UKRI funding for specific projects.',
      topUnis:{'stem-cs':'Imperial College, UCL, Edinburgh, Manchester, Sheffield','stem-engineering':'Imperial, Cambridge, Oxford, Manchester, UCL','stem-biomed':'Cambridge, Oxford, Imperial, UCL, Edinburgh','health-medicine':'Oxford, Cambridge, Imperial, UCL, Edinburgh','social-law':'Oxford, Cambridge, LSE, UCL, Edinburgh','social-policy':'LSE, Oxford, UCL, Warwick, Sussex','business-mgmt':'London Business School, Oxford Sa\u00efd, Cambridge Judge, Warwick','business-pm':'Imperial, UCL, Manchester, Warwick, Bristol','business-finance':'LSE, Oxford, Imperial, UCL, Warwick'}[A.field]||'Oxford, Cambridge, Imperial, UCL, Edinburgh, Manchester',
      visa:'Student Visa. Stipend-funded PhD students are eligible to work 20 hours/week during term. No post-study visa needed  -  you can switch to Skilled Worker directly from within the UK after completion.',
      requirement:'IELTS Academic 6.5–7.0+ (no component below 6.0 at most universities; some require 7.0 with 6.5 in each component). Cambridge and Oxford often require 7.5+.',
      stipend:qualification==='masters'?'\u00a318,622/year (UKRI standard rate, 2024-25). Industrial CASE: \u00a322,000–\u00a326,000/year. London universities add a London weighting supplement.':'\u00a318,622/year stipend (UKRI standard). Competitive  -  Masters holders are preferred for stipended positions at top universities.',
      duration:'3–4 years full-time. Most UKRI-funded PhDs are 3.5 years with a 6-month write-up period.',
      deadline:'UKRI project calls: January–March. Self-proposed PhD applications: rolling, but most funded positions advertised November–February for October start.'
    },
    usa:{
      funding:funding==='fully-funded'?'NSF Graduate Research Fellowship ($37,000/year stipend + $16,000 tuition). NIH NRSA (health sciences). Fulbright ($2,000–$3,000/month). University Teaching Assistantships (TA) and Research Assistantships (RA)  -  these fully fund most US PhDs in STEM and social sciences. US PhDs in STEM are almost universally fully funded through TA/RA.':'University fellowships, department-specific funding, and partial TA/RA positions. In STEM fields, self-funded PhDs are rare  -  if a programme requires self-funding, it is a signal the programme is not research-active.',
      topUnis:{'stem-cs':'MIT, Stanford, Carnegie Mellon, Berkeley, Caltech','stem-engineering':'MIT, Stanford, Caltech, Berkeley, Michigan','stem-biomed':'Harvard, MIT, Stanford, Johns Hopkins, UCSF','health-medicine':'Harvard, Johns Hopkins, UCSF, Stanford, Mayo Clinic','social-law':'Harvard Law, Yale Law, Columbia Law, Stanford Law, NYU Law','social-policy':'Harvard Kennedy, Princeton SPIA, Columbia SIPA, Georgetown, Syracuse','business-pm':'MIT Sloan, Stanford, CMU Tepper, Wharton, Ross','business-finance':'Wharton, Chicago Booth, Columbia, MIT Sloan, Stanford GSB'}[A.field]||'MIT, Stanford, Harvard, Berkeley, Columbia, University of Michigan',
      visa:'F-1 Student Visa. TA/RA-funded students can work as part of their funded position. OPT (Optional Practical Training)  -  12 months after graduation; 36 months for STEM. H-1B the primary pathway after OPT for permanent employment.',
      requirement:'TOEFL iBT 80–100+ (most top programmes 90+). GRE typically required  -  though many programmes are now GRE-optional post-2020. Check each programme individually.',
      stipend:'$20,000–$40,000/year depending on university and location. MIT/Stanford/Ivies: $30,000–$40,000/year. State universities: $20,000–$28,000/year. Health insurance typically included.',
      duration:'5–6 years for most US PhDs (includes qualifying exams, coursework, and dissertation). Shorter in professional fields.',
      deadline:'Applications due December 1–January 15 for September entry. Fellowship applications (NSF, Fulbright) due October–November.'
    },
    canada:{
      funding:funding==='fully-funded'?'Vanier Canada Graduate Scholarship ($50,000/year for 3 years  -  extremely competitive, ~500 awards annually). SSHRC, NSERC, CIHR doctoral fellowships ($20,000–$35,000/year). Provincial scholarships. Most STEM PhDs are funded through supervisor grants via TA/RA positions.':'University entrance scholarships ($5,000–$20,000/year), departmental funding, and teaching assistantships. Ontario Graduate Scholarship (OGS) and Queen Elizabeth II scholarships available at provincial level.',
      topUnis:{'stem-cs':'University of Toronto, UBC, McGill, Waterloo, Alberta','stem-engineering':'University of Toronto, UBC, Waterloo, McGill, McMaster','stem-biomed':'UBC, Toronto, McGill, Alberta, Dalhousie','health-nursing':'Toronto, UBC, McGill, Alberta, Queen\'s','health-physio':'McMaster, Toronto, Queen\'s, Western Ontario, Alberta','social-policy':'Carleton, McGill, Toronto, UBC, Dalhousie','business-mgmt':'Rotman (Toronto), Desautels (McGill), Sauder (UBC), Smith (Queen\'s)'}[A.field]||'University of Toronto, UBC, McGill, Waterloo, Alberta',
      visa:'Study Permit. PGWP after graduation  -  duration matches programme length (up to 3 years). Express Entry pathway to PR after 1 year Canadian work experience.',
      requirement:'IELTS 6.5–7.0 (most programmes). Some require TOEFL 90+. Check individual department requirements.',
      stipend:'CAD 18,000–$28,000/year standard. Vanier holders: CAD $50,000/year. Cost of living advantage over UK/USA in many cities.',
      duration:'4–5 years for most Canadian PhDs. Well-structured with defined progression milestones.',
      deadline:'Applications due November–February for September entry. Vanier and NSERC scholarship applications due October.'
    },
    australia:{
      funding:funding==='fully-funded'?'Research Training Programme (RTP) stipend  -  AUD $32,500/year (2024 rate) + fee offset covering full tuition. Australia Awards for international students from partner countries (full funding). University Research Excellence Scholarships. Most international PhD students in Australia receive either RTP or a University scholarship.':'International tuition fee range: AUD $28,000–$50,000/year. University merit scholarships (25–50% fee reduction) widely available. Many departments offer partial stipends for research assistantship work.',
      topUnis:{'stem-cs':'ANU, Melbourne, UNSW, Sydney, Queensland','stem-engineering':'Melbourne, UNSW, Sydney, Monash, UQ','stem-biomed':'Melbourne, ANU, Queensland, Monash, Sydney','health-physio':'Melbourne, Sydney, Queensland, Curtin, La Trobe','health-nursing':'Queensland, Melbourne, Sydney, Monash, Deakin','social-policy':'ANU, Melbourne, Sydney, Queensland, Monash','business-mgmt':'Melbourne Business School, AGSM (UNSW), Monash, UQ'}[A.field]||'Australian National University, University of Melbourne, UNSW, University of Sydney, University of Queensland',
      visa:'Student Visa (subclass 500). Post-study: Temporary Graduate Visa (subclass 485)  -  4 years for PhD graduates from Indian institutions (as of 2023). Direct pathway to PR via skilled visas.',
      requirement:'IELTS 6.5 overall (most universities), some require 7.0. PTE Academic 58 also accepted. Specific component minimums vary.',
      stipend:'AUD $32,500/year RTP stipend (tax-free). Additional top-up scholarships available at many universities: AUD $5,000–$15,000/year. Total package with tuition offset: AUD $60,000+ equivalent value per year.',
      duration:'3.5–4 years. Well-defined milestones at 6, 12, and 18 months. Strong supervisor accountability culture.',
      deadline:'Applications accepted year-round for most programmes. Scholarship competitions run February–April and September–October.'
    },
    germany:{
      funding:funding==='fully-funded'?'DAAD Research Grants (\u20ac934/month stipend + \u20ac500 monthly rent supplement  -  extremely accessible for international applicants). Helmholtz, Max Planck, and Fraunhofer institute positions (paid employment: \u20ac25,000–\u20ac35,000/year, full benefits). DFG project funding through supervisors. Germany is exceptional value for funded PhD research  -  competition is less intense than UK/USA.':'Self-funded PhDs are less common in Germany. Most doctoral researchers are employed as scientific staff (TVL-E13 at 50–75% FTE: \u20ac18,000–\u20ac28,000/year). Purely fee-based programmes are rare at public universities.',
      topUnis:{'stem-cs':'TU Munich, LMU Munich, Karlsruhe, RWTH Aachen, Berlin TU','stem-engineering':'TU Munich, RWTH Aachen, KIT, Stuttgart, TU Berlin','stem-biomed':'Heidelberg, Charit\u00e9 Berlin, Munich LMU, T\u00fcbingen, G\u00f6ttingen','social-policy':'Hertie School, Freie Universit\u00e4t, Humboldt, Cologne, Mannheim','business-mgmt':'WHU, Mannheim, Munich, Frankfurt, ESMT Berlin'}[A.field]||'TU Munich, LMU Munich, Heidelberg, Humboldt University Berlin, RWTH Aachen',
      visa:'National Visa D for research (apply at German consulate in India). Residence permit after arrival. No numerical limit  -  decisions based on application quality. After 5 years: Permanent Residence. German B1 required for daily life; most STEM PhDs operate in English within research groups.',
      requirement:'Most DAAD and research institute positions: English B2 (no IELTS required in many cases  -  department email in English is often sufficient). Confirm per programme.',
      stipend:'DAAD: \u20ac934/month + \u20ac500 rent + health insurance + travel allowance. Research institute employment: \u20ac1,500–\u20ac2,500/month gross. Public university tuition: \u20ac0 (admin fee ~\u20ac300/semester).',
      duration:'3–4 years. German PhD structure is highly supervisor-dependent. Research institute positions are the most structured.',
      deadline:'DAAD scholarship deadlines: October 15 (for following October start). Research institute positions: advertised year-round, no fixed deadline.'
    }
  };
  var cd=countryData[targetCountry]||countryData.uk;

  html+=page('position',
    sectionHead('Section 2: Your PhD Eligibility and Competitiveness Assessment','An honest analysis of where you stand for funded programmes in '+targetDisplay,'#7c3aed')
    +infoBox(eligColor,'Eligibility Status',eligMsg)
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">'
    +statTile(compScore+'%','Competitiveness Score',compLabel,'#f5f3ff','#7c3aed')
    +statTile(({'fully-funded':'Full stipend + fees','partial-funding':'Partial + self','self-funded':'Self-funded','not-sure':'All routes'}[funding])||'Various','Funding Target','Target award type','#f0fdf4','#14532d')
    +'</div>'
    +'<div style="font-size:15px;font-weight:700;color:#1f1f1f;margin-bottom:12px">What your competitiveness score means</div>'
    +'<p style="font-size:14px;color:#344054;line-height:1.75;margin-bottom:16px">Your score of '+compScore+'% is based on your qualification level, publication record, proposal readiness, and English test status. '+(compScore>=70?'You are a strong candidate for funded positions at good-to-strong universities. Focus your energy on identifying the right supervisors and submitting strong proposals  -  the profile is there.':compScore>=45?'You are competitive but not yet at the level where funded offers come easily. The two biggest levers are: (1) getting a reviewed research proposal in hand, and (2) making direct supervisor contact before applying formally. Both can be done in 4–6 weeks.':'Your current profile needs development before you are competitive for funded positions. The good news is that the specific gaps are fixable. The priority actions below will significantly improve your position within 3–6 months.')+'</p>'
    +infoBox('blue',targetDisplay+' PhD Landscape  -  Funding','In '+targetDisplay+': '+cd.funding)
    +reqTable([
      ['Top universities for '+fieldDisplay.split('/')[0].trim(),cd.topUnis],
      ['Typical stipend / funding value',cd.stipend],
      ['English requirement',cd.requirement],
      ['Duration',cd.duration],
      ['Visa after PhD',cd.visa],
      ['Key deadlines',cd.deadline]
    ])
  );

  /* ── Research Proposal Strategy ── */
  var proposalAdvice={
    'no-idea':'You have a broad topic but no written proposal. This is the most common starting point and is fully recoverable  -  but it is also the most time-intensive gap to close. A strong PhD proposal takes 4–6 weeks of focused work across multiple drafts. The structure is: (1) Research question  -  what specific gap in the literature are you addressing? (2) Background  -  what has already been done and why is it insufficient? (3) Methodology  -  how will you answer your question? (4) Expected contribution  -  what will the field know after your research that it does not know now? (5) Timeline  -  how will you complete this in 3–4 years? Start by reading 10–15 recent papers in your specific area. Your proposal should cite and respond to the most current work.',
    'draft':'You have a draft proposal. The next step is not more writing  -  it is getting expert feedback. Send it to a potential supervisor first, even before it is perfect. Their response (or non-response) is valuable data. Revise based on feedback. The proposal must answer one specific question clearly  -  if it tries to answer three, it will fail.',
    'reviewed':'Your proposal has been reviewed. This puts you in a strong position. The priority now is supervisor identification and contact. Do not apply through the general admissions form without first emailing specific academics  -  cold applications without supervisor interest have very low success rates at funded programmes.',
    'supervisor':'You have supervisor interest. This is the most valuable thing at this stage  -  more valuable than any scholarship or test score. Prioritise those who responded positively. Ask them directly: "Do you have funding available, or can you suggest departmental funding sources?" Then submit a formal application immediately.',
    'conditional':'You hold a conditional offer. You are already in the best position possible at this stage. Focus entirely on meeting the conditions  -  most commonly English language test and/or funding confirmation.'
  };

  var supervisorStrategy='Finding the right supervisor is more important than finding the right university. Your process: (1) Search Google Scholar, ResearchGate, and university department pages for academics who have published in your specific research area in the last 3 years. Older publications signal the supervisor may have moved on from this area. (2) Read their 3 most recent papers. In your email, mention the specific paper and what question it raised for you. (3) Your email should be under 200 words: who you are, your qualification, your proposed research question in one sentence, why their work is directly relevant, and whether they have capacity to take a PhD student. (4) Email 8–12 supervisors. Response rate is 20–40%  -  this is normal. A positive response from even one supervisor significantly changes your chances.';

  html+=page('skills',
    sectionHead('Section 3: Research Proposal and Supervisor Strategy','The two factors that determine whether you get a funded offer  -  and exactly how to close both gaps','#be123c')
    +infoBox('amber','Proposal Status: '+(({'no-idea':'Broad topic only','draft':'Draft written','reviewed':'Reviewed','supervisor':'Supervisor contacted','conditional':'Conditional offer held'}[proposal])||proposal),proposalAdvice[proposal]||proposalAdvice['no-idea'])
    +'<div style="font-size:15px;font-weight:700;color:#1f1f1f;margin:20px 0 12px">Supervisor Identification and Contact Strategy</div>'
    +'<p style="font-size:14px;color:#344054;line-height:1.75;margin-bottom:16px">'+supervisorStrategy+'</p>'
    +(publications==='none'||publications==='project-only'?infoBox('amber','Publications Gap','You do not yet have peer-reviewed publications. For fully funded positions at top universities (Oxford, Cambridge, MIT, Stanford, Ivy League), publications are near-essential. For strong research universities (Russell Group, R1 US universities, Group of Eight Australia, DAAD Germany), a well-developed research proposal with supervisor interest can compensate. If you have 3–6 months before applying, focus on: (1) Submitting a conference abstract  -  acceptance rates are 30–50% and a conference paper is a legitimate publication credit. (2) Converting your dissertation/capstone into a journal submission  -  the work is already done, it needs only reformatting and targeting the right journal. (3) Research assistant or junior research officer positions  -  these generate publications and direct supervisor connections.'):'')
  );

  /* ── Funding Roadmap ── */
  var scholarships={
    uk:[
      {name:'UKRI Doctoral Studentship',value:'\u00a318,622/year stipend + fees paid',deadline:'January-March (project-specific)',eligibility:'Open internationally. Applied through specific advertised projects  -  not a general scholarship application.'},
      {name:'Chevening Scholarship',value:'Full funding (tuition + \u00a31,236/month living)',deadline:'November 5 (annual)',eligibility:'All nationalities. 2 years work experience minimum. Leadership track record required. Masters level, but Chevening Alumni PhD is a lesser-known route.'},
      {name:'Commonwealth Scholarship',value:'Full funding (tuition + stipend ~\u00a319,000/year)',deadline:'October-December (via national agency)',eligibility:'Commonwealth countries. PhD research. Apply through Association of Commonwealth Universities  -  NOT directly to universities.'},
      {name:'Wellcome Trust PhD Programme',value:'Full funding + stipend (varies by programme)',deadline:'Varies by programme',eligibility:'Health and life sciences. Applied through specific Wellcome Sanger, Babraham, and university programmes.'},
      {name:'Gates Cambridge Scholarship',value:'Full funding (fees + \u00a321,600/year)',deadline:'October (US applicants), December (all others)',eligibility:'Cambridge admissions + scholarship application simultaneously. Exceptional academic record required.'},
    ],
    usa:[
      {name:'NSF Graduate Research Fellowship',value:'$37,000/year stipend + $16,000 tuition for 3 years',deadline:'October (varies by field)',eligibility:'US citizens and permanent residents only. Requires compelling broader impacts statement.'},
      {name:'Fulbright Foreign Student Program',value:'Full funding (tuition + $2,000-$3,000/month)',deadline:'October-November (country-specific)',eligibility:'Non-US citizens. Applied through Fulbright Commission in your home country (India: USIEF). Highly competitive  -  ~500 awards for India annually across all fields.'},
      {name:'TA / RA Positions (STEM)',value:'Full tuition + $20,000-$40,000/year stipend',deadline:'December-January (with PhD application)',eligibility:'Awarded as part of PhD admission in STEM fields. The majority of US PhD STEM students are fully funded this way.'},
      {name:'University Fellowship Programs',value:'Varies: $20,000-$35,000/year',deadline:'With PhD application',eligibility:'Based on academic merit. Often automatic for top applicants  -  not a separate application.'},
    ],
    canada:[
      {name:'Vanier CGS',value:'CAD $50,000/year for 3 years',deadline:'November',eligibility:'All nationalities. PhD at Canadian university. Requires exceptional academic record AND demonstrated leadership. ~500 awards nationally.'},
      {name:'NSERC Doctoral Award',value:'CAD $21,000/year',deadline:'October',eligibility:'Natural sciences and engineering. Applied through your university.'},
      {name:'SSHRC Doctoral Fellowship',value:'CAD $20,000/year',deadline:'October',eligibility:'Social sciences and humanities. Applied through your university.'},
      {name:'University Entrance Awards',value:'CAD $15,000-$40,000/year',deadline:'With application',eligibility:'Most universities offer these automatically to strong applicants. Specifically ask your department what is available.'},
    ],
    australia:[
      {name:'Research Training Programme (RTP)',value:'AUD $32,500/year stipend + full tuition offset',deadline:'Rolling  -  apply year-round',eligibility:'All nationalities. Applied through university with PhD application. Most STEM international students receive this.'},
      {name:'Australia Awards',value:'Full funding (tuition + AUD $29,000+/year)',deadline:'April 30 (for India)',eligibility:'Indian nationals. Development-related fields prioritised. Highly competitive. Apply at australiaawards.gov.au'},
      {name:'University International Research Scholarships',value:'AUD $10,000-$20,000/year top-up',deadline:'Various',eligibility:'Applied separately after RTP offer. Ask your faculty office specifically about these.'},
    ],
    germany:[
      {name:'DAAD Research Grant',value:'\u20ac934/month + \u20ac500 rent + health insurance + travel',deadline:'October 15 (for following year)',eligibility:'All nationalities. No age limit. Requires supervisor agreement at German institution. Relatively accessible compared to UK/US equivalents.'},
      {name:'Research Institute Employment (TVL-E13)',value:'\u20ac1,500-\u20ac2,500/month gross employment',deadline:'Year-round (advertised positions)',eligibility:'Applied directly through Helmholtz, Max Planck, Fraunhofer, and DLR institute websites. Treated as employment  -  full social security and health insurance included.'},
      {name:'Heinrich B\u00f6ll Foundation',value:'\u20ac1,000/month stipend + \u20ac1,200/year research allowance',deadline:'March 1 (for October start)',eligibility:'Strong academic record + social/political engagement. Green/progressive values alignment. Non-partisan but values-driven.'},
    ],
    open:[
      {name:'Chevening Scholarship (UK)',value:'Full funding (tuition + \u00a31,236/month)',deadline:'November',eligibility:'All nationalities. Masters. 2 years work experience.'},
      {name:'Commonwealth Scholarship (UK/Global)',value:'Full funding',deadline:'October-December',eligibility:'Commonwealth countries. PhD.'},
      {name:'Fulbright (USA)',value:'Full funding',deadline:'October-November',eligibility:'Non-US citizens. Masters + PhD.'},
      {name:'DAAD (Germany)',value:'\u20ac934/month + supplements',deadline:'October 15',eligibility:'All nationalities. Research.'},
      {name:'Australia Awards',value:'Full funding AUD $29,000+/year',deadline:'April 30 (India)',eligibility:'Indian nationals.'},
      {name:'Vanier CGS (Canada)',value:'CAD $50,000/year',deadline:'November',eligibility:'All nationalities. PhD.'},
    ]
  };
  var schList=scholarships[targetCountry]||scholarships.open;

  var schHtml='<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #E4E7EC">'
    +'<thead><tr style="background:#0A2E73">'
    +'<th style="padding:11px 14px;font-size:12px;font-weight:700;color:#fff;text-align:left">Scholarship / Funding</th>'
    +'<th style="padding:11px 14px;font-size:12px;font-weight:700;color:#fff;text-align:left">Value</th>'
    +'<th style="padding:11px 14px;font-size:12px;font-weight:700;color:#fff;text-align:left">Deadline</th>'
    +'<th style="padding:11px 14px;font-size:12px;font-weight:700;color:#fff;text-align:left">Key Eligibility</th>'
    +'</tr></thead><tbody>'
    +schList.map(function(s,i){
      return '<tr style="background:'+(i%2===0?'#F7F9FC':'#fff')+';border-bottom:1px solid #f0f0f0">'
        +'<td style="padding:10px 14px;font-size:13px;font-weight:700;color:#0A2E73">'+s.name+'</td>'
        +'<td style="padding:10px 14px;font-size:13px;color:#14532d;font-weight:600">'+s.value+'</td>'
        +'<td style="padding:10px 14px;font-size:13px;color:#344054">'+s.deadline+'</td>'
        +'<td style="padding:10px 14px;font-size:12.5px;color:#344054">'+s.eligibility+'</td>'
        +'</tr>';
    }).join('')+'</tbody></table>';

  html+=page('pathway',
    sectionHead('Section 4: Funding Roadmap and Scholarship Guide','Every major funding source for '+fieldDisplay+' PhDs in '+targetDisplay+'  -  with exact deadlines and eligibility','#b45309')
    +schHtml
  );

  /* ── Action Plan ── */
  var urgency={'asap':'You want to move immediately.','6months':'You have 6 months.','1year':'You have a year.','2years':'Two years gives you time to build a strong publication record first.','exploring':'Use this as your planning document.','not-specified':'Start now for the best outcome.'}[timeline]||'Start now.';
  var weeks=[
    {w:'Week 1-2',color:'#dc2626',items:[
      proposal==='no-idea'?'Begin reading 10-15 of the most cited recent papers in your specific research area. Keep a structured note of the gaps each paper identifies  -  your research question will come from one of these gaps.':'Continue refining your research proposal based on any feedback received.',
      proposal==='no-idea'||proposal==='draft'?'Email 3-5 potential supervisors this week. Keep it under 200 words. Mention one specific paper of theirs and your proposed research direction. Do not send a generic email.':'If you have not already, email your shortlisted supervisors with your updated proposal.',
      english==='not-taken'?'Register for IELTS Academic or TOEFL immediately  -  book the earliest available date. Most scholarships require results within 2 years of award.':'Confirm your English test result is current (within 2 years of likely application date).',
    ]},
    {w:'Week 3-6',color:'#f59e0b',items:[
      'Write or refine your research proposal using the structure: research question \u2192 literature gap \u2192 methodology \u2192 expected contribution \u2192 timeline. Target 1,500-2,500 words.',
      'Gather your academic documents: degree certificates (apostilled if required), official transcripts (sealed), and any publication PDFs. These take longer than expected  -  start now.',
      publications==='none'?'Convert your strongest academic project or dissertation chapter into a conference abstract submission. Conference deadlines are year-round  -  find 2-3 relevant conferences with upcoming deadlines.':'If you have publications, prepare a clean academic CV with all publications correctly formatted (APA or field-standard style).',
    ]},
    {w:'Week 7-10',color:'#0A2E73',items:[
      'Submit your formal application(s) with your completed proposal, academic CV, and all supporting documents. Do not wait for your English result to apply  -  most universities allow conditional offers.',
      english!=='ielts-high'&&english!=='toefl-high'?'Sit your English language test. Target IELTS 7.0+ overall with no component below 6.5.':'Your English test is in order. Focus energy on the application itself.',
      'Follow up with supervisors who have not responded. One professional follow-up after 2 weeks is appropriate. If a supervisor has not responded to two emails, move on.',
    ]},
    {w:'Week 11-16',color:'#14532d',items:[
      'Submit scholarship applications simultaneously with or immediately after university applications. Chevening and Commonwealth close November  -  do not miss these.',
      'Prepare for potential supervisor or admissions panel interviews. Expect: 30-60 minutes, deep questions on your proposal, awareness of the current literature, and your 5-year vision for this research.',
      'Receive first decisions and plan next steps  -  negotiate funding where possible. When you receive an offer, immediately ask the scholarships office what funding is available to you.',
    ]},
  ];
  var actionHtml=infoBox('blue','Your Timeline',urgency+' The plan below is sequenced so earlier steps unlock later ones.')
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'
    +weeks.map(function(w){
      return '<div style="background:#fff;border:1px solid #E4E7EC;border-top:4px solid '+w.color+'"><div style="background:'+w.color+';padding:10px 16px"><div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+w.w+'</div></div>'
        +'<div style="padding:16px">'
        +w.items.map(function(item,idx){
          return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#344054;line-height:1.6">'
            +'<div style="width:20px;height:20px;border-radius:50%;background:'+w.color+';color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(idx+1)+'</div>'
            +item+'</div>';
        }).join('')+'</div></div>';
    }).join('')+'</div>';

  html+=page('action',sectionHead('Section 5: Your Step-by-Step Action Plan','Specific steps in the right order  -  from today to a funded offer','#0A2E73',true)+actionHtml);
  return html;
}


/* ──────────────────────────────────
   STUDY ABROAD (MASTERS) REPORT
────────────────────────────────── */
function buildStudyAbroadReport(A,name,fieldDisplay,targetDisplay,targetCountry,qualification,experience,english,addons){
  var html='';
  var studyLevel=A['study-level']||'masters';
  var grades=A.grades||'merit';
  var timeline=A.timeline||'1year';

  var r={
    qualification:({'high-school':20,'diploma':35,'bachelors':70,'bachelors-honours':85,'masters':90,'phd':95}[qualification])||70,
    experience:Math.min(100,parseInt(experience||'0')*10+15),
    english:({'ielts-high':100,'ielts-65':75,'ielts-mid':40,'toefl-high':85,'pte-high':80,'below-required':30,'not-taken':0,'native':60,'not-specified':0}[english])||0,
    docs:({'distinction':80,'merit':65,'pass':50,'below-pass':25,'in-progress':40}[grades])||50,
  };
  var overall=Math.round(r.qualification*0.22+r.experience*0.28+r.english*0.32+r.docs*0.18);

  var profileRows=[
    ['Name',name],['Field of Study',fieldDisplay],
    ['Programme level',({'masters':'Masters degree','postgrad-diploma':'Postgraduate Diploma','phd-taught':'Integrated PhD (4-year)','undergrad':'Undergraduate (Bachelors)','not-decided':'Not yet decided'}[studyLevel])||studyLevel],
    ['Current qualification',getQualDisplay(qualification)],
    ['Academic grades',({'distinction':'Distinction / First Class / 75%+','merit':'Merit / Upper Second / 60-74%','pass':'Pass / Second Class / 50-59%','below-pass':'Below 50%','in-progress':'Currently studying'}[grades])||grades],
    ['Target country',targetDisplay],
    ['English test',({'ielts-high':'IELTS 7.0+','ielts-65':'IELTS 6.5','ielts-mid':'IELTS 6.0 or below','toefl-high':'TOEFL 90+','pte-high':'PTE 65+','below-required':'Below threshold','not-taken':'Not yet taken','native':'Native / educated in English'}[english])||english],
  ];
  html+=page('profile',sectionHead('Section 1: Your Profile and Admissions Readiness','Assessment of your competitiveness for '+studyLevel+' programmes in '+targetDisplay,'#0A2E73',true)+buildProfileSection(profileRows,{overall:overall,blockers:[],factors:{qualification:r.qualification,experience:r.experience,language:r.english||r.language||0,docs:r.docs}},targetDisplay,A._fn||''));

  /* Country requirements */
  var countryReqs={
    uk:{english:'IELTS 6.5-7.0 overall (most programmes). No component below 6.0. Top universities (Oxford, Cambridge, Imperial): 7.0 with 6.5 each component.',grades:'2:1 equivalent or above for Masters at most universities. First Class for scholarships and top 20 programmes. 2:2 accepted at many universities with relevant work experience.',cost:'\u00a312,000-\u00a335,000/year tuition. Living costs: \u00a31,200-\u00a31,800/month (outside London), \u00a31,500-\u00a32,200/month (London).',psw:'Graduate Route Visa: 2 years post-study work (3 years for PhD). No restrictions on employer or role. This is the primary reason many Indian students choose the UK.',deadline:'September-January for September entry. UCAS postgraduate: rolling. Scholarships: Chevening November, GREAT rolling.'},
    usa:{english:'TOEFL 80-100+ (most top programmes require 100+). IELTS 6.5-7.0. GRE required at many programmes  -  check per department.',grades:'GPA 3.0+ for most programmes. Top schools: 3.5+. Grade conversion: 60-74% India \u2248 3.2-3.5 US GPA.',cost:'USD 20,000-80,000/year tuition. Living: USD 15,000-25,000/year depending on city. Total: USD 35,000-100,000/year.',psw:'OPT: 12 months. STEM OPT: 36 months. This is the primary route to US employment post-study. H-1B lottery required after OPT for permanent employment.',deadline:'December-January for Fall entry. Rolling for Spring (January) entry.'},
    canada:{english:'IELTS 6.5-7.0 or TOEFL 88+. Some programmes require 7.0. Check per institution.',grades:'Second Class Honours equivalent (60%+) for most programmes. Work experience can substitute for grades at many universities.',cost:'CAD 18,000-45,000/year tuition. Living: CAD 12,000-18,000/year. Significantly cheaper than USA or UK for comparable quality.',psw:'PGWP: Duration matches study period, up to 3 years. Open work permit  -  any employer. Direct route to Express Entry PR.',deadline:'November-February for September entry. Some universities accept until May.'},
    australia:{english:'IELTS 6.5 overall (most). Some 7.0. PTE Academic 58 also widely accepted.',grades:'Credit average equivalent (60%+ or GPA 5.0/7.0) for most programmes. Top universities: 65%+.',cost:'AUD 22,000-50,000/year tuition. Living: AUD 20,000-25,000/year.',psw:'485 Temporary Graduate Visa: 5 years for Indian students after Masters, 6 years after PhD (since 2023). Significant advantage for building Australian work experience toward PR.',deadline:'Rolling admissions most universities. Peak: October-February for Semester 1 (February start).'},
    germany:{english:'B2 English for English-taught programmes. IELTS/TOEFL not always required  -  department email in English is often accepted as proof. German B1-B2 for German-taught programmes.',grades:'\u2265 2.5 German equivalent (approximately 60%+ in Indian system). Strong research-track record valued more than grades at many technical universities.',cost:'Zero tuition at all public universities (semester fee \u20ac150-\u20ac350 includes transport pass). Living: \u20ac850-\u20ac1,200/month.',psw:'18-month Job Seeker Permit after graduation. No restrictions on employer.',deadline:'Varies by university. Most: January 15 (summer) or July 15 (winter). TU Munich and LMU: specific December/May deadlines.'},
  };
  var cr=countryReqs[targetCountry]||countryReqs.uk;

  html+=page('position',
    sectionHead('Section 2: Entry Requirements and Your Eligibility for '+targetDisplay,'Exact requirements matched against your current profile','#7c3aed')
    +infoBox(grades==='below-pass'?'red':grades==='pass'?'amber':'green',
      'Academic Grades  -  '+(grades==='distinction'?'Excellent for scholarships':grades==='merit'?'Meets most requirements':grades==='pass'?'Eligible, limited scholarships':'Below standard threshold'),
      grades==='distinction'?'Your academic grades are in the top tier for '+targetDisplay+' admissions. You are competitive for merit scholarships, which can significantly reduce your fees. Apply to your top-choice universities confidently.':grades==='merit'?'Your grades meet the standard entry requirements for most programmes in '+targetDisplay+'. You are eligible for university merit scholarships. For highly competitive programmes (top 20 globally), a strong statement of purpose and relevant experience are critical differentiators.':grades==='pass'?'Your grades meet the minimum requirements for many programmes, but scholarship options are limited. A strong statement of purpose explaining your trajectory and professional growth since graduating is essential. Work experience significantly helps at this grade level.':'Your grades are below the minimum threshold for most Masters programmes. You have two routes: (1) Apply to programmes with holistic admissions that weigh work experience heavily. (2) Consider a Postgraduate Diploma first, then convert to Masters  -  this is a recognised route at many UK and Australian universities.'
    )
    +reqTable([
      ['English language',cr.english],
      ['Academic requirement',cr.grades],
      ['Tuition and living costs',cr.cost],
      ['Post-study work rights',cr.psw],
      ['Application deadlines',cr.deadline]
    ])
    +'<div style="font-size:15px;font-weight:700;color:#1f1f1f;margin:20px 0 12px">University Tier Strategy</div>'
    +'<p style="font-size:14px;color:#344054;line-height:1.75">Apply to 8-12 universities across 3 tiers: <strong>Aspirational</strong> (2-3 programmes you would be thrilled to attend), <strong>Target</strong> (4-5 where your profile is a strong match), and <strong>Safety</strong> (2-3 well-ranked programmes with high acceptance rates). Never apply to only 1-2 universities. Acceptance rates at top programmes run 8-20%.</p>'
  );

  /* Personal Statement guidance */
  html+=page('skills',
    sectionHead('Section 3: Application Strategy  -  Personal Statement, References, and Scholarship','The three application components that determine your outcome beyond grades and test scores','#be123c')
    +infoBox('blue','Personal Statement / Statement of Purpose','Your statement is the single most powerful variable in your application that is still within your control. Admissions committees at top universities read 500-800 applications per programme. The statements they remember answer three questions specifically: (1) Why this subject  -  not a generic passion, but a specific intellectual question or professional problem you want to solve. (2) Why now  -  what your work or academic experience has shown you that a Masters will address. (3) Why this specific programme  -  name specific modules, research groups, or faculty whose work connects to your goal. Generic statements that could apply to any programme are rejected at competitive universities.')
    +infoBox('teal','References','Two referees are standard. At least one should be academic (lecturer or supervisor who assessed your work directly). If you have 3+ years of work experience, one professional reference from a manager who can speak to your analytical and professional skills is valuable. Brief your referees on: the specific programme, what skills the programme values, and the narrative in your personal statement. Give them 6+ weeks and a reminder 2 weeks before the deadline.')
    +infoBox('green','Scholarship Applications',
      targetCountry==='uk'?'Chevening Scholarship: apply at chevening.org. Deadline November 5. Requires 2 years work experience, 3 references, and 4 essays. Apply simultaneously with university applications  -  not after an offer. GREAT Scholarship: \u00a310,000+ toward fees for Indian students. University-specific merit scholarships: apply during the university application  -  most are automatic for strong applicants, but confirm with the admissions office.':
      targetCountry==='usa'?'US university merit scholarships are the most accessible route  -  many departments award these automatically to competitive international applicants. Fulbright (fulbright.state.gov via USIEF India): deadline October-November. Extremely competitive. Apply regardless of whether you expect to win  -  the application process strengthens your overall profile.':
      targetCountry==='canada'?'University entrance scholarships ($5,000-$25,000/year) are widely available and often automatic for strong applicants. Shastri Indo-Canadian Institute fellowships for India-Canada programmes. Ask your department directly what funding is available  -  much of it is not publicly advertised.':
      targetCountry==='australia'?'Australia Awards (australiaawards.gov.au): April 30 deadline for Indian applicants. Development-related fields prioritised. University Excellence Scholarships: applied with admission application. Many universities offer 25-50% fee reductions for merit applicants  -  these are not advertised prominently; ask directly.':
      targetCountry==='germany'?'DAAD Study Scholarships (\u20ac934/month stipend): applied through daad.de, deadline October 15. For English-taught Masters programmes. Erasmus Mundus: fully funded joint degrees  -  apply early (October-January). German university merit scholarships: minimal  -  Germany\u2019s main advantage is zero tuition fees, not merit grants.':
      'Research country-specific scholarship portals. Many scholarships are awarded during the admissions process  -  apply to universities and scholarships simultaneously, not sequentially.'
    )
  );

  /* Action plan */
  var urgency={'asap':'You need to move immediately.','6months':'Six months is enough time if you start this week.','1year':'One year gives you full preparation time.','2years':'Two years allows you to strengthen your profile before applying.','exploring':'Use this as your planning reference.','not-specified':'Start now.'}[timeline]||'Start now.';
  var actionItems=[
    {w:'Week 1-2',color:'#dc2626',items:[
      english==='not-taken'?'Register for IELTS Academic or TOEFL iBT immediately. Book the earliest available test date. Most universities require results within 2 years of enrolment.':'Confirm your English test score is current (within 2 years of your intended enrolment date).',
      'Begin your university shortlist. Use QS World Rankings by Subject (topuniversities.com), THE subject rankings, and graduate employment outcomes for your field. Target 8-12 universities across 3 tiers.',
      'Contact 2-3 programme admissions offices to confirm: entry requirements for international students, scholarship availability, and whether your qualification is equivalent to their standard entry requirement.',
    ]},
    {w:'Week 3-6',color:'#f59e0b',items:[
      'Write your personal statement. First draft: answer only the three questions  -  why this subject, why now, why this programme. Do not describe your life story. Each version should name the specific programme.',
      'Request your official transcripts and qualification certificates. Budget 2-4 weeks for universities to issue sealed transcripts. Get apostilled copies of your degree certificate.',
      'Brief your referees. Give them: the programme descriptions, your personal statement draft, a one-page summary of your goals, and a specific deadline. Follow up in 2 weeks.',
    ]},
    {w:'Week 7-10',color:'#0A2E73',items:[
      english!=='ielts-high'&&english!=='toefl-high'?'Sit your English language test. Prepare for 4-6 weeks focusing on your weakest component only.':'English confirmed. Focus on finalising application documents.',
      'Finalise your personal statement. Get it reviewed by someone who has been through the process or an academic mentor. Generic statements are the most common failure point.',
      'Submit your first 3-4 applications. Earlier applications receive more attention and have better scholarship outcomes than late applications.',
    ]},
    {w:'Week 11-16',color:'#14532d',items:[
      'Submit all remaining applications. Apply to all scholarship programmes with overlapping eligibility simultaneously.',
      'When you receive offers, compare funding packages. Contact the scholarships office at each university with offers and ask directly what additional funding is available.',
      'Accept your strongest offer and begin your visa application immediately after acceptance.',
    ]},
  ];
  var aHtml=infoBox('blue','Your Timeline',urgency)+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'+actionItems.map(function(w){
    return '<div style="background:#fff;border:1px solid #E4E7EC;border-top:4px solid '+w.color+'"><div style="background:'+w.color+';padding:10px 16px"><div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+w.w+'</div></div><div style="padding:16px">'+w.items.map(function(item,i){return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#344054;line-height:1.6"><div style="width:20px;height:20px;border-radius:50%;background:'+w.color+';color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'+item+'</div>';}).join('')+'</div></div>';
  }).join('')+'</div>';
  html+=page('action',sectionHead('Section 4: Your Step-by-Step Application Plan','From today to an accepted offer with funding','#0A2E73',true)+aHtml);
  return html;
}


/* ──────────────────────────────────
   INTERNATIONAL JOB REPORT
────────────────────────────────── */
function buildIntlJobReport(A,name,fieldDisplay,targetDisplay,targetCountry,qualification,experience,english,addons){
  var html='';
  var expYrs=parseInt(experience||'2');
  var expLabel=['Entry level','Mid-level','Senior','Lead/Principal'][expYrs===0?0:expYrs<=2?1:expYrs<=5?2:3];
  var salary=A.salary||'prefer-not';
  var awareness=A['visa-awareness']||'basic';
  var timeline=A.timeline||'1year';
  var currentCountry=A['current-country']||gateCountryToKey(P.country||'India');

  var r={
    qualification:({'high-school':20,'diploma':35,'bachelors':70,'bachelors-honours':78,'masters':90,'phd':95,'professional-cert':60}[qualification])||70,
    experience:Math.min(100,expYrs*10+10),
    english:({'ielts-high':100,'ielts-65':75,'ielts-mid':40,'toefl-high':85,'pte-high':80,'below-required':30,'not-taken':0,'native':80,'not-specified':20}[english])||20,
    docs:({'nothing':15,'basic':40,'researched':70,'applied':80,'not-specified':20}[awareness])||20,
  };
  var overall=Math.round(r.qualification*0.22+r.experience*0.28+r.english*0.32+r.docs*0.18);

  var profileRows=[
    ['Name',name],['Profession / Field',fieldDisplay],
    ['Qualification',getQualDisplay(qualification)],
    ['Experience',expYrs===0?'Student':expYrs+' years ('+expLabel+')'],
    ['Target country',targetDisplay],
    ['Current country',(A['current-country']||'India')],
    ['English test',({'ielts-high':'IELTS 7.0+','ielts-65':'IELTS 6.5','ielts-mid':'IELTS 6.0 or below','toefl-high':'TOEFL 90+','pte-high':'PTE 65+','below-required':'Below threshold','not-taken':'Not yet taken','native':'Native / educated in English','not-specified':'Not specified'}[english])||english],
    ['Visa knowledge level',({'nothing':'Starting from scratch','basic':'Basic understanding','researched':'Well-researched','applied':'Has applied before','not-specified':'Not specified'}[awareness])||awareness],
  ];
  html+=page('profile',sectionHead('Section 1: Your Profile and Market Readiness','Assessment of your competitiveness for the '+targetDisplay+' job market','#0A2E73',true)+buildProfileSection(profileRows,{overall:overall,blockers:[],factors:{qualification:r.qualification,experience:r.experience,language:r.english||r.language||0,docs:r.docs}},targetDisplay,A._fn||''));

  /* Country job market */
  var markets={
    uk:{
      visaRoute:'Skilled Worker Visa (SWV). Your employer must hold a Sponsor Licence (there are approximately 85,000 licensed sponsors in the UK). Minimum salary: \u00a326,200/year (general threshold) or the going rate for your specific SOC code, whichever is higher. The going rate for tech and health roles is typically \u00a330,000-\u00a360,000+. No annual cap on numbers.',
      sponsorSearch:'Search: UKVI Sponsor Register (gov.uk)  -  download the full list. Filter by industry. Only apply to companies on this list for sponsored roles. Unsponsorable applications are wasted effort.',
      jobPlatforms:(function(){
        var f=A.field||'';
        var base='LinkedIn (primary for professional roles in the UK). Reed.co.uk and Totaljobs for broader market. Glassdoor for company research and salary data. LinkedIn Premium is worth the cost  -  it shows who viewed your profile and allows direct InMail to hiring managers.';
        if(f.indexOf('health-')===0||f==='stem-biomed') return base+' NHS Jobs (jobs.nhs.uk) for all NHS and NHS trust roles  -  the only place NHS jobs are listed directly. Nursing Times Jobs and Health Jobs UK for private healthcare.';
        if(f==='social-education') return base+' TES (tes.com) and Guardian Jobs for teaching roles. School Direct and UCAS Teacher Training for initial teacher training routes.';
        if(f==='business-finance') return base+' eFinancialCareers (dominant in UK finance). CityJobs and Morgan McKinley for banking and financial services.';
        if(f==='stem-engineering') return base+' New Civil Engineer jobs (newcivilengineer.com). Institution of Engineering and Technology job board. Hays and Reed Engineering for technical roles.';
        if(f==='social-law') return base+' The Lawyer, Legal Week Jobs, and Roll on Friday for legal roles. Law Society jobs board.';
        return base+' Indeed UK, Guardian Jobs for broader professional roles.';
      })(),
      cvFormat:'UK CV: 2 pages maximum, no photo, no date of birth, reverse chronological. Every bullet point: achievement + metric. Example: "Reduced processing time by 40% through..." not "Responsible for processing". References: "Available upon request"  -  do not include names until asked.',
      salaryRange:{'stem-cs':'Junior: \u00a335,000-\u00a345,000 | Mid: \u00a360,000-\u00a380,000 | Senior: \u00a390,000-\u00a3120,000 | Lead: \u00a3120,000-\u00a3160,000+','business-pm':'Junior: \u00a330,000-\u00a340,000 | Mid: \u00a350,000-\u00a370,000 | Senior: \u00a370,000-\u00a3100,000 | Lead: \u00a3100,000-\u00a3140,000','business-finance':'Junior: \u00a328,000-\u00a340,000 | Mid: \u00a350,000-\u00a375,000 | Senior: \u00a375,000-\u00a3120,000 | Lead: \u00a3120,000-\u00a3200,000+','health-physio':'Band 5: \u00a328,407 | Band 6: \u00a335,392 | Band 7: \u00a343,742 | Band 8a: \u00a352,522','health-nursing':'Band 5: \u00a328,407 | Band 6: \u00a335,392 | Band 7: \u00a343,742','default':'Entry: \u00a325,000-\u00a335,000 | Mid: \u00a340,000-\u00a360,000 | Senior: \u00a360,000-\u00a390,000'}[A.field]||'Entry: \u00a325,000-\u00a335,000 | Mid: \u00a340,000-\u00a360,000 | Senior: \u00a360,000-\u00a390,000',
      interviewProcess:'Most UK employers: (1) CV screening, (2) Recruiter phone screen 20-30 min, (3) Hiring manager interview 45-60 min, (4) Technical/panel interview. Senior roles: 4-5 rounds. Prepare STAR-method answers. Research the company\u2019s recent news, challenges, and culture before every interview.',
      timeline:'3-6 months from first application to offer for most sectors. NHS and public sector: longer (4-8 months). Fast-growth tech: can be 3-6 weeks.'
    },
    usa:{
      visaRoute:'H-1B (specialty occupation): employer-sponsored, annual lottery in April for October start. Highly competitive  -  ~65,000 regular cap + 20,000 masters cap, ~500,000 registrations in 2024. Alternatives: O-1 (extraordinary ability, no lottery), L-1 (intra-company transfer, requires 1+ year at employer abroad), TN (for Canadians/Mexicans), E-3 (Australians). Most Indian professionals plan for a multi-year process given H-1B lottery odds.',
      sponsorSearch:'LinkedIn: filter jobs by "Visa Sponsorship Available". myvisajobs.com (H-1B sponsor database by company). H-1B statistics by employer (USCIS public data). Large tech, healthcare, consulting, and finance firms sponsor the most. Target companies with H-1B approval rates above 90% and 100+ applications  -  they have established sponsorship programmes.',
      jobPlatforms:'LinkedIn (dominant for professional roles). Indeed, Glassdoor, Levels.fyi (tech compensation). Healthcare: HealthcareJobsite, Nurse.com, LinkedIn. Finance: Wall Street Oasis, eFinancialCareers. Networking is more important in the USA than any other market  -  referrals generate 30-50% of hires.',
      cvFormat:'US Resume: 1 page for under 8 years experience, 2 pages for senior. No photo, no nationality, no marital status. Objective statement replaced by a 2-line summary. Quantify everything. ATS-optimised  -  include keywords from each job description verbatim.',
      salaryRange:{'stem-cs':'Entry: USD 90,000-120,000 | Mid: USD 140,000-180,000 | Senior: USD 200,000-280,000 (incl. equity)','business-pm':'Entry: USD 100,000-130,000 | Mid: USD 140,000-180,000 | Senior: USD 200,000-280,000','business-finance':'Entry: USD 80,000-110,000 | Mid: USD 130,000-180,000 | Senior: USD 180,000-300,000+','health-physio':'Entry: USD 60,000-75,000 | Mid: USD 80,000-100,000 | Senior: USD 100,000-125,000','health-nursing':'Entry: USD 60,000-75,000 | Mid: USD 80,000-100,000 | Senior: USD 100,000-130,000','default':'Entry: USD 60,000-90,000 | Mid: USD 90,000-140,000 | Senior: USD 140,000-200,000'}[A.field]||'Entry: USD 60,000-90,000 | Mid: USD 90,000-140,000 | Senior: USD 140,000-200,000',
      interviewProcess:'US tech: 5-7 rounds including technical screen, system design (senior roles), and behavioural. Non-tech: 3-5 rounds. Behavioural questions: STAR format mandatory. Case interviews for consulting. Salary negotiation expected  -  always negotiate. First offer is rarely the final offer.',
      timeline:'2-4 months application to offer. H-1B processing: 3-6 months standard, 1-2 months premium. Total: 6-12 months from first application to US start date.'
    },
    canada:{
      visaRoute:'Express Entry (points-based): score CRS points from education, experience, language, and adaptability. Invitations issued at ~470-510 CRS for recent draws. Canada Experience Class (after 1 year Canadian work): significantly easier PR. Provincial Nominee Programs (PNP): many provinces actively nominate skilled workers  -  adds 600 CRS points guaranteeing an invitation.',
      sponsorSearch:'Job Bank (jobbank.gc.ca  -  official government portal). LinkedIn Canada. Workopolis, Monster Canada, Indeed Canada. Tech: Hatchways, AngelList Canada. Many Canadian employers sponsor LMIA (Labour Market Impact Assessment) permits for unfillable roles  -  mention relocation readiness in applications.',
      jobPlatforms:'Job Bank, LinkedIn, Indeed, Workopolis. Province-specific: Vancouver (BCJobs.ca), Toronto (Workopolis), Alberta (alis.alberta.ca). Networking: LinkedIn is dominant in Canada  -  direct InMail to hiring managers has high response rates.',
      cvFormat:'Canadian CV: 2 pages, no photo, no date of birth. Similar to UK format. Education section before experience for recent graduates. Skills section with keywords. References: "available on request".',
      salaryRange:{'stem-cs':'Entry: CAD 65,000-85,000 | Mid: CAD 90,000-120,000 | Senior: CAD 120,000-160,000','business-pm':'Entry: CAD 70,000-90,000 | Mid: CAD 95,000-130,000 | Senior: CAD 130,000-175,000','health-physio':'Entry: CAD 55,000-70,000 | Mid: CAD 70,000-90,000 | Senior: CAD 90,000-110,000','health-nursing':'Entry: CAD 55,000-70,000 | Mid: CAD 72,000-90,000 | Senior: CAD 90,000-115,000','default':'Entry: CAD 50,000-70,000 | Mid: CAD 70,000-95,000 | Senior: CAD 95,000-130,000'}[A.field]||'Entry: CAD 50,000-70,000 | Mid: CAD 70,000-95,000 | Senior: CAD 95,000-130,000',
      interviewProcess:'Canadian interviews: professional and direct. Behavioural questions are standard. 2-3 rounds for most roles. References are always checked  -  prepare 3 professional references. Salary negotiation is expected but less aggressive than US.',
      timeline:'2-3 months application to offer. Work permit processing: 2-4 months. Express Entry PR: 6-12 months from profile creation to landing.'
    },
    australia:{
      visaRoute:'Temporary Skill Shortage (TSS) Visa (subclass 482): employer-sponsored, 2-4 year. Employer must demonstrate the role is on the skilled occupation list and they tried to fill it locally first (LMIA equivalent: Labour Agreement or standard sponsorship). Skilled Independent Visa (subclass 189): points-tested, no employer needed (65+ points). State Nomination (subclass 190/491): adds 5-10 points toward 189.',
      sponsorSearch:'SEEK.com.au (dominant job platform in Australia). LinkedIn Australia. CareerOne. Industry-specific: Hays, Robert Half, Talent for professional roles. Search "sponsorship available" on SEEK. Many Australian employers sponsor for hard-to-fill roles  -  stating you require sponsorship in applications is acceptable and increasingly common.',
      jobPlatforms:'SEEK (primary), LinkedIn, Indeed Australia, CareerOne. Graduate: GradConnection, GradAustralia. Healthcare: Healthcare Australia, MedRecruit, ClinicalDirection.',
      cvFormat:'Australian CV: 2-3 pages, no photo (increasingly standard not to include). Key Selection Criteria (KSC) responses required for government roles  -  address each criterion with a STAR example. Referees listed on CV (2-3 professional referees with contact details).',
      salaryRange:{'stem-cs':'Entry: AUD 70,000-90,000 | Mid: AUD 95,000-130,000 | Senior: AUD 130,000-170,000','business-pm':'Entry: AUD 75,000-95,000 | Mid: AUD 100,000-135,000 | Senior: AUD 135,000-180,000','health-physio':'Entry: AUD 65,000-80,000 | Mid: AUD 80,000-100,000 | Senior: AUD 100,000-125,000','health-nursing':'Entry: AUD 65,000-80,000 | Mid: AUD 80,000-105,000 | Senior: AUD 105,000-130,000','default':'Entry: AUD 60,000-80,000 | Mid: AUD 80,000-110,000 | Senior: AUD 110,000-150,000'}[A.field]||'Entry: AUD 60,000-80,000 | Mid: AUD 80,000-110,000 | Senior: AUD 110,000-150,000',
      interviewProcess:'Australian interviews: conversational and behavioural. STAR format standard. 2-3 rounds for most roles. Reference checks are taken seriously  -  prepare referees. Informal networking (LinkedIn connection + coffee chat) is a highly effective route to Australian job offers.',
      timeline:'2-3 months application to offer. TSS visa: 1-3 months processing. Express entry equivalent (subclass 189): 6-12 months.'
    }
  };
  var mkt=markets[targetCountry]||markets.uk;

  html+=page('position',
    sectionHead('Section 2: '+targetDisplay+' Job Market  -  Visa, Salary, and Employer Strategy','Exactly how the market works and what you need to do to access it','#7c3aed')
    +infoBox('blue','Visa Route for '+targetDisplay,mkt.visaRoute)
    +reqTable([
      ['How to find sponsor employers',mkt.sponsorSearch],
      ['Primary job platforms',mkt.jobPlatforms],
      ['CV / Resume format',mkt.cvFormat],
      ['Salary range for '+fieldDisplay.split('/')[0].trim(),mkt.salaryRange],
      ['Interview process',mkt.interviewProcess],
      ['Realistic timeline',mkt.timeline]
    ])
  );

  /* Profile & gap analysis */
  var profileGaps=[];
  if(english==='not-taken') profileGaps.push('English test: not yet taken  -  required for most visa applications and employer screening. Book IELTS or TOEFL this week.');
  if(english==='ielts-mid'||english==='below-required') profileGaps.push('English test: below required threshold for most visa routes. A targeted resit is needed before you can apply.');
  if(expYrs<2) profileGaps.push('Experience: '+expYrs+' year(s) is below the 2+ years most employers require for sponsored positions. Consider whether additional experience before applying is the right strategy.');
  if(qualification==='high-school'||qualification==='diploma') profileGaps.push('Qualification: '+getQualDisplay(qualification)+' is below the degree-level requirement for most skilled worker visa routes in '+targetDisplay+'.');

  html+=page('skills',
    sectionHead('Section 3: Your Profile Gap Analysis and CV Strategy','What you need to fix before you apply and how to position yourself for success','#be123c')
    +(profileGaps.length>0?infoBox('red','Critical Gaps to Address Before Applying',profileGaps.map(function(g,i){return (i+1)+'. '+g;}).join('<br>')):'')
    +infoBox('teal','CV Positioning for '+targetDisplay,'Your CV for '+targetDisplay+' is not a summary of your career. It is a targeted marketing document answering one question: why are you the best person for this specific role? Every bullet point must lead with a result, not a responsibility. Format: '+mkt.cvFormat+'. Before each application, re-read the job description and add the exact phrases they use  -  ATS systems score your CV against keyword frequency before a human sees it.')
    +infoBox('green','LinkedIn Strategy for '+targetDisplay,'LinkedIn is the single most important tool for international job search. Actions this week: (1) Update your location to your target city (e.g. "London, England" not "India")  -  this makes you appear in local searches. (2) Connect with 20-30 people in your target role at target companies and send a brief personalised note. (3) Turn on "Open to Work" visible to recruiters only. (4) Request 2-3 LinkedIn recommendations from managers or senior colleagues. Recruiters in '+targetDisplay+' actively search LinkedIn  -  a strong profile generates inbound enquiries.')
  );

  /* Action plan */
  var w=[
    {w:'Week 1-2',color:'#dc2626',items:[
      'Rewrite your CV in '+targetDisplay+' format. Every bullet: lead with a verb and a number. Remove: "responsible for", "worked on", "helped with". Replace with: "delivered", "increased", "reduced", "built".',
      english==='not-taken'?'Register for IELTS Academic or equivalent. Book immediately  -  this is required for most visa routes and many employers screen on English test scores.':'Confirm your English result is current and meets the minimum for your target visa route ('+targetDisplay+').',
      'Update your LinkedIn profile for '+targetDisplay+' search. Change location to target city. Add a 3-line "About" section written for a '+targetDisplay+' recruiter reading your profile.',
    ]},
    {w:'Week 3-6',color:'#f59e0b',items:[
      'Research 40-60 target companies in '+targetDisplay+' that (a) sponsor visas, (b) hire in your field, and (c) have open or recent roles matching your experience. This list is your market.',
      'Submit 15-20 tailored applications. Each cover letter: mention one specific thing about the company, one specific challenge in their industry, and one specific result from your career that addresses it. Generic cover letters have \u22643% response rate.',
      'Connect with 5-10 people at your top 5 target companies. Not recruiters  -  people in your exact target role. Ask them about the team, not for a job. This generates informal referrals.',
    ]},
    {w:'Week 7-10',color:'#0A2E73',items:[
      english!=='ielts-high'&&english!=='native'?'Sit your English test. Most visa applications require a valid test result submitted with the application.':'Interview prep: prepare 8-10 STAR examples covering: leadership, handling disagreement, delivering under pressure, data-driven decisions, cross-functional collaboration.',
      'Prepare for interviews at your shortlisted companies. Research each company: last 2 quarters\u2019 news, recent product launches, key executives. Prepare one question per round that shows strategic thinking.',
      'Follow up with applications submitted in weeks 3-6. One professional follow-up email 2 weeks after submission is appropriate and often effective.',
    ]},
    {w:'Week 11-16',color:'#14532d',items:[
      'Receive first interview invitations. Treat every interview as a learning opportunity  -  request feedback when declined, even if rarely given.',
      (function(){
        var exp=parseInt(A.experience||'0');
        var qual=A.qualification||'';
        var isFullTimeStudent=A.qualification==='student-mba'||A.qualification==='student-bachelors'||A.qualification==='student-masters'||A.qualification==='phd-student'||expYrs===0;
        if(isFullTimeStudent){
          return 'You are in a strong position as a student  -  you are not locked into a notice period. Respond to offers promptly. Negotiate the start date to give yourself time to finish your programme or prepare. Ask specifically about graduate schemes and sponsored intern-to-hire pathways which are designed for people in exactly your situation.';
        }
        return 'On receiving an offer: do not resign from your current role until your visa approval is confirmed in writing  -  not just an offer letter. Negotiate salary  -  first offers are rarely final. In the UK, ask: "Is there flexibility on the base salary?" Give yourself time to respond  -  24 to 48 hours is standard and expected.';
      })(),
      'Begin visa application immediately after offer acceptance. Your employer initiates the sponsorship. Provide all requested documents within 24 hours of each request.',
    ]},
  ];
  var aHtml=infoBox('blue','Your Timeline',({'asap':'Move immediately.','6months':'6 months is enough.','1year':'One year.','2years':'Two years.','exploring':'Use as reference.','not-specified':'Start now.'}[timeline]||'Start now.'))+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'+w.map(function(wk){return '<div style="background:#fff;border:1px solid #E4E7EC;border-top:4px solid '+wk.color+'"><div style="background:'+wk.color+';padding:10px 16px"><div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+wk.w+'</div></div><div style="padding:16px">'+wk.items.map(function(item,i){return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#344054;line-height:1.6"><div style="width:20px;height:20px;border-radius:50%;background:'+wk.color+';color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'+item+'</div>';}).join('')+'</div></div>';}).join('')+'</div>';
  html+=page('action',sectionHead('Section 4: Your Job Search Action Plan','Step-by-step from profile rebuild to offer in hand','#0A2E73',true)+aHtml);
  return html;
}


/* ──────────────────────────────────
   PROFESSIONAL REGISTRATION REPORT
────────────────────────────────── */
function buildRegReport(A,name,fieldDisplay,targetDisplay,targetCountry,qualification,experience,english,addons){
  var html='';
  var regStatus=A['reg-status']||'fully-registered';
  var docs=A['reg-documents']||[];
  var timeline=A.timeline||'1year';
  var field=A.field||'health-physio';

  var r={
    qualification:({'bachelors':75,'bachelors-honours':82,'masters':92,'phd':95,'diploma':45}[qualification])||75,
    experience:Math.min(100,parseInt(experience||'2')*10+10),
    english:({'ielts-high':100,'ielts-65':70,'ielts-mid':30,'oet-b':100,'toefl-high':75,'pte-high':70,'below-required':20,'not-taken':0,'native':50,'not-specified':0}[english])||0,
    docs:docs.length>=6?85:docs.length>=4?65:docs.length>=2?40:15,
  };
  var overall=Math.round(r.qualification*0.22+r.experience*0.28+r.english*0.32+r.docs*0.18);

  /* Regulatory body lookup */
  var regBody={
    uk:{
      'health-physio':'HCPC (Health and Care Professions Council)','health-nursing':'NMC (Nursing and Midwifery Council)',
      'health-medicine':'GMC (General Medical Council)','health-pharmacy':'GPhC (General Pharmaceutical Council)',
      'health-dentistry':'GDC (General Dental Council)','health-allied':'HCPC (Health and Care Professions Council)',
      'social-education':'DfE  -  Qualified Teacher Status (QTS)','social-law':'SRA (Solicitors Regulation Authority) or Bar Standards Board'
    },
    australia:{
      'health-physio':'AHPRA (Australian Health Practitioner Regulation Agency)','health-nursing':'AHPRA  -  Nursing and Midwifery Board',
      'health-medicine':'AMC (Australian Medical Council) + AHPRA','health-pharmacy':'AHPRA  -  Pharmacy Board',
      'health-dentistry':'ADC (Australian Dental Council) + AHPRA','health-allied':'AHPRA',
      'social-education':'AITSL (Australian Institute for Teaching and School Leadership)','social-law':'State-based bar associations'
    },
    canada:{
      'health-physio':'Provincial PT associations (CAPT). NNAS for initial credential assessment.',
      'health-nursing':'NNAS (National Nursing Assessment Service) \u2192 Provincial college (e.g. CNO in Ontario, CRNNS in Nova Scotia)',
      'health-medicine':'MCCQE (Medical Council of Canada qualifying exam)',
      'health-pharmacy':'PEBC (Pharmacy Examining Board of Canada)',
      'health-dentistry':'NDEB (National Dental Examining Board of Canada)',
      'social-education':'Provincial teacher regulatory authorities (OCT in Ontario)',
    },
    usa:{
      'health-physio':'FCCPT (Foreign Credentialing Commission) \u2192 State physical therapy board',
      'health-nursing':'CGFNS (Credentials Evaluation) \u2192 NCLEX-RN \u2192 State board of nursing',
      'health-medicine':'ECFMG (Educational Commission for Foreign Medical Graduates) \u2192 USMLE Steps 1, 2, 3',
      'health-pharmacy':'NABP \u2192 FPGEC \u2192 NAPLEX (North American Pharmacist Licensure Examination)',
      'health-dentistry':'NBDE / INBDE (National Board Dental Examination) \u2192 State dental board',
    },
    ireland:{
      'health-physio':'CORU (Health and Social Care Professionals Council)',
      'health-nursing':'Nursing and Midwifery Board of Ireland (NMBI)',
      'health-medicine':'Medical Council of Ireland',
      'health-pharmacy':'Pharmaceutical Society of Ireland (PSI)',
    },
    'new-zealand':{
      'health-physio':'Physiotherapy Board of New Zealand (PBNZ)',
      'health-nursing':'Nursing Council of New Zealand (NCNZ)',
      'health-medicine':'Medical Council of New Zealand (MCNZ)',
    }
  };
  var body=(regBody[targetCountry]||regBody.uk)[field]||'Relevant national regulatory body for '+fieldDisplay;

  var profileRows=[
    ['Name',name],['Profession',fieldDisplay],
    ['Qualification',getQualDisplay(qualification)],
    ['Experience',parseInt(experience||'0')+' years'],
    ['Target country',targetDisplay],
    ['Registering body',body],
    ['Current reg. status',({'fully-registered':'Fully registered in home country','registered-gap':'Registered, gap in practice','registered-lapsed':'Previously registered, lapsed','in-training':'Currently in training','not-registered':'Not formally registered'}[regStatus])||regStatus],
    ['English test',({'ielts-high':'IELTS 7.0+','ielts-65':'IELTS 6.5','oet-b':'OET Grade B+','not-taken':'Not yet taken','native':'Native','below-required':'Below threshold','not-specified':'Not specified'}[english])||english],
    ['Documents ready',(docs.length>0?docs.join(', '):'None yet')],
  ];
  html+=page('profile',sectionHead('Section 1: Your Registration Profile and Readiness','Assessment of where you stand for '+body+' registration','#0A2E73',true)+buildProfileSection(profileRows,{overall:overall,blockers:[],factors:{qualification:r.qualification,experience:r.experience,language:r.english||r.language||0,docs:r.docs}},targetDisplay,A._fn||''));

  /* Route analysis */
  var routeByStatus={
    'fully-registered':'You are fully registered in your home country. For '+targetDisplay+', this is the strongest possible starting position. Most regulators offer a Recognition of Prior Registration route which is shorter and less expensive than re-training. The key question is equivalence: whether your home country training meets the target country\u2019s pre-registration standards. If your training is from India, the answer depends heavily on your specific university and clinical hours.',
    'registered-gap':'You are registered but have a gap in practice. Most regulators define "recent practice" as 450 hours or 3 months of full-time practice within the last 3 years (HCPC) or similar. A practice gap does not disqualify you, but you will likely need to demonstrate a return-to-practice process and may need to complete a supervised period. Address this honestly in your application.',
    'registered-lapsed':'Your registration has lapsed. The process to get it back depends on how long it has been lapsed and what you have been doing since. Lapsed under 2 years: typically a return to practice + good standing letter. Lapsed over 2 years: may require supervised practice or an adaptation period. Contact the regulator directly before spending money on other documents.',
    'in-training':'You are currently in training. You can begin gathering documents and preparing now, but you cannot formally apply to most regulators until you hold your qualification and home-country registration. Use this time to: gather pre-qualification documents (transcripts, personal information form), sit your English test, and email the regulator to confirm the requirements for your specific qualification.',
    'not-registered':'You are not formally registered anywhere. This is the most complex starting position for international registration. Most regulators require you to hold registration in your home country before they will assess equivalence. Your first step is to investigate registration in India (in your profession) before applying abroad. In some professions (e.g. physiotherapy), HCPC does accept applications from Indian-trained practitioners who were not required to be registered in India  -  but this is profession-specific.'
  };

  /* English requirements by regulator */
  var englishReqs={
    'HCPC (Health and Care Professions Council)':'IELTS Academic: 7.0 in each component (Reading, Writing, Listening, Speaking). No exceptions. OET Grade B in each skill also accepted.',
    'NMC (Nursing and Midwifery Council)':'IELTS Academic: 7.0 in each component. OET Grade B in each skill. Results must be within 2 years of application.',
    'GMC (General Medical Council)':'IELTS Academic: 7.5 in each component. OET Grade B in each skill.',
    'GPhC (General Pharmaceutical Council)':'IELTS Academic: 7.0 overall with at least 6.5 in each component.',
    'GDC (General Dental Council)':'IELTS Academic: 7.0 in each component. OET Grade B in each skill.',
    'AHPRA (Australian Health Practitioner Regulation Agency)':'IELTS Academic: 7.0 overall with minimums of 7.0 Reading, 6.5 Writing, 8.0 Listening, 7.0 Speaking (physio). Nursing: 7.0 each. Medicine: 7.0 overall with 7.0 each. OET Grade B in each skill accepted for all professions.',
    'AMC (Australian Medical Council) + AHPRA':'IELTS Academic: 7.0 overall with 7.0 each band. OET Grade B in each skill.',
    'NNAS (National Nursing Assessment Service) \u2192 Provincial college':'IELTS Academic: 6.5 overall with no component below 6.0. Provincial requirements vary.',
    'DfE  -  Qualified Teacher Status (QTS)':'B2 English equivalent. IELTS 6.5 or equivalent. No formal test required if educated in English.',
  };
  var engReq=englishReqs[body]||'Check '+body+' website for specific English language requirements.';

  /* Missing documents */
  var allDocs=['qualification-cert','transcripts','home-registration','good-standing','passport','police-clearance','references','english-result'];
  var missingDocs=allDocs.filter(function(d){return docs.indexOf(d)===-1;});
  var docNames={
    'qualification-cert':'Original qualification certificate (apostilled / notarised)',
    'transcripts':'Official sealed academic transcripts',
    'home-registration':'Current registration certificate from home regulator',
    'good-standing':'Certificate of good standing',
    'passport':'Valid passport (12+ months remaining)',
    'police-clearance':'Police clearance certificate(s)  -  all countries 12+ months in last 5 years',
    'references':'Professional references (2 supervisors, headed paper)',
    'english-result':'IELTS / OET result meeting '+body+' threshold'
  };

  html+=page('position',
    sectionHead('Section 2: Your Registration Route and Requirements','Exact steps and documents for '+body,'#7c3aed')
    +infoBox('blue','Your Route Based on Current Registration Status',routeByStatus[regStatus]||routeByStatus['fully-registered'])
    +infoBox(english==='ielts-high'||english==='oet-b'?'green':english==='not-taken'?'red':'amber','English Language Requirement  -  '+body,engReq+(english==='not-taken'?' This is the first step. Book your IELTS Academic or OET before gathering any other documents.':english==='ielts-high'||english==='oet-b'?' Your English result meets this requirement. This is a critical box ticked.':' Your current result does not meet this threshold. A targeted resit focusing specifically on the components below threshold is the fastest route.'))
    +'<div style="font-size:15px;font-weight:700;color:#1f1f1f;margin:20px 0 12px">Documents You Still Need</div>'
    +(missingDocs.length===0?infoBox('green','All Key Documents Identified','You have identified all key documents. The next step is ensuring they are in the correct format (apostilled originals, sealed transcripts) and within the validity windows specified by the regulator.')
      :'<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #E4E7EC;margin-bottom:24px"><thead><tr style="background:#dc2626"><th style="padding:11px 14px;font-size:12px;font-weight:700;color:#fff;text-align:left;width:45%">Missing Document</th><th style="padding:11px 14px;font-size:12px;font-weight:700;color:#fff;text-align:left">Why It Matters / How to Obtain</th></tr></thead><tbody>'
        +missingDocs.map(function(d,i){
          var guide={
            'qualification-cert':'Apostilled original from your university. Apostilling in India: State Home Department or MEA (meaindia.gov.in). Takes 2-4 weeks.',
            'transcripts':'Official sealed copy issued by your university registry. Must be sealed and stamped  -  a printed copy is not accepted.',
            'home-registration':'Current certificate from your home regulatory body. For Indian physiotherapists: IAP or state council. Nurses: Indian Nursing Council.',
            'good-standing':'From your home regulator confirming no fitness to practise concerns. Separate from your registration certificate.',
            'passport':'Valid for at least 12 months beyond your intended registration date.',
            'police-clearance':'Required for every country you have lived in for 12+ months in the last 5 years. India: from your local police station via an authorised agency. Processing: 2-6 weeks.',
            'references':'Two professional supervisors or senior colleagues who directly supervised your clinical work. Must be on headed paper with their registration number.',
            'english-result':'IELTS Academic or OET. Must meet the specific threshold for '+body+'. Results must be within 2 years of application submission. '+engReq
          }[d]||'Contact '+body+' for specific guidance on this document.';
          return '<tr style="background:'+(i%2===0?'#FEF2F2':'#fff')+';border-bottom:1px solid #f0f0f0">'
            +'<td style="padding:10px 14px;font-size:13px;font-weight:700;color:#dc2626">'+docNames[d]+'</td>'
            +'<td style="padding:10px 14px;font-size:13px;color:#344054">'+guide+'</td></tr>';
        }).join('')+'</tbody></table>'
    )
  );

  /* Step-by-step process */
  var processSteps=[
    {n:1,color:'#dc2626',t:'English Language Test',b:'Book IELTS Academic or OET before anything else. This is the gating step  -  do not invest significant money in other documents until this is scheduled. '+engReq,badge:'FIRST STEP'},
    {n:2,color:'#f59e0b',t:'Document Gathering (run in parallel with English prep)',b:'Start gathering documents simultaneously with English preparation. Longest lead time items first: (1) Police clearance: 2-6 weeks. (2) Apostilled degree certificate: 2-4 weeks. (3) Good standing letter: 1-3 weeks. (4) Sealed transcripts: 1-2 weeks. (5) Professional references: brief referees now, allow 4+ weeks.',badge:'Weeks 2-8'},
    {n:3,color:'#0A2E73',t:'Online Application to '+body,b:'Complete the online application form on '+body+'\'s website. The form is detailed  -  it asks about every clinical placement, supervised practice hour, and any fitness to practise matters. Accuracy is critical: any inconsistency causes delays and may trigger a referral. Prepare your answers before starting the online form.',badge:'Weeks 8-10'},
    {n:4,color:'#7c3aed',t:'Assessment Decision',b:'The regulator assesses whether your training is equivalent to their standard. Three outcomes: (1) Equivalent  -  registration granted. (2) Requires adaptation period (supervised practice in '+targetDisplay+'). (3) Requires aptitude test or exam. Average processing time: 90-150 days from complete submission. Incomplete submissions are returned and restart the clock.',badge:((targetCountry==='uk'||targetCountry==='ireland')?'90-150 days':(targetCountry==='australia')?'90-180 days':'Varies')},
    {n:5,color:'#14532d',t:'Registration Granted  -  Begin Employment',b:'Once registered, you can legally practise and use your protected title in '+targetDisplay+'. Begin job applications immediately  -  employers value newly registered practitioners. Within the UK and Australia, many NHS/public hospital employers have dedicated international recruitment programmes that have been waiting for your registration.',badge:'Immediately after decision'},
  ];

  var processHtml=processSteps.map(function(s){return timelineStep(s.n,s.color,s.t,s.b,s.badge);}).join('');
  html+=page('skills',sectionHead('Section 3: Step-by-Step Registration Process','The exact sequence from today to being legally registered in '+targetDisplay,'#be123c')+processHtml);

  /* Action plan */
  var urgency={'asap':'Immediate start.','6months':'6 months.','1year':'1 year.','2years':'2 years.','exploring':'Planning phase.','not-specified':'Start now.'}[timeline]||'Start now.';
  var weeks=[
    {w:'Week 1-2',color:'#dc2626',items:[
      english==='not-taken'?'Book IELTS Academic or OET immediately. This single step controls the timeline for everything else.':'Your English test is in order. Begin document gathering this week.',
      'Email '+body+' directly to confirm the specific requirements for your qualification and training institution. Requirements can vary by country of training. A 10-minute email now saves months of assumptions.',
      'Start the police clearance application process  -  this is always the longest-lead-time document. Apply today.',
    ]},
    {w:'Week 3-6',color:'#f59e0b',items:[
      'Get your degree certificate apostilled. Request official sealed transcripts from your university simultaneously.',
      'Request a good standing letter from your home regulatory body. In India, this is often called a "letter of clearance" or "certificate of good standing".',
      english!=='ielts-high'&&english!=='oet-b'?'Begin IELTS Academic or OET preparation. Focus only on the components below threshold  -  not all four skills if only one or two need improvement.':'Prepare your professional references  -  brief two supervisors who directly observed your clinical practice.',
    ]},
    {w:'Week 7-10',color:'#0A2E73',items:[
      english!=='ielts-high'&&english!=='oet-b'?'Sit your English test. Ensure the result will be sent directly to '+body+' (not just to you).':'With English confirmed, begin completing the online application form on '+body+'\'s website.',
      'Complete the '+body+' online application form. Gather all documents in the format specified. Double-check every document against the regulator\'s checklist before submission.',
      'Submit your complete application. Keep a copy of every document and your submission confirmation. Monitor your application portal daily.',
    ]},
    {w:'Week 11+',color:'#14532d',items:[
      'Respond to any additional document requests within 24-48 hours. Every delay adds days or weeks to your processing time.',
      'Await assessment decision ('+((targetCountry==='uk'||targetCountry==='ireland')?'90-150 days':(targetCountry==='australia')?'90-180 days':'90-150 days')+' from complete submission). Use this time to research employers, prepare your CV for '+targetDisplay+', and apply for roles that require registration as a condition of employment.',
      'On approval: apply for registered positions immediately. Your registration is time-sensitive  -  acting quickly while your registration is fresh maximises your negotiating position with employers.',
    ]},
  ];
  var aHtml=infoBox('blue','Your Timeline',urgency)+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'+weeks.map(function(wk){return '<div style="background:#fff;border:1px solid #E4E7EC;border-top:4px solid '+wk.color+'"><div style="background:'+wk.color+';padding:10px 16px"><div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+wk.w+'</div></div><div style="padding:16px">'+wk.items.map(function(item,i){return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#344054;line-height:1.6"><div style="width:20px;height:20px;border-radius:50%;background:'+wk.color+';color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'+item+'</div>';}).join('')+'</div></div>';}).join('')+'</div>';
  html+=page('action',sectionHead('Section 4: Your Registration Action Plan','Sequenced steps from today to legally practising in '+targetDisplay,'#0A2E73',true)+aHtml);
  return html;
}


/* ──────────────────────────────────
   INDIA JOB REPORT
────────────────────────────────── */
function buildIndiaJobReport(A,name,fieldDisplay,targetDisplay,qualification,experience,addons){
  var html='';
  var targetRole=A['india-target-role']||'lateral-same';
  var situation=A['india-situation']||'employed-unhappy';
  var timeline=A.timeline||'6months';
  var expYrs=parseInt(experience||'2');
  var field=A.field||'business-pm';

  var r={
    qualification:({'high-school':20,'diploma':40,'bachelors':70,'bachelors-honours':78,'masters':90,'professional-cert':65}[qualification])||70,
    experience:Math.min(100,expYrs*10+10),
    english:80, // not relevant for India track
    docs:({'fresher':50,'lateral-same':60,'promotion':55,'career-switch':40,'freelance':50,'leadership':65}[targetRole])||55,
  };
  var overall=Math.round(r.qualification*0.3+r.experience*0.4+r.docs*0.3);

  var profileRows=[
    ['Name',name],['Profession / Field',fieldDisplay],
    ['Qualification',getQualDisplay(qualification)],
    ['Experience',expYrs===0?'Student / Fresher':expYrs+' years'],
    ['Current situation',({'employed-unhappy':'Employed, looking to move','employed-laid-off':'Employed, facing potential layoff','unemployed-recent':'Unemployed, left within 6 months','unemployed-long':'Unemployed, gap 1+ year','student':'Studying','returning':'Returning from abroad'}[situation])||situation],
    ['Target move type',({'fresher':'Fresher / first job','lateral-same':'Lateral move (same role)','promotion':'Step up to next level','career-switch':'Career switch','freelance':'Freelance / consulting','leadership':'Senior / leadership role'}[targetRole])||targetRole],
  ];
  html+=page('profile',sectionHead('Section 1: Your Profile and Market Readiness','Your India job market position and the gaps between where you are and where you want to be','#0A2E73',true)+buildProfileSection(profileRows,{overall:overall,blockers:[],factors:{qualification:r.qualification,experience:r.experience,language:r.english||r.language||0,docs:r.docs}},'India',A._fn||''));

  /* India job market by field */
  var indiaMarket={
    'stem-cs':{topEmployers:'Google, Microsoft, Amazon, Flipkart, Zomato, PhonePe, Paytm, Razorpay, Infosys, TCS, Wipro, HCL, Accenture India, Capgemini India',salaryByLevel:'Fresher: \u20b96-12 LPA | 2-5 yrs: \u20b915-30 LPA | 5-8 yrs: \u20b930-60 LPA | 8+ yrs: \u20b960-120 LPA+',platforms:'LinkedIn (dominant for tech), Naukri, AngelList India (startups), Instahyre, Cutshort, Glassdoor India',interviewFormat:'DSA (Data Structures and Algorithms) for product companies: 2-4 coding rounds on LeetCode-style questions + 1 system design (senior) + 1 behavioural. Service companies (TCS, Infosys): online aptitude test + technical interview. Preparation: 3-6 months for FAANG-tier, 4-6 weeks for service companies.',topCities:'Bangalore (dominant tech hub), Pune, Hyderabad, Chennai, Mumbai, Gurgaon'},
    'business-pm':{topEmployers:'Google, Amazon, Flipkart, Razorpay, CRED, Meesho, Swiggy, Zomato, Paytm, PhonePe, Nykaa, Byju\'s, OYO, Ola, Urban Company',salaryByLevel:'Fresher/APM: \u20b912-20 LPA | PM 2-5 yrs: \u20b920-40 LPA | Senior PM: \u20b940-70 LPA | Group PM/Director: \u20b970-120+ LPA',platforms:'LinkedIn (primary), PM roles on Naukri, Cutshort, PMSchool community (India-specific PM hiring events)',interviewFormat:'PM interviews: 3-5 rounds. (1) Product sense: design/critique a product. (2) Analytical: metrics, experiment design, SQL. (3) Strategy: market entry, monetisation. (4) Behavioural: STAR format. Preparation: PM frameworks (CIRCLES, HEART, PRD writing) + data interpretation + case studies.',topCities:'Bangalore, Gurgaon, Mumbai, Pune, Hyderabad'},
    'business-finance':{topEmployers:'Goldman Sachs, Morgan Stanley, HSBC, Barclays, JP Morgan, Deutsche Bank, Citi, Kotak, HDFC, ICICI, Axis, Paytm Money, Zerodha, Groww',salaryByLevel:'Fresher: \u20b96-12 LPA | 2-5 yrs: \u20b912-25 LPA | 5-8 yrs: \u20b925-50 LPA | Senior: \u20b950-100+ LPA (with bonus)',platforms:'LinkedIn, eFinancialCareers, Naukri, IIM-A/B/C placement networks, company career pages directly',interviewFormat:'Investment banking: multiple technical rounds (DCF, LBO, financial modelling), case studies, behavioural. Financial services: aptitude + technical + HR. Preparation: Investment Banking by Rosenbaum and Pearl (IB), CFA curriculum for asset management.',topCities:'Mumbai (primary), Delhi/NCR, Bangalore, Hyderabad'},
    'stem-biomed':{topEmployers:'Sun Pharma, Cipla, Dr. Reddy\'s, Lupin, Biocon, Serum Institute, CSIR labs, NCBS, IISc, AIIMS research, Tata Memorial Hospital, Apollo Research',salaryByLevel:'Research associate: \u20b94-8 LPA | Senior researcher: \u20b98-15 LPA | Principal scientist: \u20b915-30 LPA | Director R&D: \u20b930-60 LPA',platforms:'LinkedIn, Naukri, Biospectrum Jobs, CSIR/DST recruitment portals, ResearchGate for postdoc positions',interviewFormat:'Technical interview focused on specific techniques and domain knowledge. For industry: also include business/commercial awareness round. Publications and presentations are weighted heavily.',topCities:'Bangalore, Hyderabad, Pune, Mumbai, Ahmedabad (pharma)'},
    'default':{topEmployers:'Varies by sub-field. Use LinkedIn to identify the top 20 employers in your exact area.',salaryByLevel:'Entry: \u20b96-12 LPA | Mid: \u20b912-25 LPA | Senior: \u20b925-50 LPA | Lead: \u20b950+ LPA',platforms:'LinkedIn (primary), Naukri, Indeed India, company career pages',interviewFormat:'Prepare for: (1) Technical/functional round, (2) Managerial round, (3) HR/culture fit round. Research the specific company\'s known interview format before each stage.',topCities:'Bangalore, Mumbai, Delhi/NCR, Hyderabad, Pune, Chennai'}
  };
  var mkt=indiaMarket[field]||indiaMarket['default'];

  html+=page('position',
    sectionHead('Section 2: India Job Market  -  Salaries, Employers, and Interview Reality','What the market pays, where the jobs are, and how to get through the interview process','#7c3aed')
    +reqTable([
      ['Top employers',mkt.topEmployers],
      ['Salary by experience level (CTC)',mkt.salaryByLevel],
      ['Best platforms',mkt.platforms],
      ['Interview format and preparation',mkt.interviewFormat],
      ['Top cities for this field',mkt.topCities]
    ])
    +(situation==='unemployed-long'?infoBox('amber','Employment Gap Strategy','A gap of 1+ year requires proactive addressing in your CV and interviews. Do not leave it unexplained. Frame it as a deliberate period: consulting, learning, family responsibility, health, or research. Even informal work counts. During your active application period, take one concrete step that shows continued development: an online certification, a freelance project, or a published article. When asked in interviews, be direct and brief, then pivot immediately to what you are doing now and why you are the right person for this role.'):'')
    +(situation==='returning'?infoBox('blue','Returning from Abroad','Returning professionals are often positioned as "overqualified" or "out of touch with India". Counter this directly in your CV: highlight your international experience as a competitive differentiator. Indian companies in your field actively want people with UK/US/Australia exposure  -  but you need to speak the India market language. Research current India-specific context: who are the market leaders right now, what are the current regulatory or macro challenges in your field, and what does the Indian version of your role look like. This research should be visible in your interviews.'):'')
  );

  /* Skill gaps for target role */
  var cvTips={'fresher':'Your CV must lead with your projects and internships, not your qualification. Every project: what problem it solved, what you built, and one measurable outcome. Education second. Skills section with specific tools and technologies. Length: 1 page maximum.',
    'lateral-same':'Your CV should make it obvious within 5 seconds why you are ready for the target company, not just the target role. Research your target companies specifically  -  mention one product or challenge they face in your cover letter. Tailor your bullet points to the exact keywords in each job description.',
    'promotion':'Your CV and LinkedIn must already show you operating at the next level. Every bullet: frame it as a leader, not a doer. "Led a team of 4 to deliver..." not "Worked on a team that..." Quantify: "Managed P&L of \u20b95Cr" not "Managed budget". If you are not yet doing next-level work in your current role, that is the first gap to close.',
    'career-switch':'A career switch CV leads with a Skills section, not Experience. Position your transferable skills prominently. Take one concrete step that signals commitment to the new field: a relevant certification, a side project, or a published piece. Without this signal, applications will be screened out as "not from the field".',
    'leadership':'At leadership level (\u20b960 LPA+), CVs are read differently  -  screened for P&L ownership, team scale, and business impact. Replace: "managed team" with "scaled team from 8 to 24 across 3 offices in 18 months". Every line must demonstrate business judgment, not just functional expertise. Leadership-level hiring happens primarily through referrals and headhunters, not job portals.'};

  html+=page('skills',
    sectionHead('Section 3: CV Strategy, LinkedIn, and What Gets You Hired','The specific positioning and preparation that converts applications into offers in the India market','#be123c')
    +infoBox('blue','CV Strategy for Your Target Move',cvTips[targetRole]||cvTips['lateral-same'])
    +infoBox('teal','LinkedIn in the India Market','LinkedIn is now the primary hiring channel for professional roles in India above \u20b912 LPA. Actions: (1) Headline should say your target role, not current title ("Product Manager | ex-Amazon | Bangalore" not "Senior Associate at XYZ"). (2) About section: 3 lines on what you do, who you do it for, and one key achievement. Written in first person. (3) Turn on Open to Work for recruiters. (4) Post 1-2 times per week about your field  -  companies actively check whether candidates have a professional presence. (5) Connect with 10-20 hiring managers and recruiters in your target companies this week.')
    +infoBox('green','Naukri Profile Optimisation','Naukri is still the primary channel for most India hiring below \u20b925 LPA and for non-tech sectors. Keep your profile 100% complete. Update your expected CTC to 20-30% above your current CTC (not more  -  outliers are filtered). Set your notice period accurately. "Actively Searching" status gets 3-5x more recruiter views than "Open to Opportunities".')
  );

  /* Action plan */
  var urgency={'asap':'Immediate.','6months':'6 months.','1year':'1 year.','2years':'2 years.','exploring':'Planning phase.','not-specified':'Start now.'}[timeline]||'Start now.';
  var weeks=[
    {w:'Week 1-2',color:'#dc2626',items:[
      'Rewrite your CV for your specific target move ('+({'fresher':'fresher/campus format','lateral-same':'targeted lateral format','promotion':'next-level leadership framing','career-switch':'skills-led career-switch format','leadership':'executive impact format','freelance':'portfolio/consulting format'}[targetRole]||'target role format')+').',
      'Update LinkedIn: headline \u2192 target role + key credential. About section \u2192 written in first person, achievement-led. Open to Work \u2192 on for recruiters.',
      'Update Naukri profile 100% complete. Set current CTC, expected CTC (market rate, not wish), notice period, and "Actively Searching".',
    ]},
    {w:'Week 3-6',color:'#f59e0b',items:[
      'Research target companies. Build a list of 30-50 companies that hire for your target role in your target city. For each: note the company size, recent funding/news, known interview format, and 1-2 people there you can connect with on LinkedIn.',
      'Submit 15-20 tailored applications per week. Each cover letter: 3-4 sentences max. Why this company, one achievement that matches their need, one specific ask. Not a summary of your CV.',
      targetRole==='career-switch'?'Take one certification or complete one project in your target field. This signal is non-negotiable for career switches  -  it demonstrates commitment beyond words.':'Connect with 5-10 people in your target role at target companies. Not HR  -  people doing the job. Ask about the role and team, not for a referral.',
    ]},
    {w:'Week 7-10',color:'#0A2E73',items:[
      'Interview preparation: 8-10 STAR answers covering your most significant achievements. Each answer: Situation (1 sentence), Task (1 sentence), Action (2-3 sentences of what YOU specifically did), Result (one specific number or outcome).',
      'Research the specific interview format for your top 5 target companies. Most companies\' formats are documented on Glassdoor, AmbitionBox, or LinkedIn posts from past candidates.',
      'Begin negotiation preparation: know your market rate (Glassdoor, LinkedIn Salary, Levels.fyi). Know your walk-away number. Practice saying your expected CTC out loud without hesitation.',
    ]},
    {w:'Week 11-16',color:'#14532d',items:[
      'Receive first offers. Do not accept the first offer immediately  -  say "Thank you, I need 48 hours to review." Then negotiate. In India: negotiating CTC is expected. Ask for a revision citing competing offers or market rate.',
      'Maintain applications while in interviews  -  never stop applying until an offer letter is signed. Verbal offers do not count.',
      'After accepting: check your current employment contract for notice period obligations and any non-compete clauses. Inform your current employer professionally regardless of the relationship.',
    ]},
  ];
  var aHtml=infoBox('blue','Your Timeline',urgency)+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'+weeks.map(function(wk){return '<div style="background:#fff;border:1px solid #E4E7EC;border-top:4px solid '+wk.color+'"><div style="background:'+wk.color+';padding:10px 16px"><div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+wk.w+'</div></div><div style="padding:16px">'+wk.items.map(function(item,i){return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#344054;line-height:1.6"><div style="width:20px;height:20px;border-radius:50%;background:'+wk.color+';color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'+item+'</div>';}).join('')+'</div></div>';}).join('')+'</div>';
  html+=page('action',sectionHead('Section 4: Your India Job Search Action Plan','Step-by-step from profile rebuild to offer in hand','#0A2E73',true)+aHtml);
  return html;
}

/* ──────────────────────────────────
   INDIA SALARY REPORT
────────────────────────────────── */
function buildIndiaSalaryReport(A,name,fieldDisplay,qualification,experience,addons){
  var html='';
  var currentSal=A['salary-current']||'7-12lpa';
  var targetSal=A['salary-target']||'20-35lpa';
  var blocker=A['salary-blocker']||'not-sure';
  var timeline=A.timeline||'6months';
  var field=A.field||'business-pm';
  var expYrs=parseInt(experience||'4');

  var r={
    qualification:({'bachelors':70,'bachelors-honours':78,'masters':90,'phd':95,'diploma':40,'professional-cert':65}[qualification])||70,
    experience:Math.min(100,expYrs*10+10),
    english:80,
    docs:({'skill-gap':30,'no-cert':35,'company-ceiling':60,'no-interview':50,'no-applications':55,'profile-weak':40,'not-sure':35}[blocker])||35,
  };
  var overall=Math.round(r.qualification*0.25+r.experience*0.35+r.docs*0.4);

  var salToNum={'0-3lpa':2,'3-7lpa':5,'7-12lpa':9,'12-20lpa':16,'20-35lpa':27,'35-60lpa':47,'60lpa+':70};
  var tarToNum={'5-10lpa':7,'10-20lpa':15,'20-35lpa':27,'35-60lpa':47,'60-100lpa':80,'100lpa+':100};
  var curNum=salToNum[currentSal]||9;
  var tarNum=tarToNum[targetSal]||27;
  var gap=tarNum-curNum;
  var gapPct=curNum>0?Math.round((gap/curNum)*100):0;

  var profileRows=[
    ['Name',name],['Profession',fieldDisplay],
    ['Qualification',getQualDisplay(qualification)],
    ['Experience',expYrs+' years'],
    ['Current salary',currentSal.replace('lpa',' LPA').replace('-','–').replace('+',' and above')],
    ['Target salary',targetSal.replace('lpa',' LPA').replace('-','–').replace('+',' and above')],
    ['Salary gap','\u20b9'+(gap>0?gap:'0')+' LPA ('+gapPct+'% increase needed)'],
    ['Primary blocker',({'skill-gap':'Skill gap','no-cert':'Missing certifications','company-ceiling':'Company ceiling','no-interview':'Interview performance','no-applications':'Not applying actively','profile-weak':'Profile/visibility gap','not-sure':'Not yet identified'}[blocker])||blocker],
  ];
  html+=page('profile',sectionHead('Section 1: Your Salary Gap Analysis','The gap between your current earnings and your target  -  and what is causing it','#0A2E73',true)+buildProfileSection(profileRows,{overall:overall,blockers:[],factors:{qualification:r.qualification,experience:r.experience,language:r.english||r.language||0,docs:r.docs}},'India',A._fn||''));

  /* Market benchmarks */
  var benchmarks={
    'stem-cs':{'3-7lpa':'\u20b9 3-7 LPA is entry-level for freshers. With 1-2 years experience, the market expectation for a developer is \u20b910-18 LPA. If you are below this, the gap is either in your tech stack (are you on current technologies?), the company tier (are you at a Tier 1 or Tier 2 company?), or geography (are you in Bangalore/Pune/Hyderabad?).','7-12lpa':'The transition from \u20b97-12 LPA to \u20b915-25 LPA typically requires either a Tier 1 company move, a specialisation in a higher-demand stack, or demonstrable end-to-end project ownership. Certifications in cloud (AWS SAA, Google Cloud Professional) reliably lift salary bands.','12-20lpa':'At this band, the next jump requires Senior Engineer positioning: system design competency, mentorship evidence, and leadership of at least a small team or project. Data engineering and ML engineering specialisations command significant premiums.','20-35lpa':'To cross \u20b940 LPA: you need either a FAANG/unicorn move, a specialisation in AI/ML or distributed systems, or a management track. The technical track ceiling at Indian companies is roughly \u20b935-45 LPA without management responsibilities.','35-60lpa':'At \u20b935-60 LPA you are at Principal/Staff Engineer or Engineering Manager level. The next band (\u20b960-90 LPA) is Director/VP or Senior Staff at top-tier companies. This requires demonstrated cross-team technical leadership or a P&L-owning management role.'},
    'business-pm':{'3-7lpa':'APM/entry-PM level at a startup or Tier 2 company. Market expectation for 2+ years PM experience is \u20b920-35 LPA. If you are below this, the most common barriers are: (1) company tier (are you at a product company or a services company?), (2) scope of ownership (do you own a user-facing product or only internal tools?).','7-12lpa':'You are likely a PM at a Tier 2 company or services company being asked to do product work. To cross \u20b920 LPA: you need a product company (not services), user-facing ownership, and demonstrable metrics impact. SQL, analytics, and experimentation skills are the most common differentiators.','12-20lpa':'To cross \u20b930 LPA: demonstrate impact at scale (hundreds of thousands of users), ownership of a full product area (not just features), and strong analytical skills. A FAANG, unicorn, or series C+ startup move is the most reliable route.','20-35lpa':'Senior PM/Group PM territory. To cross \u20b940 LPA: you need to be driving product strategy, managing a team of 2-3 PMs, or owning a significant revenue/engagement metric. Strategic thinking, roadmap ownership, and stakeholder influence are the differentiating competencies.','35-60lpa':'Director/Group PM level. \u20b960+ LPA requires either a VP track at a growth-stage startup, Director at a FAANG, or a leadership role at a high-growth Indian unicorn. International experience or an MBA from a Tier 1 institution significantly accelerates this.'},
    'default':{'3-7lpa':'Entry-level. Research the market rate for your exact role at companies 1-2 tiers above your current employer. That gap is the benchmark for your next move.','7-12lpa':'Mid-level. The most reliable salary jump at this stage is a company change. Internal promotions rarely match market rate jumps.','12-20lpa':'Senior level beginning. The next jump requires demonstrable leadership of people, projects, or revenue.','20-35lpa':'Strong senior/lead. The next band requires business ownership (P&L, team, or product)  -  not just execution excellence.','35-60lpa':'Leadership level. Further growth requires executive sponsorship, business impact metrics, and often a company-tier upgrade.'}
  };
  var fieldBench=benchmarks[field]||benchmarks['default'];
  var currentBench=fieldBench[currentSal]||'Your salary is at the upper range. The next jump requires either a company upgrade, a specialisation premium, or a leadership track.';

  html+=page('position',
    sectionHead('Section 2: Market Benchmarks and What Is Actually Blocking Your Salary Growth','What the market pays for your profile and the specific levers that move salary','#7c3aed')
    +infoBox('blue','What the Market Pays for '+fieldDisplay+' at Your Salary Level',currentBench)
    +(gap<=0?infoBox('amber','Target Salary Check','Your target salary is at or below your current salary. This suggests either your target is conservative (the market may support a higher number), or your current salary is already above market rate for your current role/company tier. We recommend checking Glassdoor, LinkedIn Salary, and AmbitionBox for your specific role, city, and company tier before the next negotiation.'):'')
    +'<div style="font-size:15px;font-weight:700;color:#1f1f1f;margin:20px 0 12px">Your Primary Blocker Analysis</div>'
    +{'skill-gap':infoBox('amber','Primary Blocker: Skill Gap','You identified a skill gap as the main barrier. The critical insight: it is rarely the absence of a skill that blocks salary growth  -  it is the absence of the specific 1-2 skills that the next salary band requires. In tech: current-generation frameworks, cloud certifications, or ML/AI skills. In product management: SQL/analytics, experimentation design, or strategic frameworks. In finance: financial modelling, Python, or CFA. Your action plan prioritises identifying exactly which 2 skills close the gap for your specific target role and building them in 4-6 weeks.'),
      'no-cert':infoBox('amber','Primary Blocker: Missing Certifications','Certifications are a filtering mechanism, not a competence signal. Many recruiters use them to shortlist before reading CVs. The value of a certification is its ability to get you past ATS filters and into a human reader\'s hands. Most valuable certifications by field: Tech \u2192 AWS SAA/DevOps, Google Cloud, PMP. Finance \u2192 CFA Level 1/2, FRM. Product \u2192 Google PM certification, AIPMM. Data \u2192 Google Data Analytics, Databricks. Most can be completed in 4-8 weeks at \u20b95,000-20,000.'),
      'company-ceiling':infoBox('red','Primary Blocker: Company Ceiling','This is the most common and least acknowledged salary blocker. At some companies, the internal salary band for your role simply cannot reach the number you deserve. The only solution is to change companies. Internal promotions at ceiling companies typically offer 10-15% increases; market moves offer 25-50%. The action plan below is a structured company-change programme.'),
      'no-interview':infoBox('amber','Primary Blocker: Interview Performance','Applications are generating interviews but interviews are not converting to offers. The conversion gap is almost always in one of three areas: (1) Technical/functional round  -  specific knowledge or framework gaps. (2) Behavioural round  -  STAR answers not structured or not quantified. (3) Negotiation  -  salary discussion handled poorly. The action plan focuses on mock interviews with feedback, STAR answer construction, and salary negotiation scripting.'),
      'no-applications':infoBox('amber','Primary Blocker: Application Volume','The market cannot respond to you if you are not in it. Many professionals submit 3-5 applications per month and wonder why they have no offers. The India market requires 20-30 tailored applications per month to generate 3-5 first-round interviews. The action plan builds a systematic application engine.'),
      'profile-weak':infoBox('amber','Primary Blocker: Profile Visibility','Your CV and LinkedIn are not generating the inbound or application responses your experience warrants. This is a positioning problem, not an experience problem. The fix is specific: rewrite every CV bullet with a metric, rewrite your LinkedIn headline as a value proposition, and ensure you are discoverable for the keywords recruiters search for your exact role.'),
      'not-sure':infoBox('blue','Blocker: External Assessment Needed','You are not sure what is holding you back. This is the most common answer and the most actionable: it means you need a structured external assessment  -  not generic advice. Your Tutorment session will map your profile against the market rate, identify the 1-2 specific gaps, and give you a sequenced plan. Most "not sure" cases resolve to one of: company ceiling, a skills gap in 1-2 specific areas, or a positioning/visibility problem.')}[blocker]||infoBox('blue','Your Blocker','Analysis based on your specific situation.')
  );

  /* Negotiation strategy */
  html+=page('skills',
    sectionHead('Section 3: Salary Negotiation Strategy','How to get from your current salary to your target number  -  the framework that works in India','#be123c')
    +infoBox('blue','The Three Levers of Salary Growth in India','(1) Company change: generates 25-50% uplift in most cases. Internal promotions rarely exceed 10-20%. (2) Certification or skill premium: specific certifications add 15-25% to market rate in certain fields (cloud, data, ML). (3) Level upgrade: moving from "individual contributor" to "team lead" or "team lead" to "manager" adds 30-60% in most organisations. Your action plan uses the lever that is most accessible for your situation.')
    +infoBox('teal','How to Negotiate CTC in India','Step 1: Know your number. Research Glassdoor, LinkedIn Salary, AmbitionBox, and iimjobs salary data for your exact role, company tier, and city. Build a specific target number with data behind it. Step 2: Never give your current CTC first. When asked, say: "I am looking for a market-competitive offer based on the scope of the role. My expectation is \u20b9X LPA." Step 3: If they give a low offer, do not reject it immediately. Say "Thank you. I was expecting \u20b9Y based on my market research. Is there flexibility?" Step 4: If they cannot move on base, negotiate joining bonus, variable, or ESOPs. Step 5: If you have competing offers (even interviews at other companies), mention them: "I have two other processes at similar stages."')
    +infoBox('green','60-Day Market Move Plan','The fastest path to a salary jump: (1) Week 1-2: Update CV and LinkedIn for target salary level. (2) Week 3-6: 20-30 applications/week to companies known to pay target range. (3) Week 7-12: Interviews and offers. (4) Accept best offer. Negotiate. The 60-day plan works because it creates interview pressure across multiple companies simultaneously  -  which is the only reliable negotiation leverage.')
  );

  /* Action plan */
  var weeks=[
    {w:'Week 1-2',color:'#dc2626',items:[
      'Rewrite your CV with every bullet showing a metric. Replace "managed budget" with "managed \u20b9X crore budget". Replace "led team" with "led team of N achieving X outcome". This takes 4-6 hours but is the highest-return activity.',
      'Research market salaries for your exact role at companies 1-2 tiers above your current one. Use Glassdoor, LinkedIn Salary, AmbitionBox, and iimjobs. Write down a specific target number with data to support it.',
      'Update LinkedIn: headline = target role + one credential. About section: 3 lines, achievement-led. Open to Work for recruiters. This generates inbound enquiries within 48-72 hours.',
    ]},
    {w:'Week 3-6',color:'#f59e0b',items:[
      blocker==='no-cert'?'Begin the highest-impact certification for your target salary band. Most can be completed in 3-6 weeks. Online exams can be scheduled 1-2 weeks from study completion.':'Begin targeted applications to your research list of companies known to pay your target range. Submit 15-20 per week, each customised.',
      'Build a tracking spreadsheet: company, role, date applied, status. Review every Friday. A systematic process outperforms random effort by 3-5x.',
      blocker==='profile-weak'?'Ask 2-3 current or former managers to write LinkedIn recommendations specifically mentioning your impact and a metric. These are visible to recruiters and significantly increase response rates.':'Connect with 5-10 people in your target role at target companies. Not for a job, but for a 20-minute conversation about their experience. This generates referrals 30-40% of the time.',
    ]},
    {w:'Week 7-10',color:'#0A2E73',items:[
      'Interview preparation: 8-10 STAR answers. Each answer: Situation (1 sentence), Task (1 sentence), Action (2-3 sentences YOUR actions only), Result (one number). Quantify every result.',
      blocker==='no-interview'?'Book 2-3 mock interviews. Practice your STAR answers out loud with someone who can give honest feedback. Video-record yourself. Most interview failures happen in the first 2 minutes of each answer.':'Continue applications and follow-ups. If application is 2 weeks old with no response, one follow-up email to HR or hiring manager is appropriate.',
      'Prepare your salary negotiation. Know your walk-away number. Practice saying your expected CTC out loud: "I am expecting \u20b9X LPA"  -  confidently, without hesitation or apology.',
    ]},
    {w:'Week 11-16',color:'#14532d',items:[
      'Receive first offers. Do not accept first offer immediately  -  always request 24-48 hours to review.',
      'Negotiate: cite market data and any competing offers. Ask specifically: "Is there any flexibility on the base salary?" Then be quiet and let them respond.',
      'Accept the best offer. Confirm start date, offer letter, and exit process from current employer. Celebrate the gap closed.',
    ]},
  ];
  var aHtml=infoBox('blue','Your Timeline',({'asap':'Immediate.','6months':'6 months.','1year':'1 year.','2years':'2 years.','exploring':'Planning.','not-specified':'Start now.'}[timeline]||'Start now.'))+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'+weeks.map(function(wk){return '<div style="background:#fff;border:1px solid #E4E7EC;border-top:4px solid '+wk.color+'"><div style="background:'+wk.color+';padding:10px 16px"><div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+wk.w+'</div></div><div style="padding:16px">'+wk.items.map(function(item,i){return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#344054;line-height:1.6"><div style="width:20px;height:20px;border-radius:50%;background:'+wk.color+';color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'+item+'</div>';}).join('')+'</div></div>';}).join('')+'</div>';
  html+=page('action',sectionHead('Section 4: Your Salary Growth Action Plan','Step-by-step from current to target salary','#0A2E73',true)+aHtml);
  return html;
}


/* ═══════════════════════════════════
   NEXT STEPS CTA PAGE (shared)
═══════════════════════════════════ */
function buildNextSteps(name,goalDisplay,fieldDisplay,targetDisplay,overallReadiness,RD){
  var firstName=name&&name!=='there'?name.split(' ')[0]:'there';
  var urgencyLine;
  if(RD&&RD.blockers&&RD.blockers.length){
    urgencyLine=name+', your report has identified a critical blocker that needs to be resolved before anything else will move. In your first session, we will build a specific plan to clear it  -  and map out exactly what happens after.';
  } else if(overallReadiness>=70){
    urgencyLine=name+', your profile is strong. You are ready to begin the application process. In your first session we will go through this report together and activate your specific action plan.';
  } else if(overallReadiness>=45){
    urgencyLine=name+', you are closer than you might think. The specific gaps in your profile are fixable  -  and we have worked with people starting from exactly where you are today. Your first session turns this report into a live plan.';
  } else {
    urgencyLine=name+', there is real work ahead  -  but every item in your action plan above is something we guide you through together, step by step. Most people who start where you are reach their goal within 12 months of consistent action.';
  }

  return '<div style="background:linear-gradient(135deg,#0a0f2e,#0A2E73);padding:0">'
    +'<div style="max-width:880px;margin:0 auto;padding:52px 40px 60px;font-family:Inter,sans-serif">'
    +'<div style="text-align:center;margin-bottom:44px">'
    +'<div style="font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#00B3A4;margin-bottom:14px">Your Next Step</div>'
    +'<h2 style="font-size:34px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:14px;font-family:Manrope,Inter,sans-serif">This report is your starting point.</h2>'
    +'<p style="font-size:16px;color:rgba(255,255,255,.72);max-width:580px;margin:0 auto;line-height:1.75">'+urgencyLine+'</p>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:40px">'
    +[
      {n:'01',title:'Session 1  -  Diagnosis',body:'A 60-minute video call with your dedicated counsellor. We go through every section of this report together and build a specific action plan tailored to your exact answers.'},
      {n:'02',title:'Your Live Action Document',body:'After Session 1 you receive a structured document with specific tasks, deadlines, and resources. It is updated after every session and stays live until your goal is reached.'},
      {n:'03',title:'We Work Until It Is Done',body:'We review your applications, CV, research proposals, and documents. We work alongside you  -  not just advising, but actively helping until the outcome is real.'},
    ].map(function(c){
      return '<div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:20px">'
        +'<div style="font-size:10px;font-weight:800;letter-spacing:.15em;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:10px">'+c.n+'</div>'
        +'<div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.3">'+c.title+'</div>'
        +'<p style="font-size:13px;color:rgba(255,255,255,.68);line-height:1.68;margin:0">'+c.body+'</p>'
        +'</div>';
    }).join('')+'</div>'
    +'<div style="text-align:center">'
    +'<a href="https://calendly.com/thetutorment/session1" target="_blank" style="display:inline-block;background:#00B3A4;color:#fff;font-size:16px;font-weight:700;padding:16px 44px;border-radius:8px;text-decoration:none;letter-spacing:.02em;margin-bottom:16px">Book Your Free First Session</a>'
    +'<div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:28px">support@thetutorment.com &nbsp;·&nbsp; +91 90570 54077 &nbsp;·&nbsp; thetutorment.com</div>'
    +'<button onclick="restartChecker()" class="no-print" style="background:transparent;border:1px solid rgba(255,255,255,.3);color:rgba(255,255,255,.7);font-size:13px;padding:10px 24px;border-radius:6px;cursor:pointer;font-family:inherit">Start over with a different goal</button>'
    +'</div>'
    +'</div></div>';
}

/* ═══════════════════════════════════
   ORCHESTRATOR  -  buildFullReport()
   Reads A.goal, dispatches to the
   right builder, assembles everything.
═══════════════════════════════════ */
/* ═══════════════════════════════════
   READINESS ENGINE
   Honest scoring  -  blockers cap the
   overall score. A weighted average
   of 4 factors is meaningless if one
   is a hard gate. This engine finds
   the actual limiting factor and
   calculates accordingly.
═══════════════════════════════════ */
function calcReadiness(goal,qual,exp,english,A){
  var expYrs=parseInt(exp||'0');
  var isIndia=goal==='india-job'||goal==='india-salary';
  var isUpskill=goal==='upskill';
  if(isUpskill) return {overall:Math.min(96,Math.round(Math.min(100,parseInt(exp||'0')<=0?10:parseInt(exp)*10+10)*0.45+({'high-school':30,'diploma':45,'bachelors':70,'bachelors-honours':78,'masters':88,'phd':92,'professional-cert':72}[qual]||70)*0.35+({'beginner':20,'practitioner':45,'competent':62,'advanced':80,'expert':88}[A['upskill-level']||'competent'])*0.2)),blockers:[],factors:{qualification:({'high-school':30,'diploma':45,'bachelors':70,'bachelors-honours':78,'masters':88,'phd':92}[qual])||70,experience:Math.min(100,parseInt(exp||'0')*10+10),language:80,docs:({'beginner':20,'practitioner':45,'competent':62,'advanced':80,'expert':88}[A['upskill-level']||'competent'])||45},hardCap:100};

  /* Raw factor scores */
  var qScore=({'high-school':15,'diploma':35,'bachelors':65,'bachelors-honours':78,'masters':90,'phd':97,'professional-cert':55}[qual])||65;
  var eScore=Math.min(100,expYrs<=0?5:expYrs===1?20:expYrs===2?35:expYrs<=5?60:expYrs<=8?78:expYrs<=12?90:97);
  /* 'not-specified' = question was never asked (upskill/India) = neutral, no blocker */
  var langScore=isIndia?100:(english==='not-specified'?80:({'ielts-high':100,'ielts-65':72,'ielts-mid':35,'oet-b':100,'toefl-high':82,'pte-high':78,'below-required':25,'not-taken':0,'native':55}[english])||0);

  /* Docs/preparation score  -  goal-specific */
  var dScore=50;
  if(goal==='phd-scholarship') dScore=({'conditional':95,'supervisor':78,'reviewed':58,'draft':32,'no-idea':8}[A['phd-proposal']])||8;
  else if(goal==='study-abroad') dScore=({'distinction':82,'merit':62,'pass':45,'below-pass':22,'in-progress':38}[A.grades])||50;
  else if(goal==='professional-registration'){var docs=A['reg-documents']||[];dScore=docs.length>=6?85:docs.length>=4?62:docs.length>=2?38:12;}
  else if(goal==='india-salary') dScore=({'skill-gap':28,'no-cert':32,'company-ceiling':58,'no-interview':48,'no-applications':52,'profile-weak':38,'not-sure':32}[A['salary-blocker']])||32;
  else if(goal==='india-job') dScore=({'fresher':48,'lateral-same':62,'promotion':55,'career-switch':38,'freelance':50,'leadership':65}[A['india-target-role']])||50;
  else dScore=({'nothing':12,'basic':38,'researched':68,'applied':80}[A['visa-awareness']])||28;

  /* ── HARD BLOCKER LOGIC ──
     Some conditions make the overall readiness genuinely low
     regardless of other scores. A counsellor would say:
     "Before we talk about anything else, fix this."
  */
  var blockers=[];
  var hardCap=100; // will be pulled down by blockers

  if(!isIndia){
    /* English is a hard gate for all international goals */
    if(english!=='not-specified'&&english==='not-taken'){
      blockers.push({factor:'English language test',severity:'critical',
        msg:'You have not taken IELTS, OET, or any accepted English test. This is a hard requirement for your visa application, university admission, or professional registration  -  whichever applies. Without this, no application can be submitted. Everything else in your profile is irrelevant until this is done.',
        fix:'Book IELTS Academic or OET this week. This single action unblocks your entire process.'});
      hardCap=Math.min(hardCap,28);
    } else if(english!=='not-specified'&&english==='below-required'){
      blockers.push({factor:'English test  -  below threshold',severity:'critical',
        msg:'Your current English result is below the required threshold for your goal. Regulators and universities do not make exceptions to their English requirements. A resit targeting the specific components below threshold is the only path forward.',
        fix:'Identify which components are below threshold. Prepare 4–6 weeks on those only. Resit.'});
      hardCap=Math.min(hardCap,38);
    } else if(english==='ielts-mid'&&(goal==='professional-registration'||goal==='phd-scholarship')){
      blockers.push({factor:'English score too low for this goal',severity:'critical',
        msg:'IELTS 6.0 is below the minimum for professional registration (HCPC/NMC require 7.0 each band) and most funded PhD programmes (7.0+ overall). Your application will be rejected at the language requirement stage.',
        fix:'Target IELTS 7.0 in all four components. This typically requires 8–12 weeks of targeted preparation.'});
      hardCap=Math.min(hardCap,42);
    }

    /* Qualification gate */
    if((qual==='high-school'||qual==='diploma')&&goal!=='india-job'&&goal!=='india-salary'){
      blockers.push({factor:'Qualification below minimum',severity:'critical',
        msg:'Most international visa routes, university admissions, and professional registration pathways require a minimum Bachelor\'s degree equivalent. A high school certificate or diploma is below this threshold.',
        fix:'Complete a Bachelor\'s degree or investigate bridging programmes in your target country.'});
      hardCap=Math.min(hardCap,22);
    }

    /* Experience gate for jobs */
    if(goal==='job-international'&&expYrs<2){
      blockers.push({factor:'Experience below sponsorship threshold',severity:'moderate',
        msg:'Most employer sponsorship routes (UK Skilled Worker, US H-1B, Australia TSS) require at least 2 years of relevant work experience. At '+expYrs+(expYrs===1?' year':' years')+' you are below this for most roles, particularly without a postgraduate degree.',
        fix:'Build to 2+ years experience, or target graduate-level programmes that lead to a sponsored role.'});
      hardCap=Math.min(hardCap,50);
    }
  }

  /* India-specific blockers */
  if(goal==='india-salary'){
    var blocker=A['salary-blocker']||'';
    if(blocker==='company-ceiling'){
      blockers.push({factor:'Company ceiling  -  not a skill problem',severity:'moderate',
        msg:'Your salary has stalled because your company\'s internal band for your role cannot reach the number you deserve  -  not because of any gap in your abilities. Internal promotions here will never close this gap. The only solution is a company change.',
        fix:'Your action plan is a structured company-change programme, not a skills programme.'});
    }
  }

  /* Calculate final score with blocker caps applied */
  /* Base weighted average */
  var base;
  if(isIndia){
    base=Math.round(qScore*0.3+eScore*0.45+dScore*0.25);
  } else {
    base=Math.round(langScore*0.32+qScore*0.22+eScore*0.28+dScore*0.18);
  }
  var overall=Math.min(base,hardCap);
  /* Never show 100%  -  even perfect profiles have steps to complete */
  overall=Math.min(overall,96);

  return {
    overall:overall,
    factors:{qualification:qScore,experience:eScore,language:langScore,docs:dScore},
    blockers:blockers,
    hardCap:hardCap
  };
}

/* ── Personal language engine ──
   Takes the person's name + answers,
   returns sentences addressing them
   directly as a counsellor would.
*/
function personal(firstName,sentences){
  /* Replace [NAME] placeholder with first name */
  return sentences.replace(/\[NAME\]/g,firstName&&firstName!=='there'?firstName:'you');
}

function buildFullReportTemplate(){
  var firstName = P.firstName||'';
  var lastName  = P.lastName||'';
  var name      = (firstName+(lastName?' '+lastName:'')).trim()||'';
  var fn        = firstName||''; /* first name for personal address */

  /* ── Goal normalization: handle write-in values ──
     If someone typed a custom goal, map it to the nearest known goal
     or default to a clarification-aware fallback.
  */
  var KNOWN_GOALS=['phd-scholarship','study-abroad','job-international','professional-registration',
                   'india-job','india-salary','upskill','migrate'];
  var rawGoal = A.goal||'';
  if(KNOWN_GOALS.indexOf(rawGoal)===-1){
    /* Try to infer from the written text */
    var gl=rawGoal.toLowerCase();
    if(/phd|research|scholarship|funded|doctorate/.test(gl)) A.goal='phd-scholarship';
    else if(/study|university|masters|mba|abroad|degree/.test(gl)) A.goal='study-abroad';
    else if(/job|work|employ|career|sponsor|visa|relocat|move|international/.test(gl)) A.goal='job-international';
    else if(/regist|hcpc|nmc|gmc|ahpra|licen|certif.*abroad/.test(gl)) A.goal='professional-registration';
    else if(/india.*job|placement|campus|hire.*india/.test(gl)) A.goal='india-job';
    else if(/salary|pay|increment|raise|earn|compens/.test(gl)) A.goal='india-salary';
    else if(/skill|learn|upskill|course|certif|train/.test(gl)) A.goal='upskill';
    else if(/migrat|settl|pr|permanent|citizen/.test(gl)) A.goal='migrate';
    else if(/confus|not sure|unsure|unclear|help|guidance|don.*know|explore|open/.test(gl)){
      /* Person is confused - set a special flag and default to clarification */
      A._confused=true;
      A._rawGoal=rawGoal;
      /* Default to upskill as least-harmful fallback, but report will acknowledge confusion */
      A.goal='upskill';
    } else {
      /* Unknown write-in - treat as upskill */
      A.goal='upskill';
    }
  }

  var goal     = A.goal||'job-international';
  var field    = A.field||'business-pm';
  var qual     = A.qualification||'bachelors';
  var exp      = A.experience||'2';
  var target   = A['target-country']||(
    (goal==='india-job'||goal==='india-salary')?'india':
    (goal==='upskill')?'':
    'uk'
  );
  var english  = A.english||'not-specified'; /* 'not-specified' means not asked, not absent */
  var timeline = A.timeline||'1year';
  var addons   = A.addons||[];
  var expYrs   = parseInt(exp||'0');

  var fieldDisplay  = getFieldDisplay(field);
  var goalDisplay   = getGoalDisplay(goal);
  var targetDisplay = getCountryDisplay(target);
  var date = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  var isIndia = goal==='india-job'||goal==='india-salary';

  /* ── Honest readiness calculation ── */
  var RD = calcReadiness(goal,qual,exp,english,A);
  if(A._confused){RD._confused=true;RD._rawGoal=A._rawGoal||'';}
  var overallReadiness = RD.overall;

  /* Pass fn (first name) into all goal builders */
  A._fn = fn;

  /* ── Build goal-specific pages ── */
  var goalPages='';
  if(goal==='phd-scholarship'){
    goalPages=buildPhdReport(A,name,fieldDisplay,targetDisplay,target,qual,exp,english,addons);
  } else if(goal==='study-abroad'){
    goalPages=buildStudyAbroadReport(A,name,fieldDisplay,targetDisplay,target,qual,exp,english,addons);
  } else if(goal==='job-international'){
    goalPages=buildIntlJobReport(A,name,fieldDisplay,targetDisplay,target,qual,exp,english,addons);
  } else if(goal==='professional-registration'){
    goalPages=buildRegReport(A,name,fieldDisplay,targetDisplay,A['target-country']||target,qual,exp,english,addons);
  } else if(goal==='india-job'){
    goalPages=buildIndiaJobReport(A,name,fieldDisplay,'India',qual,exp,addons);
  } else if(goal==='india-salary'){
    goalPages=buildIndiaSalaryReport(A,name,fieldDisplay,qual,exp,addons);
  } else if(goal==='upskill'){
    goalPages=buildUpskillReport(A,name,fieldDisplay,qual,exp,addons);
  } else if(goal==='migrate'){
    goalPages=buildMigrateReport(A,name,fieldDisplay,targetDisplay,target,qual,exp,english,addons);
  } else {
    /* unknown goal fallback */
    goalPages=buildUpskillReport(A,name,fieldDisplay,qual,exp,addons);
  }

  /* ── Build addon sections ── */
  var addonPages='';
  var addonsArr=A.addons||[];
  var _isStudent=(typeof isStudent==='function')?isStudent(qual):(qual==='student-mba'||qual==='student-bachelors'||qual==='student-masters'||qual==='phd-student');

  /* ── ADDON SECTIONS — wired to actual addon keys from getAddonOpts() ──
     Keys: visa-detail, pr-pathway, cv-guide, cv-review, scholarship-list,
           university-shortlist, personal-statement, doc-checklist,
           interview-prep, negotiation, market-data, action-detail
  */
  /* return-india is not a language-test goal even though it's migrate */
  var _isReturnIndia=(goal==='migrate'&&target==='return-india');
  var isIntlGoal=(goal==='job-international'||goal==='migrate'||goal==='professional-registration'||goal==='phd-scholarship'||goal==='study-abroad')&&!_isReturnIndia;

  var has=function(key){ return addonsArr.indexOf(key)!==-1; };

  /* English test guide */
  if(isIntlGoal&&(english==='not-taken'||english==='below-required'||has('action-detail'))){
    addonPages+=buildEnglishTestGuide(fn,goal,target,fieldDisplay);
  }

  /* Global comparison / visa breakdown */
  if(isIntlGoal&&(target==='open'||has('visa-detail')||has('pr-pathway'))){
    addonPages+=buildGlobalComparison(fn,fieldDisplay,goal,qual,exp,english);
  }

  /* CV guide + outreach templates */
  if(has('cv-guide')||has('cv-review')){
    if(goal==='job-international'||goal==='migrate'){
      addonPages+=buildOutreachTemplates(fn,fieldDisplay,targetDisplay,target,qual,exp);
    }
    addonPages+=buildSampleCV(fn,fieldDisplay,targetDisplay,qual,exp);
  }

  /* Interview preparation */
  var _isReturn=(target==='return-india');
  if(has('interview-prep')){
    addonPages+=buildInterviewGuide(fn,fieldDisplay,targetDisplay,exp,qual);
  } else if(isIntlGoal&&(goal==='job-international'||goal==='migrate')&&!_isReturn){
    /* Always include brief interview guide for international job/migrate unless returning */
    addonPages+=buildInterviewGuide(fn,fieldDisplay,targetDisplay,exp,qual);
  }

  /* Salary negotiation (india-salary) */
  if(has('negotiation')&&goal==='india-salary'){
    addonPages+=buildNegotiationGuide(fn,fieldDisplay,A['salary-current']||'',A['salary-target']||'');
  }

  /* Market data (india-salary) */
  if(has('market-data')){
    /* Market data is already embedded in Section 5 of upskill/salary reports — no duplicate */
  }

  /* Scholarship / university list (phd / study) */
  if(has('scholarship-list')||has('university-shortlist')){
    /* These are already inside the PhD and study abroad goal builders */
  }

  /* Doc checklist (registration) */
  if(has('doc-checklist')&&goal==='professional-registration'){
    /* Already inside reg report builder as a checklist section */
  }

  /* ── Assemble ── */
  var html='';
  var coverTarget=isIndia?'India':(goal==='upskill'?fieldDisplay:targetDisplay);
  html+=buildCover(name,fieldDisplay,goalDisplay,coverTarget,overallReadiness,date,RD);
  html+=goalPages;
  html+=addonPages;
  html+=buildNextSteps(fn,goalDisplay,fieldDisplay,isIndia?'India':(goal==='upskill'?fieldDisplay:targetDisplay),overallReadiness,RD);

  document.getElementById('report-html').innerHTML=html;
  window.scrollTo({top:0,behavior:'instant'});

  /* Auto-save report to account if user is logged in */
  var token=localStorage.getItem('tt_token');
  if(token){
    var reportPayload={
      goal:goal, field:fieldDisplay, target:targetDisplay,
      readiness:overallReadiness,
      htmlContent:html,
      answers:A
    };
    var apiBase=window.location.hostname==='localhost'
      ?'http://localhost:3000/api':'https://tutorment-backend-wjew.onrender.com/api';
    fetch(apiBase+'/reports',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify(reportPayload)
    }).then(function(r){return r.json();}).then(function(d){
      if(d.success){
        /* Show saved indicator */
        var indicator=document.createElement('div');
        indicator.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#16a34a;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;z-index:500;font-family:Inter,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.15)';
        indicator.textContent='Report saved to your account';
        document.body.appendChild(indicator);
        setTimeout(function(){indicator.remove();},3000);
      }
    }).catch(function(){});
  }
}

/* ═══════════════════════════════════
   RESTART
═══════════════════════════════════ */
function restartChecker(){
  A={}; hist=[]; addOns=[];
  currentQId='q-goal';
  document.getElementById('page-report').style.display='none';
  document.getElementById('page-checker').style.display='block';
  window.scrollTo({top:0,behavior:'instant'});
  renderQ(getQ(currentQId));
}


/* ──────────────────────────────────
   UPSKILL REPORT
   Fully personalised to field +
   experience level + upskill goal.
   No job search content. No visa.
   No country assumptions.
────────────────────────────────── */
function buildUpskillReport(A,name,fieldDisplay,qual,exp,addons){
  var html='';
  var fn=A._fn||'';
  var expYrs=parseInt(exp||'0');
  var field=A.field||'business-pm';
  var upskillGoal=A['upskill-goal']||'get-promoted';
  var currentLevel=A['upskill-level']||'competent';
  var targetCert=A['target-cert']||'explore';
  var pmpMonths=A['pmp-project-months']||'not-asked';
  var existingCerts=A['existing-certs']||[];
  var timeline=A.timeline||'6months';
  var expLabel=expYrs===0?'no experience':expYrs<=2?'early career':expYrs<=5?'mid-career':expYrs<=8?'senior':expYrs<=12?'lead/principal':'director+';
  var hasDegree=qual==='bachelors'||qual==='bachelors-honours'||qual==='masters'||qual==='phd';

  /* ═══════════════════════════════════
     CERTIFICATION ELIGIBILITY ENGINE
     Analyses the specific cert chosen
     against the person's actual profile.
     Returns a verdict object.
  ═══════════════════════════════════ */
  var certVerdict=null;

  if(targetCert==='pmp'){
    var reqMonths=hasDegree?24:36;
    var actualMonths={'under-12':6,'12-23':18,'24-35':30,'36-plus':42,'not-sure':0,'not-asked':expYrs*12}[pmpMonths]||0;
    var pmpEligible=actualMonths>=reqMonths;
    var pmpBorderline=!pmpEligible&&actualMonths>=(reqMonths-6);

    certVerdict={
      cert:'PMP  -  Project Management Professional',
      issuer:'PMI (Project Management Institute)',
      eligible:pmpEligible,
      borderline:pmpBorderline,
      verdict:pmpEligible
        ?(fn?fn+', you are eligible for the PMP. Here is exactly what you need to apply.':
          'You are eligible for the PMP. Here is exactly what you need to apply.')
        :pmpBorderline
        ?(fn?fn+', you are borderline for PMP eligibility. With '+actualMonths+' months of project-leading experience, you are '+(reqMonths-actualMonths)+' months short of the '+reqMonths+'-month requirement. You have two options: (1) Continue accumulating qualifying experience and apply in '+(reqMonths-actualMonths)+' months. (2) Apply now if you can demonstrate that some of your experience meets the criteria  -  PMI\'s definitions are sometimes broader than candidates assume.':
          'You are borderline for PMP eligibility. See details below.')
        :(fn?fn+', you are not yet eligible for the PMP. The requirement is '+reqMonths+' months of project-leading experience with a '+(hasDegree?'degree':'no degree')+'. You currently have approximately '+actualMonths+' months. The right credential for you right now is CAPM (no experience required) or PRINCE2 Foundation (no experience required). Complete one of these while building toward PMP eligibility.':
          'You are not yet eligible for PMP. See recommendations below.'),
      requirements:[
        ['Formal education','Bachelor\'s degree or higher (you have this ✓)'],
        ['Project leadership experience',reqMonths+' months leading projects '+(hasDegree?'(with degree)':'(without degree)')+'  -  you have ~'+actualMonths+' months'],
        ['Application','Fill PMI application online. PMI audits ~30% of applications  -  keep time logs and project records.'],
        ['Education hours','35 hours of formal PM education (PDUs) required before sitting the exam. CAPM, PRINCE2, or a formal training course satisfies this.'],
        ['Exam format','180 questions, 230 minutes. Mix of predictive (waterfall), agile, and hybrid scenarios. Passing score is not published  -  performance-based.'],
        ['Exam cost','USD 405 (PMI member) or USD 555 (non-member). PMI membership is USD 139/year and saves you money if you plan to take the exam.'],
        ['Renewal','60 PDUs every 3 years to maintain PMP. Roughly 20 hours of PM learning per year.'],
      ],
      alreadyHasCapm:existingCerts.indexOf('capm')!==-1,
      alreadyHasPrince2:existingCerts.indexOf('prince2-f')!==-1||existingCerts.indexOf('prince2-p')!==-1,
      studyPlan:pmpEligible?[
        'Step 1  -  Complete 35 PDU hours: CAPM prep course (PMI approved), or a structured PMP boot camp. Budget: ₹5,000–₹25,000 or equivalent.',
        'Step 2  -  Study material: PMI\'s PMBOK Guide 7th Edition (free for members) + Agile Practice Guide + Rita Mulcahy\'s PMP Exam Prep (most popular prep book).',
        'Step 3  -  Practice exams: PM PrepCast (prepcast.com)  -  1,600+ practice questions. Target 80%+ in mock exams before sitting the real one.',
        'Step 4  -  Submit application on PMI\'s website. Be precise about project details  -  PMI audits applications. Use a spreadsheet to log each project\'s dates, role, and hours.',
        'Step 5  -  Schedule exam within 1 year of application approval. Pearson VUE test centres or online proctored. Recommended study time: 60–120 hours depending on experience.',
        'Timeline: 3–6 months from starting study to exam day. Most working professionals study 1–2 hours/day.',
      ]:[
        'You are not yet eligible for PMP. Immediate recommendation:',
        'Option A  -  CAPM first: No experience required. 23 hours PM education needed. Exam: USD 225 (PMI member). Valid 3 years. Demonstrates commitment while you build PMP-eligible experience.',
        'Option B  -  PRINCE2 Foundation: No experience required. 2–3 day course. Widely recognised in UK, Australia, government, and large corporates. More practical than CAPM for many roles.',
        'Option C  -  CSM or PSM: Certified Scrum Master (2-day course) or Professional Scrum Master (exam only). Highly relevant if your projects use agile/scrum.',
        'Timeline to PMP eligibility: '+(reqMonths-actualMonths)+' more months of leading projects. Keep a project log now  -  retroactive reconstruction for PMI audits is harder.',
      ],
    };
  }

  else if(targetCert==='capm'){
    certVerdict={
      cert:'CAPM  -  Certified Associate in Project Management',
      issuer:'PMI (Project Management Institute)',
      eligible:true,
      borderline:false,
      verdict:fn?fn+', you are fully eligible for CAPM. There is no work experience requirement  -  only 23 hours of project management education.':
        'You are fully eligible for CAPM. No work experience required.',
      requirements:[
        ['Secondary education (secondary school)','Required  -  you exceed this ✓'],
        ['23 hours PM education','Must be documented. A structured online course (Udemy, Coursera) or PMI-approved training counts.'],
        ['No work experience required','CAPM is the entry-level PMI credential. It demonstrates foundational knowledge.'],
        ['Exam format','150 questions, 3 hours. Multiple choice. Based on PMBOK Guide 7th Edition.'],
        ['Exam cost','USD 225 (PMI member) or USD 300 (non-member).'],
        ['Renewal','15 PDUs every 3 years, or retake the exam.'],
      ],
      alreadyHasCapm:existingCerts.indexOf('capm')!==-1,
      studyPlan:[
        'Step 1  -  Complete 23 hours PM education: Any PMI-approved course on Udemy (typically ₹500–₹2,000), Coursera, or LinkedIn Learning.',
        'Step 2  -  Apply on PMI website. Approval is usually within 5 business days.',
        'Step 3  -  Study PMBOK Guide 7th Edition (free for PMI members). Andrew Ramdayal\'s CAPM prep course on Udemy is highly recommended (4.7★, 30,000+ students).',
        'Step 4  -  Practice exams: PMI\'s own practice tests + free resources on PM PrepCast. Target 75%+ before sitting.',
        'Step 5  -  Schedule and sit exam. Pearson VUE online or test centre.',
        'Timeline: 4–8 weeks study for most working professionals.',
      ],
    };
    if(existingCerts.indexOf('capm')!==-1){
      certVerdict.verdict=fn?fn+', you already hold CAPM. This means you should now be targeting PMP, not CAPM. Your report has been updated to reflect this.':
        'You already hold CAPM. Target PMP instead.';
      certVerdict.eligible=false; // effectively ineligible because already have it
    }
  }

  else if(targetCert==='prince2'){
    var hasFoundation=existingCerts.indexOf('prince2-f')!==-1;
    var hasPractitioner=existingCerts.indexOf('prince2-p')!==-1;
    certVerdict={
      cert:hasFoundation?'PRINCE2 Practitioner':'PRINCE2 Foundation + Practitioner',
      issuer:'Axelos / PeopleCert',
      eligible:true,
      borderline:false,
      verdict:hasPractitioner
        ?(fn?fn+', you already hold PRINCE2 Practitioner  -  the highest PRINCE2 level. Consider PRINCE2 Agile, MSP (Managing Successful Programmes), or P3O as the logical next credential.':
          'You already hold PRINCE2 Practitioner. Consider PRINCE2 Agile or MSP next.')
        :hasFoundation
        ?(fn?fn+', you hold PRINCE2 Foundation. The natural next step is PRINCE2 Practitioner. No additional work experience is required  -  just pass the Practitioner exam.':
          'You hold Foundation. Practitioner is the clear next step.')
        :(fn?fn+', you are fully eligible for PRINCE2 Foundation. No experience or education prerequisites.':
          'You are fully eligible for PRINCE2. No prerequisites.'),
      requirements:[
        ['Foundation prerequisites','None  -  any level of education, no experience required.'],
        ['Practitioner prerequisite','Must hold PRINCE2 Foundation (or CAPM, PMP, IPMA  -  they are accepted as equivalent).'],
        ['Exam format','Foundation: 60 multiple choice questions, 60 minutes, open book not permitted. Practitioner: 68 questions, 150 minutes, open book (PRINCE2 manual).'],
        ['Exam cost','Foundation: ~£200–£250. Practitioner: ~£280–£320. Combined packages available from Axelos training partners.'],
        ['Renewal','Practitioner renewal every 3 years via CPD (Continuing Professional Development) hours, or resit.'],
        ['Where it matters most','UK, Australia, government contracts globally, and large corporate environments using structured project methodology.'],
      ],
      studyPlan:hasFoundation?[
        'Step 1  -  Official PRINCE2 Practitioner manual (the Managing Successful Projects guide)  -  essential, open book in the exam.',
        'Step 2  -  Accredited training course (Axelos partner). 2-day classroom or equivalent online. Not strictly required but significantly increases pass rate.',
        'Step 3  -  Practice papers: official Axelos sample papers + training provider mock exams.',
        'Step 4  -  Book exam through PeopleCert. Can sit online proctored.',
        'Timeline: 2–4 weeks study if you hold Foundation.',
      ]:[
        'Step 1  -  Book a Foundation + Practitioner combined course. Most providers offer 3–5 day combined packages. Budget: ₹15,000–₹40,000 or equivalent.',
        'Step 2  -  Foundation exam first (typically day 2–3 of the course). Practitioner exam same week or within 4 weeks.',
        'Step 3  -  Study the PRINCE2 manual alongside the course  -  it is the open-book reference in the Practitioner exam.',
        'Step 4  -  Practice exams for both levels. Axelos provides official sample papers free online.',
        'Timeline: 3–5 days intensive training + 1–2 weeks self-study. Total: 3–4 weeks.',
      ],
    };
  }

  else if(targetCert==='aws-saa'){
    certVerdict={
      cert:'AWS Solutions Architect Associate (SAA-C03)',
      issuer:'Amazon Web Services',
      eligible:true,
      borderline:false,
      verdict:existingCerts.indexOf('aws-saa')!==-1
        ?(fn?fn+', you already hold AWS SAA. The logical next step is AWS Solutions Architect Professional or a speciality cert (Security, Database, ML) depending on your career direction.':
          'You already hold AWS SAA. Target the Professional level or a speciality cert.')
        :(fn?fn+', there are no formal prerequisites for AWS SAA  -  it is open to everyone. The question is not eligibility, it is readiness: AWS recommends 1 year of hands-on AWS experience, but many people pass with 3–4 months of dedicated study without prior AWS experience.':
          'No prerequisites for AWS SAA. Readiness depends on your current cloud exposure.'),
      requirements:[
        ['Prerequisites','None formal. AWS recommends 1 year hands-on experience, but this is advisory.'],
        ['Practical experience','You need to have actually used the AWS console and core services (EC2, S3, RDS, VPC, IAM, Lambda)  -  not just read about them. A free-tier AWS account costs nothing.'],
        ['Exam format','65 questions (multiple choice + multiple response), 130 minutes. Score 720/1000 to pass.'],
        ['Exam cost','USD 150. Booking through Pearson VUE or PSI.'],
        ['Renewal','3-year recertification  -  retake exam or pass a higher-level AWS cert.'],
        ['Salary impact','AWS SAA typically adds ₹3–8 LPA to salary in India, and USD 10,000–20,000 in US/UK markets at cloud-focused roles.'],
      ],
      studyPlan:[
        'Step 1  -  Create a free AWS account. Spend 2 weeks just using the console: launch EC2 instances, create S3 buckets, set up VPCs. You cannot pass this exam without hands-on time.',
        'Step 2  -  Study course: Stephane Maarek\'s SAA course on Udemy (4.8★, most popular AWS course globally  -  ~₹500 on sale). 24 hours of content.',
        'Step 3  -  Practice exams: Tutorials Dojo (tutorialsdojo.com)  -  6 full practice exams. This is the most important step. Study until you score 80%+ consistently.',
        'Step 4  -  Read the AWS FAQs for the key services: EC2, S3, RDS, VPC, IAM, Lambda, CloudFront, Route 53. These are frequently tested.',
        'Step 5  -  Book exam when scoring 80%+ on practice exams. Do not book a fixed date in advance  -  book when ready.',
        'Timeline: 6–12 weeks for most people studying 1–2 hours/day. With 3–4 hours/day: 4–6 weeks.',
      ],
    };
  }

  else if(targetCert==='cfa-1'){
    certVerdict={
      cert:'CFA Level 1',
      issuer:'CFA Institute',
      eligible:true,
      borderline:false,
      verdict:fn?fn+', you are eligible for CFA Level 1  -  it has no work experience requirement. CFA is one of the most demanding professional certifications in the world. The pass rate is 35–44% globally. Plan for 300 hours of study minimum.':
        'You are eligible for CFA Level 1. Plan for 300+ hours of study.',
      requirements:[
        ['Prerequisites','Bachelor\'s degree OR be in the final year of a bachelor\'s programme. You meet this ✓'],
        ['English proficiency','Exam is in English only  -  no language test required but strong English reading is essential.'],
        ['Exam format','Level 1: 180 questions, two 135-minute sessions. Computer-based. Four sittings per year (Feb, May, Aug, Nov).'],
        ['Exam cost','Early registration: ~USD 900–1,050. Late: up to USD 1,450. One-time enrolment fee: USD 350.'],
        ['Pass rate','35–44% globally for Level 1. Most candidates study 300+ hours.'],
        ['Work experience for charter','4 years of relevant investment decision-making experience needed after passing all 3 levels to receive the CFA charter designation.'],
        ['Commitment','3 levels total. Average time to charter: 4 years. One of the most rigorous professional credentials in existence.'],
      ],
      studyPlan:[
        'Step 1  -  Register early (6 months before your target sitting). Study materials are provided by CFA Institute after registration.',
        'Step 2  -  Official CFA curriculum (6 volumes, included with registration). Most candidates use third-party prep providers alongside: Kaplan Schweser Notes (most popular), AnalystPrep, or Salt Solutions.',
        'Step 3  -  Build a weekly study schedule: 12–15 hours/week for 6 months = 300 hours. Do not attempt to cram.',
        'Step 4  -  Mock exams in the last 4–6 weeks. CFA Institute provides mock exams. AnalystPrep and Kaplan offer additional mocks. Target 65%+ before sitting.',
        'Step 5  -  Topic area weighting: Ethics (15–20%) is disproportionately important  -  strong ethics scores can pass a borderline candidate.',
        'Timeline: 6 months minimum. Most candidates take one Level per year.',
      ],
    };
  }

  /* ── Readiness for upskilling  -  cert-specific logic ──
     If a cert is targeted:
     - eligible = 78–88 docs score
     - borderline = 45–55 docs score
     - ineligible = 15–25 docs score
     - explore/no cert targeted = based on current level
     Experience and qualification are still factored.
     But the OVERALL is honest: if you target PMP and have
     zero PM project months, you cannot be 73% ready.
  ── */
  var certEligScore;
  if(certVerdict){
    if(certVerdict.eligible){
      /* Already has the cert? Score drops  -  should target next level */
      if((certVerdict.alreadyHasCapm&&targetCert==='capm')||(certVerdict.alreadyHasPractitioner&&targetCert==='prince2')) certEligScore=20;
      else certEligScore=80;
    } else if(certVerdict.borderline){
      certEligScore=48;
    } else {
      certEligScore=18;
    }
  } else {
    certEligScore=({'beginner':20,'practitioner':42,'competent':58,'advanced':75,'expert':85}[currentLevel])||45;
  }
  var r={
    qualification:({'high-school':30,'diploma':45,'bachelors':65,'bachelors-honours':72,'masters':85,'phd':90,'professional-cert':68}[qual])||65,
    experience:Math.min(100,expYrs<=0?8:expYrs===1?22:expYrs===2?36:expYrs<=5?55:expYrs<=8?72:expYrs<=12?84:92),
    language:80,
    docs:certEligScore,
  };
  /* Weighted: docs/cert-eligibility is the dominant factor for cert readiness */
  var overall=Math.min(94,Math.round(r.qualification*0.18+r.experience*0.28+r.docs*0.54));

  /* ── What the person actually needs by field + level ── */
  var skillMatrix={
    'business-pm':{
      beginner:{
        gaps:['Writing product requirements (PRDs and user stories)','Running user interviews and synthesising insights','Prioritisation frameworks (RICE, MoSCoW, opportunity scoring)','Working with engineers  -  understanding sprint ceremonies and how to unblock','Metrics  -  defining success, tracking it, acting on data'],
        certs:['Google Project Management Certificate (Coursera  -  6 months, free audit)','Reforge Foundations (most respected PM community globally)','AIPMM CPPM (Certified Product Manager)'],
        resources:['Inspired by Marty Cagan  -  read this before anything else','Lenny\'s Newsletter (lennysnewsletter.com)  -  PM industry standard','ProductSchool free content on YouTube'],
        mentors:'A PM mentor 2–3 years ahead of you is the fastest shortcut. Someone who has shipped a product at a real company, not just a consultant.',
        timeToNextLevel:'6–12 months of deliberate practice with a real product, not just theory.'
      },
      practitioner:{
        gaps:['Stakeholder management  -  aligning engineering, design, marketing, and leadership without authority','Data analysis beyond vanity metrics  -  cohort analysis, funnel drop-off, experimentation design','Product strategy  -  making the case for what NOT to build','Communication upward  -  writing PMs briefings that executives act on'],
        certs:['Reforge Product Strategy (most respected PM programme, cohort-based)','Pragmatic Institute PMC Level I + II','SQL for PMs  -  Mode Analytics course (free, 20 hours)'],
        resources:['Shape Up by Ryan Singer (free online)  -  alternative to scrum for product teams','Measure What Matters by John Doerr  -  OKR framework','Stratechery by Ben Thompson  -  strategy thinking applied to real products'],
        mentors:'A Senior PM or Group PM at a product-led company (not services). Someone who has defined a product strategy, not just executed features.',
        timeToNextLevel:'4–8 months with specific gap targeting. Promotion timelines vary: 18–30 months at most companies.'
      },
      competent:{
        gaps:['Product vision and multi-year roadmapping - ability to articulate a 3-year direction with bets, trade-offs, and success metrics, not just a quarterly feature list','Portfolio management - running 3+ concurrent product areas with shared engineering resources and conflicting priorities, making defensible trade-off decisions','Influencing without authority - getting engineering, design, data, legal, and marketing aligned on a decision they did not initially agree with','Qualitative-to-quantitative translation - running a user interview series and converting insights into testable hypotheses with defined success metrics','Pricing strategy and monetisation thinking - understanding unit economics, willingness-to-pay research, and feature packaging decisions'],
        certs:['PMP (Project Management Professional) - relevant if your role is project or programme management. Requires 24 months leading projects with a degree. Adds 20-22% salary premium on the open market (PMI Salary Survey 2023).','PMI-ACP (Agile Certified Practitioner) - if you work in agile environments. More rigorous than CSM or PSPO. Requires 21 hours agile education and 8 months agile project experience.','SAFe POPM (Scaled Agile Product Owner/PM) - if you work in a large enterprise on SAFe. Increasingly listed in enterprise PM job descriptions in BFSI, government, and large tech.','Honest truth: no certification gets a PM promoted. What gets PMs promoted is documented business impact - owning a metric, moving it measurably, and being able to show the before and after. Certifications add salary value on the external job market. They do not substitute for evidence of impact inside your current company.'],
        resources:['Continuous Discovery Habits by Teresa Torres - the most practical book on building sustainable user research habits. Closes the qualitative-to-hypothesis gap directly.','Working Backwards by Colin Bryar and Bill Carr - how Amazon structures product decisions from the customer outcome backward. The most transferable product framework available in writing.','Good Strategy Bad Strategy by Richard Rumelt - what strategy actually means versus a list of goals. Directly improves how you write roadmaps and defend trade-offs to stakeholders.'],
        mentors:'A Director of Product or VP Product who currently manages a team of PMs and has had direct P&L or revenue metric ownership. Not a consultant or coach - someone doing the job you want in 2 years, inside a company similar to yours.',
        timeToNextLevel:'6-18 months of deliberate, documented impact. The competent-to-senior transition fails most often because the person cannot point to a specific metric they owned and moved. Each week of your learning plan should produce evidence, not just knowledge.'
      },
      advanced:{
        gaps:['Team leadership  -  developing junior PMs, giving feedback, running 1:1s','Business model thinking  -  unit economics, LTV/CAC, P&L ownership','Executive communication  -  board-level narrative, investor framing','Org design  -  when to have a PM, when not to, how to structure product teams','Cross-company influence  -  partnerships, platform thinking, ecosystem strategy'],
        certs:['Harvard Business School Online (Strategy, Leadership, or Finance for Non-Financial Managers)','Reforge Exec track','Executive coaching  -  more impactful than any course at this level'],
        resources:['The Making of a Manager by Julie Zhuo  -  essential for first-time people managers','Good Strategy Bad Strategy by Richard Rumelt  -  strategy at the executive level','No Rules Rules by Reed Hastings  -  high-performance culture building'],
        mentors:'A VP Product or CPO who has scaled a product org from 5 to 50+ people. The gap at this level is almost never technical  -  it is leadership, judgment, and business sense.',
        timeToNextLevel:'12–24 months. Director+ roles require demonstrable people leadership. You cannot be promoted into people management  -  you have to demonstrate it before you get the title.'
      },
      expert:{
        gaps:['External visibility  -  building a public reputation that makes opportunities come to you','Advisory board and fractional CPO positioning','Thought leadership  -  writing or speaking that demonstrates differentiated perspective','Investor and board-level communication','Building and leading product organisations from scratch'],
        certs:['Executive MBA if you want a formal credential (only worth it if it opens specific networks)','Board director programmes (IoD in UK, for example)','Speaking engagements  -  present at Mind the Product, ProductCon, or local PM meetups'],
        resources:['Working Backwards by Colin Bryar (Amazon\'s product process from the inside)','Zero to One by Peter Thiel  -  for building something genuinely new','Write publicly  -  a newsletter, LinkedIn articles, or a blog. Your thinking is your portfolio at this level.'],
        mentors:'Peer-level CPOs and investors. At this level, mentors are mostly peers. The most valuable conversations are with other senior product leaders at companies solving similar problems.',
        timeToNextLevel:'You are at the top of the individual career ladder. The next move is CPO, General Manager, or founder.'
      }
    },
    'stem-cs':{
      beginner:{
        gaps:['Solid programming fundamentals in at least one language  -  Python or JavaScript recommended','Data structures and algorithms (required for any technical interview)','Version control with Git and collaborative development workflow','Basic system design  -  how web applications actually work end to end','Reading and understanding other people\'s code'],
        certs:['CS50x (Harvard free, the best starting point that exists)','The Odin Project (free, full-stack web development)','Python for Everybody  -  University of Michigan on Coursera'],
        resources:['LeetCode for DSA practice  -  start with Easy, build to Medium','The Pragmatic Programmer  -  foundational reading for every developer','freeCodeCamp for hands-on projects while learning'],
        mentors:'A working software engineer 2–3 years in, not a bootcamp graduate. Someone building real software in a real company day to day.',
        timeToNextLevel:'12–18 months of consistent daily practice (1–2 hours minimum). There are no shortcuts at the fundamentals level.'
      },
      practitioner:{
        gaps:['System design  -  designing scalable, distributed systems end to end','Cloud infrastructure basics  -  AWS, GCP, or Azure (one is enough to start)','Testing  -  unit, integration, and end-to-end tests as standard practice','Code review  -  giving and receiving feedback, maintaining standards across a team','Performance optimisation  -  profiling, bottleneck identification, database query tuning'],
        certs:['AWS Solutions Architect Associate (SAA-C03)  -  most recognised cloud cert','System Design Primer (GitHub  -  free)','LeetCode Medium + system design interview prep'],
        resources:['Designing Data-Intensive Applications by Martin Kleppmann  -  the bible for backend engineers','Clean Code by Robert Martin  -  write code that others can read','ByteByteGo newsletter (system design, weekly)'],
        mentors:'A senior engineer at a product company (not services/outsourcing). Ask them to review your code regularly.',
        timeToNextLevel:'1–2 years. Mid to senior is the longest transition in software engineering  -  it requires depth, not just breadth.'
      },
      competent:{
        gaps:['Technical leadership  -  guiding architectural decisions, reviewing across a team','Specialisation  -  pick AI/ML, distributed systems, platform engineering, or mobile and go deep','Cross-functional work  -  translating technical constraints for product and business stakeholders','Open source contribution or public technical work','Mentoring junior engineers effectively'],
        certs:['AWS Solutions Architect Professional or Google Cloud Professional','Deep specialisation course in your chosen area (fast.ai for ML, Kubernetes certification for DevOps)','Staff Engineer reading  -  Will Larson\'s StaffEng.com'],
        resources:['StaffEng.com by Will Larson  -  what senior to staff engineering actually looks like','A Philosophy of Software Design by John Ousterhout','Contribute to one open source project  -  visibility matters at this level'],
        mentors:'A Staff or Principal Engineer. Ask specifically: "What distinguishes the engineers at your level from senior engineers at your company?"',
        timeToNextLevel:'2–3 years. Senior to Staff is one of the hardest transitions in tech. Most engineers plateau at senior.'
      },
      advanced:{
        gaps:['Engineering leadership  -  building and managing an engineering team','Architecture decision records  -  owning the long-term technical vision','Hiring  -  sourcing, interviewing, and onboarding engineers effectively','Technical debt strategy  -  quantifying and prioritising it for business stakeholders','Developer experience  -  making your codebase accessible to a growing team'],
        certs:['Engineering management is not cert-driven  -  it is experience-driven. A management course from First Round Capital or SVPG is more valuable than a formal cert.','CTO Craft community  -  peer learning for engineering leaders'],
        resources:['An Elegant Puzzle by Will Larson  -  engineering management','The Manager\'s Path by Camille Fournier  -  progression from IC to engineering leadership','Pragmatic Engineer newsletter by Gergely Orosz'],
        mentors:'A VP Engineering or CTO at a company of 50–200 engineers. Someone who has made the IC-to-management transition and can tell you honestly whether it is right for you.',
        timeToNextLevel:'12–24 months. Engineering leadership requires people management experience, not just technical excellence.'
      },
      expert:{
        gaps:['Technical strategy at the company level  -  3–5 year technical roadmap','Speaking and publishing  -  building external credibility','Defining engineering culture and values from first principles','Board and investor communication on technical risk and capability'],
        certs:['No formal certs needed. Your GitHub, published work, and speaking record are your credentials.'],
        resources:['Write. Publish your thinking. Build in public. At the CTO/Principal level, your reputation is your career.'],
        mentors:'Board advisors and other CTOs. Peer learning at this level.',
        timeToNextLevel:'You are at the top of the technical leadership ladder. Next: CTO, founder, or advisor.'
      }
    }
  };

  // Get the right skill matrix or default to a generic one
  var fieldMatrix=skillMatrix[field]||skillMatrix['business-pm'];
  var levelData=fieldMatrix[currentLevel]||fieldMatrix['competent'];

  // Upskill goal framing
  var goalFraming={
    'get-promoted':fn?fn+', your goal is clear  -  get promoted. The plan below is built around the specific gaps between your current level and the next one.':'Your goal is promotion. The plan below targets the gaps between your current level and the next one.',
    'switch-role':fn?fn+', you want to move into a different role. That means your plan has two tracks: close the credibility gap in the target role, and build a visible record of doing that work even before you have the title.':'Moving into a different role requires two tracks: close the credibility gap, and build visible evidence of doing the target work.',
    'get-hired':fn?fn+', you want a better job. At '+expYrs+' years with '+expLabel+' experience, the bottleneck is almost never your core skills  -  it is visibility, positioning, and targeting the right companies.':'At your experience level, the bottleneck for getting hired is usually visibility and positioning, not core skills.',
    'freelance':fn?fn+', going freelance or consulting requires a very different kind of skill development from employment. The gap is not just the technical skill  -  it is the ability to define your niche, attract clients, and deliver without a team around you.':'Freelancing requires niche definition, client acquisition, and independent delivery  -  not just technical skill.',
    'start-business':fn?fn+', building a product requires the skills in this report and one more: the willingness to talk to users before building anything. The gap between a developer and a founder is user research, not code.':'Building a product requires skills plus user research. The gap between a developer and a founder is customer understanding.',
    'international':fn?fn+', targeting international roles requires everything in this plan plus an understanding of how your specific skills translate to the markets you are targeting.':'International positioning requires skill development plus market-specific translation of your credentials.',
    'stay-relevant':fn?fn+', staying relevant in '+fieldDisplay+' is an active exercise, not a passive one. The plan below identifies what is actually changing in your field and what you need to do to stay ahead of it.':'Staying current in your field requires deliberate, targeted learning  -  not generic courses.'
  };

  var profileRows=[
    ['Name',name],
    ['Field',fieldDisplay],
    ['Qualification',getQualDisplay(qual)],
    ['Experience',expYrs===0?'Student / No experience':expYrs+' years ('+expLabel+')'],
    ['Current level',({'beginner':'Beginner','practitioner':'Practitioner','competent':'Competent','advanced':'Advanced','expert':'Expert'}[currentLevel])||currentLevel],
    ['Upskill goal',({'get-promoted':'Get promoted','switch-role':'Switch to a new role','get-hired':'Land a better job','freelance':'Build freelance/consulting business','start-business':'Launch own product/business','international':'Qualify for international roles','stay-relevant':'Stay current in field'}[upskillGoal])||upskillGoal],
    ['Timeline',({'asap':'Immediately','6months':'Within 6 months','1year':'Within 1 year','2years':'1–2 years','exploring':'Exploring options'}[timeline])||timeline],
  ];

  /* Build blockers from cert verdict */
  var certBlockers=[];
  if(certVerdict&&!certVerdict.eligible&&!certVerdict.borderline){
    certBlockers.push({
      factor:certVerdict.cert+'  -  not yet eligible',
      severity:'critical',
      msg:certVerdict.verdict,
      fix:certVerdict.studyPlan[0]||'See the eligibility section below for next steps.'
    });
  }
  var RD={overall:overall,blockers:certBlockers,factors:r};

  html+=page('profile',
    sectionHead('Section 1: Your Profile and Certification Readiness',
      'An honest assessment of eligibility and readiness for the path ahead','#0A2E73',true)
    +buildProfileSection(profileRows,RD,'your field',fn)
  );

  /* ── Certification Eligibility Section ── */
  if(certVerdict){
    var eligColor=certVerdict.eligible?'green':certVerdict.borderline?'amber':'red';
    var studyPlanHtml='<div style="margin-top:16px">'
      +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:12px">Your '+(certVerdict.eligible?'step-by-step study plan':'recommended path forward')+'</div>'
      +certVerdict.studyPlan.map(function(step,i){
        return '<div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #f0f4f8">'
          +'<div style="width:26px;height:26px;border-radius:50%;background:#0A2E73;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'
          +'<p style="font-size:13.5px;color:#334155;line-height:1.7;margin:0">'+step+'</p>'
          +'</div>';
      }).join('')+'</div>';

    var requirementsTable=reqTable(certVerdict.requirements,false);

    html+=page('position',
      sectionHead('Section 2: '+certVerdict.cert+'  -  Full Eligibility and Study Plan',
        fn?fn+', here is every requirement, the exact cost, and a sequenced study plan for your profile':'Every requirement, exact cost, and sequenced study plan','#7c3aed')
      +infoBox(eligColor,'Your Eligibility Verdict',certVerdict.verdict)
      +'<div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:12px">Requirements  -  all checked against your profile</div>'
      +requirementsTable
      +(certVerdict.alreadyHasCapm?infoBox('blue','You already hold CAPM','Since you already have CAPM, the 35-hour education requirement for PMP is satisfied. Your PMP application study plan can skip the foundation course and go directly to exam preparation.'):'')
      +studyPlanHtml
    );
  }

  /* ── Gap analysis  -  the specific skills missing ── */
  var gapsHtml='<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">';
  levelData.gaps.forEach(function(gap,i){
    gapsHtml+='<div style="background:#fff;border:1px solid #e2e8f0;border-left:4px solid #0A2E73;border-radius:0 8px 8px 0;padding:14px 16px">'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">'
      +'<div style="width:22px;height:22px;border-radius:50%;background:#0A2E73;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+(i+1)+'</div>'
      +'<div style="font-size:14px;font-weight:700;color:#0f172a">'+gap.split(' - ')[0].trim()+'</div>'
      +'</div>'
      +(gap.includes(' - ')?'<div style="font-size:13px;color:#475569;line-height:1.6;margin-left:32px">'+gap.split(' - ').slice(1).join(' - ').trim()+'</div>':'')
      +'</div>';
  });
  gapsHtml+='</div>';

  html+=page('position',
    sectionHead('Section 3: The Specific Gaps Between Where You Are and Where You Want to Go',
      fn?fn+', here are the exact skills that separate your current '+currentLevel+' level from the next. These are not guesses  -  they are the consistent gaps reported by hiring managers and senior practitioners in '+fieldDisplay+'.':'The exact skills that separate your current level from the next in '+fieldDisplay,'#7c3aed')
    +infoBox('navy','Why this matters for your specific goal',goalFraming[upskillGoal]||goalFraming['stay-relevant'])
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:16px">Skills to close, in priority order:</div>'
    +gapsHtml
  );

  /* ── Certifications and learning resources ── */
  var certRows=levelData.certs.map(function(c,i){
    var parts=c.split('(');
    return ['Option '+(i+1),c];
  });

  html+=page('skills',
    sectionHead('Section 4: Certifications, Resources, and Mentorship',
      (fn&&fn!=='there')?'Specific to '+fn+'  -  '+expLabel+' in '+fieldDisplay+' targeting '+({'explore':'the right certification','pmp':'PMP','capm':'CAPM','prince2':'PRINCE2','csm':'CSM / Scrum Master','aws-saa':'AWS Solutions Architect','cfa-1':'CFA Level 1','cfa-2':'CFA Level 2'}[targetCert]||'professional certification'):'Exact credentials, study plans, and resources for your level and goal  -  researched for this specific combination','#0d9488')
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:8px">Certifications worth your time at '+expLabel+' level</div>'
    +reqTable(levelData.certs.map(function(c,i){
      /* Extract the cert name (before the first dash or parenthesis) for the label */
      var label=c.split('  -  ')[0].split('(')[0].trim();
      return [label,c.replace(label+'  -  ','').replace(label,'').replace(/^\s*[\-– - ]\s*/,'').trim()||c];
    }))
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:20px 0 8px">Books and resources  -  in reading order</div>'
    +reqTable(levelData.resources.map(function(r,i){
      /* Use "by" split to get book title as label */
      var parts=r.split(' by ');
      var label=parts.length>1?parts[0].trim():'Resource '+(i+1);
      if(label.length>30) label=label.substring(0,28)+'..';
      return [label,r];
    }))
    +infoBox('green','Mentorship  -  the shortcut most people skip',levelData.mentors+' The Tutorment matches you with a practitioner who is doing the exact work you want to be doing in 2 years. One session per week beats any course.')
    +infoBox('blue','How long this realistically takes',levelData.timeToNextLevel+' Most people underestimate the time because they are doing the wrong things. The plan below sequences your learning so every week builds toward a visible, demonstrable outcome  -  not just personal knowledge.')
  );

  /* ── Action plan ── */
  var urgency={'asap':'Immediately.','6months':'6 months.','1year':'1 year.','2years':'2 years.','exploring':'Use this as your planning reference.','not-specified':'Start now.'}[timeline]||'Start now.';

  /* Personalised week plan based on current level and goal */
  var weeks=[
    {w:'Week 1–2',color:'#0A2E73',items:[
      fn?fn+', start with a self-audit before opening any course or book. Write down the three decisions in your current role where you felt least confident in the last 3 months. Those are your real gaps  -  everything else in this plan is secondary.':'Do a self-audit before opening any course. Write the 3 decisions in your current role where you felt least confident in the last 3 months. Those are your real gaps.',
      'Set up a learning system, not just a learning intent. Block 45 minutes every morning  -  not evening. Morning learning compounds. Evening learning gets cancelled. Put it in your calendar as a recurring meeting with yourself.',
      levelData.certs[0]?'Start with: '+levelData.certs[0].split('(')[0].trim()+'. This is the most accessible and highest-signal credential for your level. Register this week, not next week.':'Start with the first resource in the list above. Commit to 30 pages or one module per day  -  consistency beats intensity.'
    ]},
    {w:'Week 3–6',color:'#1565c0',items:[
      'Apply what you are learning to a real problem immediately. Do not finish the course before applying. Take the first concept, apply it to your actual work this week, and note what breaks or works differently from theory.',
      upskillGoal==='get-promoted'?'Have a direct conversation with your manager about what the next level requires. Most promotions fail not because the person lacks skills but because there was no explicit agreement on what the bar is. Ask: "What would I need to demonstrate consistently for 3 months to make a promotion conversation worth having?"':
      upskillGoal==='get-hired'?'Update your LinkedIn and CV to reflect what you are learning  -  not after you finish, but as you go. "Currently completing [cert]" signals momentum to recruiters in ways that static credentials do not.':
      upskillGoal==='switch-role'?'Find one project in your current role that uses a skill from your target area. If none exists, build one outside work  -  a side project, contribution, or documented analysis that demonstrates the target skill in practice.':
      'Build in public. Share one learning weekly on LinkedIn  -  what you tried, what worked, what did not. This is not vanity  -  it builds credibility and attracts relevant connections faster than any direct networking.',
      'Connect with 5 practitioners 2–3 years ahead of you on LinkedIn. Not to ask for mentorship immediately  -  to observe and learn from what they share publicly, and have one intelligent comment on their work each week.'
    ]},
    {w:'Week 7–10',color:'#7c3aed',items:[
      'Complete your first certification or finish your first major resource. Do not move to the second until you can explain the first to someone else from memory. Teaching = understanding.',
      'Do a project that demonstrates the skill  -  not a tutorial project, but something you defined the brief for. The gap between practising a skill and owning a skill is building something nobody told you to build.',
      'Seek feedback from someone more advanced. Share your project or your work with a senior practitioner and ask specifically: "What would make this noticeably better?" Generic feedback is useless  -  ask a pointed question about the specific skill you are building.'
    ]},
    {w:'Week 11–16',color:'#0d9488',items:[
      upskillGoal==='get-promoted'?'Request a formal conversation about promotion. By this point you have: identified the specific gaps, worked on them for 8 weeks, applied them to real work, and sought feedback. That is a credible promotion case  -  not perfect, but credible.':
      upskillGoal==='freelance'?'Take your first paid project, even a small one. Doing one paid project teaches you more than 10 courses. Price fairly, deliver excellently, get a written testimonial.':
      'Evaluate: which gap is most closed? Which remains? Update your self-audit from Week 1. The answer to this question determines your next 3 months.',
      'Start the second certification or resource from your list. Sequence matters  -  do not start the advanced material before the foundational one is genuinely solid.',
      fn?fn+', by Week 16 you should be able to demonstrate this skill in a real context  -  not just describe it. If you cannot, the learning method needs to change, not the goal. Book a Tutorment session to recalibrate.':'By Week 16 you should be able to demonstrate this skill in a real context. If you cannot, the method needs changing. Book a session to recalibrate.'
    ]},
  ];

  var aHtml='<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin-bottom:20px">'
    +'<div style="font-size:11px;font-weight:800;color:#1e3a8a;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px">Your timeline: '+urgency+'</div>'
    +(fn?'<p style="font-size:13.5px;color:#1e3a8a;line-height:1.7;margin:0">'+fn+', the plan below is sequenced for your specific combination of field, level, and goal. The order matters  -  each step creates the condition for the next one to land properly.</p>':'<p style="font-size:13.5px;color:#1e3a8a;line-height:1.7;margin:0">The steps below are sequenced  -  the order matters. Each week creates the condition for the next step to work.</p>')
    +'</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'
    +weeks.map(function(wk){
      return '<div style="background:#fff;border:1px solid #e2e8f0;border-top:4px solid '+wk.color+';border-radius:0 0 8px 8px">'
        +'<div style="background:'+wk.color+';padding:10px 16px">'
        +'<div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+wk.w+'</div></div>'
        +'<div style="padding:16px">'
        +wk.items.map(function(item,i){
          return '<div style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f8fafc;font-size:13px;color:#334155;line-height:1.65">'
            +'<div style="width:22px;height:22px;border-radius:50%;background:'+wk.color+';color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'
            +'<div>'+item+'</div></div>';
        }).join('')+'</div></div>';
    }).join('')+'</div>';

  /* ── Global Market Data Section ── */
  /* Research-backed salary, demand, and hiring data by field and level */
  var globalData={
    'business-pm':{
      demandTrend:'Product Management roles grew 32% globally between 2021 and 2024 (LinkedIn Workforce Report 2024). Demand is highest in the USA (San Francisco, Seattle, New York), UK (London), India (Bangalore, Gurgaon), and Singapore.',
      salaryGlobal:[
        ['India  -  Entry (0–3 yrs)','₹8–18 LPA | Top companies (Google, Amazon, Flipkart): ₹20–35 LPA'],
        ['India  -  Mid (3–7 yrs)','₹20–40 LPA | Unicorns and Series B+: ₹35–60 LPA'],
        ['India  -  Senior/Lead (7–12 yrs)','₹45–80 LPA | Director level: ₹80–130 LPA+'],
        ['UK  -  Mid (3–7 yrs)','£55,000–£80,000 | Senior: £80,000–£110,000 | Director: £110,000–£160,000'],
        ['USA  -  Mid (3–7 yrs)','USD 130,000–170,000 | Senior: USD 180,000–250,000 (incl. equity)'],
        ['Canada  -  Mid','CAD 90,000–120,000 | Senior: CAD 120,000–160,000'],
        ['Australia  -  Mid','AUD 110,000–140,000 | Senior: AUD 140,000–180,000'],
        ['Singapore  -  Mid','SGD 90,000–130,000 | Senior: SGD 130,000–180,000'],
      ],
      topHiringCompanies:'India: Google, Amazon, Flipkart, Razorpay, CRED, Meesho, Swiggy, PhonePe, Paytm. UK: Monzo, Revolut, DeepMind, Amazon UK, Microsoft UK, Sky, Ocado. USA: Google, Meta, Apple, Stripe, Airbnb, Uber, Shopify.',
      certImpact:'PMP adds ₹3–8 LPA in India (₹12–20 LPA at consulting firms). In the UK: £5,000–£12,000 annual salary premium. PMI Salary Survey 2023: PMP holders earn 22% more than non-certified peers globally. PRINCE2 is dominant in UK government and large corporates  -  often a listed requirement, not a preference.',
      demandSkills2024:'AI product management (highest demand 2024–2026), data analysis and SQL, experimentation/A-B testing design, platform strategy, and enterprise stakeholder management.',
      jobBoards:'India: LinkedIn, Naukri, Cutshort, iimjobs (PM-specific). UK: LinkedIn, CityJobs, TechCareers. Global: LinkedIn (dominant), Lenny\'s Job Board, Teal, Pallet.',
    },
    'stem-cs':{
      demandTrend:'Software engineering demand remains strong globally despite 2023 tech layoffs. AI/ML roles grew 74% YoY in 2024 (Indeed). Cloud engineers and DevOps maintain highest demand-to-supply ratios.',
      salaryGlobal:[
        ['India  -  Fresher','₹6–15 LPA | Top product companies: ₹20–40 LPA'],
        ['India  -  Mid (3–6 yrs)','₹18–40 LPA | Senior: ₹40–70 LPA | Staff: ₹70–120 LPA+'],
        ['UK  -  Mid','£55,000–£85,000 | Senior: £85,000–£130,000 | Principal: £130,000–£180,000'],
        ['USA  -  Mid','USD 140,000–180,000 | Senior: USD 200,000–280,000 | Staff: USD 300,000–450,000 (incl. equity)'],
        ['Germany  -  Mid','€60,000–€90,000 | Senior: €90,000–€130,000'],
        ['Singapore  -  Mid','SGD 90,000–130,000 | Senior: SGD 130,000–200,000'],
        ['Canada  -  Mid','CAD 90,000–130,000 | Senior: CAD 130,000–180,000'],
      ],
      topHiringCompanies:'India: Google, Microsoft, Amazon, Flipkart, Zepto, Meesho, Razorpay. UK: Arm, DeepMind, Revolut, Monzo, Amazon UK. USA: Google, Meta, Apple, Nvidia, Anthropic, OpenAI, Amazon.',
      certImpact:'AWS SAA adds USD 10,000–20,000 to annual salary in USA (Dice Salary Survey 2024). In India, AWS/GCP certification adds ₹3–8 LPA. CKAD/CKA adds ₹4–10 LPA for DevOps/platform roles. CISSP commands 20% salary premium in cybersecurity globally.',
      demandSkills2024:'Generative AI / LLMs (highest growth 2024–2026), Rust and systems programming, Kubernetes and cloud-native infrastructure, MLOps, security engineering.',
      jobBoards:'India: LinkedIn, Naukri, Instahyre, Cutshort, AngelList India. UK: LinkedIn, CWJobs. USA: LinkedIn, Levels.fyi (compensation benchmarking), Blind, Hacker News "Who is hiring".',
    },
    'business-finance':{
      demandTrend:'Finance roles are growing in fintech (42% increase 2022–2024), ESG/sustainability finance, and risk management. Traditional banking roles are contracting while fintech, PE/VC, and corporate finance roles grow.',
      salaryGlobal:[
        ['India  -  Entry (CA/MBA fresh)','₹8–20 LPA | Top investment banks: ₹25–50 LPA'],
        ['India  -  Mid (3–7 yrs)','₹20–50 LPA | Senior: ₹50–100 LPA+'],
        ['UK  -  Analyst','£45,000–£65,000 | VP: £90,000–£150,000 | Director: £150,000–£250,000+'],
        ['USA  -  Analyst (IB)','USD 100,000–150,000 + bonus | VP: USD 250,000–400,000 total comp'],
        ['Singapore  -  Mid','SGD 80,000–130,000 | Senior: SGD 130,000–200,000'],
        ['Dubai/UAE  -  Mid','AED 180,000–280,000 (approx ₹41–64 LPA)'],
      ],
      topHiringCompanies:'India: Goldman Sachs, JP Morgan, Morgan Stanley, HDFC, Kotak, Zerodha, Groww, Paytm Money. UK: HSBC, Barclays, NatWest, Lloyds, Goldman Sachs, BlackRock. USA: Goldman Sachs, Morgan Stanley, BlackRock, Citadel, Jane Street.',
      certImpact:'CFA charter holders earn 28% more than non-charterholders globally (CFA Institute 2023 Survey). FRM adds 15–20% salary premium in risk roles. ACCA qualification opens roles in UK/Australia/Middle East that are closed without it.',
      demandSkills2024:'ESG analysis and sustainable finance, quantitative modelling (Python, R), fintech product understanding, cryptocurrency/DeFi regulation knowledge, risk modelling.',
      jobBoards:'India: LinkedIn, iimjobs, Naukri, CFA Society India job board. UK: eFinancialCareers (dominant), LinkedIn, Morgan McKinley. USA: eFinancialCareers, LinkedIn, Wall Street Oasis.',
    },
    'stem-engineering':{
      demandTrend:'Engineering roles are growing in renewable energy (solar, wind, hydrogen  -  68% demand increase 2023–2025), defence/aerospace, and infrastructure. Traditional oil & gas engineering contracting.',
      salaryGlobal:[
        ['India  -  Fresh Graduate','₹4–10 LPA | Core engineering PSUs: ₹7–15 LPA'],
        ['India  -  Mid (5–10 yrs)','₹15–30 LPA | Senior: ₹30–60 LPA | Manager: ₹50–90 LPA'],
        ['UK  -  Mid','£45,000–£70,000 | Chartered: £70,000–£100,000 | Senior: £90,000–£130,000'],
        ['Australia  -  Mid','AUD 90,000–130,000 | Senior/Chartered: AUD 130,000–170,000'],
        ['Canada  -  Mid','CAD 75,000–110,000 | Senior: CAD 110,000–150,000'],
        ['UAE  -  Mid','AED 180,000–300,000 (strong demand in infrastructure, energy)'],
      ],
      topHiringCompanies:'India: L&T, Tata Projects, BHEL, Wipro ISRE, NTPC, Reliance. UK: Atkins, Arup, Mott MacDonald, BAE Systems, Rolls-Royce. Australia: John Holland, Leighton, BHP, Rio Tinto, Woodside.',
      certImpact:'Chartered Engineer (CEng) in UK adds £10,000–£20,000 annual salary premium and is a requirement for senior design authority roles. PE licence in USA is required for independent practice. Six Sigma Black Belt adds ₹5–12 LPA in India.',
      demandSkills2024:'Renewable energy design (solar/wind/hydrogen), BIM modelling, digital twin technology, structural health monitoring, carbon engineering.',
      jobBoards:'India: Naukri, LinkedIn, core.hire (L&T portal). UK: New Civil Engineer jobs, Institution of Engineering and Technology, LinkedIn. Australia: Seek, LinkedIn.',
    },
  };
  var gd=globalData[field]||globalData['business-pm'];

  var globalMarketHtml=''
    +'<div style="margin-bottom:24px">'
    +'<div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">Global demand trend  -  '+fieldDisplay+'</div>'
    +'<p style="font-size:13.5px;color:#475569;line-height:1.75;margin:0">'+gd.demandTrend+'</p>'
    +'</div>'
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px">Salary benchmarks by country  -  '+fieldDisplay+'</div>'
    +reqTable(gd.salaryGlobal,false)
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:20px 0 8px">Where the jobs are</div>'
    +'<p style="font-size:13.5px;color:#475569;line-height:1.75;margin-bottom:16px">'+gd.topHiringCompanies+'</p>'
    +infoBox('navy','What your specific certification adds to your salary',gd.certImpact)
    +infoBox('blue','Highest-demand skills in '+fieldDisplay+'  -  2024 to 2026',gd.demandSkills2024)
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:16px 0 8px">Where to find the right roles</div>'
    +'<p style="font-size:13.5px;color:#475569;line-height:1.75;margin:0">'+gd.jobBoards+'</p>';

  var wantsIntl=upskillGoal==='international'||upskillGoal==='get-hired';
  var mktTitle=wantsIntl?'Section 5: Global Market Data  -  Salaries, Demand, and Career Benchmarks':'Section 5: Market Benchmarks  -  What '+fieldDisplay+' Pays in India';
  var mktSub=(fn&&fn!=='there')?fn+', here is the market data for your role level':'Salary benchmarks, demand trends, and what moves you to the next level';
  var mktContent;
  if(wantsIntl){
    mktContent=globalMarketHtml;
  } else {
    var allIndiaBands=gd.salaryGlobal.filter(function(r){return r[0].toLowerCase().indexOf('india')!==-1;});

    /* Filter to relevant experience level bands only */
    var expYrsLocal=parseInt(exp||'0');
    var relevantBands=allIndiaBands.filter(function(r){
      var label=(r[0]||'').toLowerCase();
      if(expYrsLocal<=3)  return label.indexOf('entry')!==-1||label.indexOf('0')!==-1||label.indexOf('1')!==-1||label.indexOf('3')!==-1;
      if(expYrsLocal<=7)  return label.indexOf('mid')!==-1||label.indexOf('3')!==-1||label.indexOf('7')!==-1;
      if(expYrsLocal<=12) return label.indexOf('senior')!==-1||label.indexOf('lead')!==-1||label.indexOf('7')!==-1||label.indexOf('12')!==-1;
      return label.indexOf('senior')!==-1||label.indexOf('lead')!==-1||label.indexOf('director')!==-1;
    });
    /* Show current level + one level above — always show next level as aspiration */
    var currentAndNext=[];
    if(expYrsLocal<=3){
      currentAndNext=allIndiaBands.filter(function(r){var l=(r[0]||'').toLowerCase();return l.indexOf('entry')!==-1||l.indexOf('mid')!==-1;});
    } else if(expYrsLocal<=7){
      currentAndNext=allIndiaBands.filter(function(r){var l=(r[0]||'').toLowerCase();return l.indexOf('mid')!==-1||l.indexOf('senior')!==-1;});
    } else {
      currentAndNext=allIndiaBands.filter(function(r){var l=(r[0]||'').toLowerCase();return l.indexOf('senior')!==-1||l.indexOf('lead')!==-1||l.indexOf('director')!==-1;});
    }
    var bandsToShow=currentAndNext.length?currentAndNext:(allIndiaBands.length?allIndiaBands:gd.salaryGlobal.slice(0,3));

    var levelLabel=expYrsLocal<=3?'Entry level (0-3 years)':expYrsLocal<=7?'Mid level (3-7 years)':'Senior / Lead level (7+ years)';
    mktContent='<div style="margin-bottom:20px"><p style="font-size:13.5px;color:#475569;line-height:1.75;margin:0">'+gd.demandTrend+'</p></div>'
      +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px">India salary bands for '+fieldDisplay+'</div>'
      +'<div style="font-size:12px;color:#64748b;margin-bottom:10px">Showing your current level ('+levelLabel+') and the next level. The level above is your target benchmark.</div>'
      +reqTable(bandsToShow,false)
      +infoBox('navy','What will actually move your salary in India',gd.certImpact)
      +infoBox('blue','Highest-demand skills right now  -  2024 to 2026',gd.demandSkills2024)
      +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:16px 0 8px">Where to find the right roles in India</div>'
      +'<p style="font-size:13.5px;color:#475569;line-height:1.75;margin:0">'+gd.jobBoards+'</p>';
  }
  html+=page('pathway',sectionHead(mktTitle,mktSub,'#b45309')+mktContent);

  html+=page('action',sectionHead('Section 6: Your Personalised Learning Plan','16 weeks, sequenced to your specific level and goal','#0A2E73',true)+aHtml);
  return html;
}

/* ═══════════════════════════════════
   ADDON SECTION BUILDERS
   Appended to report when triggered
   by user answers or selected addons.
═══════════════════════════════════ */

/* ── English Test Comparison Guide ── */
function buildEnglishTestGuide(fn,goal,target,fieldDisplay){
  var addr=fn?fn+', before':'Before';
  var isHealthcare=(A.field||'').indexOf('health-')===0;
  var isRegistration=goal==='professional-registration';

  var tests=[
    {
      name:'IELTS Academic',
      body:'IELTS Academic',
      format:'4 sections: Listening (30 min), Reading (60 min), Writing (60 min), Speaking (11-14 min face to face with an examiner). Total: approx 2 hours 45 min.',
      scoring:'Band 0 to 9. Most international applications require 6.5 to 7.0 overall. Professional registration (HCPC, NMC, GMC) requires 7.0 in every single component.',
      accepts:'Accepted by: virtually all UK universities, all UK professional regulators, UKVI for visas, most Australian and Canadian institutions, and most global employers.',
      cost:'Approx GBP 170-185 (UK), INR 16,500 (India). Results within 3 to 5 days for computer-based.',
      bestFor:'Best for: most people. It is the most universally accepted test. If you only take one, this is the one.',
      validity:'2 years from test date.',
      prep:'Preparation: 6 to 12 weeks for most people starting from B2 level. British Council and IDP both offer official preparation materials. Cambridge IELTS official practice tests are the gold standard.',
    },
    {
      name:'OET (Occupational English Test)',
      body:'OET',
      format:'Healthcare-specific. 4 skills: Listening, Reading, Writing, and Speaking. The writing and speaking tasks simulate real clinical scenarios - letter writing, patient consultations.',
      scoring:'Grade A (highest) to Grade E. HCPC, NMC, GMC, and AHPRA require Grade B in every component.',
      accepts:'Accepted by: HCPC, NMC, GMC, GPhC, GDC, AHPRA (Australia), and most clinical employers. NOT accepted for visa applications or university admissions - only for professional registration.',
      cost:'Approx GBP 190-220. Results within 16 business days.',
      bestFor:'Best for: healthcare professionals targeting registration (HCPC, NMC, GMC, AHPRA). The clinical scenarios make it more relevant to their work context and many find it easier to pass than IELTS.',
      validity:'2 years from test date.',
      prep:'Preparation: 4 to 8 weeks for healthcare professionals already using English clinically. OET official preparation website has free practice materials.',
    },
    {
      name:'TOEFL iBT',
      body:'TOEFL iBT',
      format:'4 sections: Reading (54-72 min), Listening (41-57 min), Speaking (17 min), Writing (50 min). Entirely computer-based including speaking (you speak into a microphone).',
      scoring:'0 to 120. Most UK universities accept 87-100+. Accepted by most US and Canadian universities.',
      accepts:'Accepted by: most universities worldwide, including UK and Australia. NOT accepted by UKVI for UK visa applications (IELTS and some others are required). NOT accepted by UK professional regulators.',
      cost:'USD 220-235 (approx INR 18,000). Results in 6 business days.',
      bestFor:'Best for: people targeting US or Canadian universities primarily. Less useful for UK visa, UK professional registration, or Australian immigration.',
      validity:'2 years from test date.',
      prep:'Preparation: 8 to 16 weeks. Official ETS TOEFL preparation materials on their website. Magoosh TOEFL is a widely used paid preparation course.',
    },
    {
      name:'PTE Academic',
      body:'PTE Academic',
      format:'Entirely computer-based and AI-scored. 3 parts: Speaking and Writing combined (77-93 min), Reading (32-41 min), Listening (45-57 min). No human examiner.',
      scoring:'10 to 90. UKVI accepts PTE for most visa routes. Most universities accept 65+.',
      accepts:'Accepted by: UKVI for UK visa applications, most Australian immigration routes, many universities. NOT accepted by UK professional regulators (HCPC, NMC, GMC).',
      cost:'GBP 150-200 (INR 15,500 approx). Results in 48 hours - the fastest of all tests.',
      bestFor:'Best for: people targeting UK visa (not healthcare registration) or Australian immigration where speed of results matters. The AI scoring removes examiner subjectivity which some candidates prefer.',
      validity:'2 years from test date.',
      prep:'Preparation: 4 to 8 weeks. PTE Academic official website has scored practice tests. E2Language PTE is a popular preparation platform.',
    },
  ];

  /* Recommendation logic */
  var recommendation;
  if(isRegistration||isHealthcare){
    recommendation=(fn?fn+', for your specific goal':'For your goal')+' (professional registration in '+fieldDisplay+'), <strong>OET is the recommended choice</strong>. The clinical writing and speaking tasks align directly with your professional context, and healthcare professionals consistently report higher pass rates on OET than IELTS for the same underlying English level. However, OET results cannot be used for visa applications - you will need IELTS separately for the visa itself. If you want one test for both registration and visa, <strong>IELTS Academic is the only option that covers both</strong>.';
  } else if(target==='usa'||target==='canada'){
    recommendation=(fn?fn+', for your target countries':'For your target countries')+', <strong>TOEFL iBT or IELTS Academic</strong> are both strong choices. TOEFL is more widely used for US university applications. IELTS is accepted everywhere TOEFL is, plus it is accepted for UK visa and professional routes. If there is any chance your plans change toward the UK, take IELTS.';
  } else {
    recommendation=(fn?fn+', for your situation':'For your situation')+', <strong>IELTS Academic is the recommended choice</strong>. It is accepted for UK visa applications (TOEFL and OET are not), accepted by all UK universities, and accepted by all UK professional regulators. It is the most versatile English test globally. Take IELTS unless you have a specific reason not to.';
  }

  var tableHtml='<table style="width:100%;border-collapse:collapse;font-size:13px">'
    +'<thead><tr style="background:#0A2E73">'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:14%">Test</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:14%">Best for</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:16%">Format</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:18%">Accepted by</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:10%">Cost (approx)</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:10%">Results</th>'
    +'</tr></thead><tbody>'
    +tests.map(function(t,i){
      return '<tr style="background:'+(i%2===0?'#f8fafc':'#fff')+';border-bottom:1px solid #e2e8f0">'
        +'<td style="padding:10px 14px;font-weight:700;color:#0A2E73">'+t.name+'</td>'
        +'<td style="padding:10px 14px;color:#0f172a">'+t.bestFor+'</td>'
        +'<td style="padding:10px 14px;color:#475569">'+t.format+'</td>'
        +'<td style="padding:10px 14px;color:#475569">'+t.accepts+'</td>'
        +'<td style="padding:10px 14px;color:#475569">'+t.cost+'</td>'
        +'<td style="padding:10px 14px;color:#475569">'+t.validity+'</td>'
        +'</tr>';
    }).join('')+'</tbody></table>';

  var prepHtml='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px">'
    +tests.map(function(t){
      return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px">'
        +'<div style="font-size:12px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">'+t.body+' - Preparation</div>'
        +'<p style="font-size:13px;color:#475569;line-height:1.7;margin:0">'+t.prep+'</p>'
        +'</div>';
    }).join('')+'</div>';

  return page('skills',
    sectionHead('English Language Test Guide','Every test compared - format, cost, acceptance, and which one is right for your goal','#0d9488')
    +infoBox('navy','Our recommendation for '+fieldDisplay,recommendation)
    +tableHtml
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:24px 0 12px">Preparation strategy by test</div>'
    +prepHtml
    +infoBox('amber','Important: test validity','All English test results expire after 2 years from the test date. HCPC, NMC, and most UK universities will not accept results older than 2 years. Book your test date to ensure results are valid at your application or registration submission date  -  not just when you plan to study.')
  );
}

/* ── Global Comparison Section ── */
function buildGlobalComparison(fn,fieldDisplay,goal,qual,exp,english){
  var expYrs=parseInt(exp||'0');
  var hasDegree=qual==='bachelors'||qual==='bachelors-honours'||qual==='masters'||qual==='phd'||qual==='student-masters'||qual==='student-mba';

  var countries=[
    {
      country:'United Kingdom',flag:'UK',
      visa:'Skilled Worker Visa. Employer must hold a Sponsor Licence. Minimum salary: GBP 26,200 or role going rate, whichever is higher. No annual cap.',
      postStudy:'Graduate Route: 2 years post-study work after any UK degree (3 years after PhD). No employer or role restrictions.',
      pr:'5 years on Skilled Worker leads to Indefinite Leave to Remain (ILR). Then British citizenship after 1 further year.',
      jobMarket:'Strong for tech, healthcare, finance, and engineering. Employer sponsorship required for most non-EU nationals. 85,000+ licensed sponsors.',
      taxNet:'GBP 45,000 gross = approx GBP 33,000 take-home (after income tax and National Insurance).',
      cost:'London: GBP 1,800-2,500/month living costs. Outside London: GBP 1,100-1,600/month.',
      english:'IELTS 6.5-7.0 for jobs. IELTS 7.0 each band for regulated professions. Required for Skilled Worker visa.',
      pros:'Post-study work rights, NHS healthcare, strong employment protections, clear PR pathway, English-speaking.',
      cons:'High cost of living (especially London), employer sponsorship required, competitive job market.',
      best:'Best for: healthcare professionals, engineers, tech workers, finance professionals. Strong pathway for professionals from India.',
    },
    {
      country:'Canada',flag:'CA',
      visa:'LMIA (Labour Market Impact Assessment) employer sponsorship, OR Express Entry points system (no job offer needed). Express Entry: score 470-510 CRS points for recent draws.',
      postStudy:'PGWP: open work permit for duration of study programme (up to 3 years). Direct route to Express Entry.',
      pr:'Express Entry or PNP leads to PR. After 1 year of Canadian work as PR: Canadian Experience Class.',
      jobMarket:'Strong for IT, engineering, healthcare, finance, and trades. Less competitive than UK for employer sponsorship  -  many routes to PR without a job offer.',
      taxNet:'CAD 80,000 gross = approx CAD 60,000 take-home in Ontario.',
      cost:'Toronto/Vancouver: CAD 2,200-3,000/month. Smaller cities: CAD 1,400-2,000/month.',
      english:'IELTS 6.0-7.0 for most visas. CLB 7 (approx IELTS 6.0) for Express Entry.',
      pros:'Multiple PR pathways, does not require employer sponsorship for Express Entry, strong healthcare and tech sectors, diverse cities.',
      cons:'Harsh winters in many provinces, cost of living rising especially in Toronto/Vancouver, competitive for LMIA sponsorship.',
      best:'Best for: tech workers, engineers, healthcare professionals, and people with in-demand trades. Excellent long-term settlement option.',
    },
    {
      country:'Australia',flag:'AU',
      visa:'Temporary Skill Shortage (TSS) Subclass 482: employer sponsored, 2-4 years. OR Skilled Independent Visa (189): points-tested, no employer needed.',
      postStudy:'Temporary Graduate Visa (485): 5 years for Indian students after Masters, 6 years after PhD (since 2023).',
      pr:'189 Skilled Independent or 190 State Nomination leads directly to PR. No employer sponsorship required.',
      jobMarket:'Strong for healthcare, mining and resources, engineering, IT, construction. SEEK.com.au is the dominant job platform.',
      taxNet:'AUD 90,000 gross = approx AUD 67,000 take-home.',
      cost:'Sydney/Melbourne: AUD 2,500-3,200/month. Brisbane/Adelaide: AUD 1,800-2,400/month.',
      english:'IELTS 6.0-7.0 for most skilled visas. IELTS 7.0 + specific component minimums for AHPRA healthcare registration.',
      pros:'High standard of living, strong job market in healthcare and resources, clear points-based PR system, excellent post-study work rights for Indian students.',
      cons:'Distance from India, cost of living in major cities, AHPRA healthcare registration is a lengthy process.',
      best:'Best for: nurses, physiotherapists, engineers, IT professionals, and healthcare workers. The 6-year post-study visa for PhD holders is exceptional value.',
    },
    {
      country:'Germany',flag:'DE',
      visa:'Skilled Worker Visa (Fachkraeftezuwanderungsgesetz): degree-level qualification required. No annual cap. Employer must confirm the role cannot be filled locally.',
      postStudy:'18-month Job Seeker Permit after graduation from German university. Can work full-time while studying (120 full days per year).',
      pr:'Permanent residence after 4 years (or 2 years with B1 German and integration course). Fast-track to citizenship (3 years from 2024 reform).',
      jobMarket:'Strong for engineering, IT, manufacturing, and research. Many companies now hiring with English only in major cities and tech hubs.',
      taxNet:'EUR 60,000 gross = approx EUR 38,000 take-home (German taxes are high).',
      cost:'Munich/Frankfurt: EUR 1,800-2,500/month. Berlin: EUR 1,500-2,200/month.',
      english:'Many tech and engineering companies operate in English. German B1-B2 needed for daily life and most non-tech sectors.',
      pros:'Zero tuition at public universities, DAAD scholarships accessible, strong engineering and automotive industry, 2024 immigration reform streamlined process.',
      cons:'Language barrier for non-tech roles, high taxes, cost of living rising in Munich and Frankfurt, German bureaucracy.',
      best:'Best for: engineers, software developers, researchers, and people willing to learn German for long-term settlement.',
    },
    {
      country:'UAE / Dubai',flag:'AE',
      visa:'Employment visa sponsored by employer. No points system. Most roles are employer-sponsored contracts.',
      postStudy:'No post-study work route. UAE does not have a student-to-work transition visa.',
      pr:'UAE Golden Visa for exceptional talent, investors, and certain professionals (10-year renewable). No route to citizenship for most expats.',
      jobMarket:'Strong for finance, construction, healthcare, hospitality, and tech. Tax-free income is a major draw. Most hiring happens through recruitment agencies.',
      taxNet:'AED 200,000 gross = AED 200,000 take-home (zero income tax). High gross-to-net ratio.',
      cost:'Dubai: AED 8,000-14,000/month (AED = approx 22 INR). No income tax.',
      english:'English is the working language across most professional sectors. Arabic helps for government roles.',
      pros:'Zero income tax, high gross salaries, cosmopolitan lifestyle, growing tech and finance sectors, easy to save money.',
      cons:'No route to citizenship, Golden Visa is competitive, dependent on employer for visa status, 2-3 year contracts typical, cultural adjustment.',
      best:'Best for: finance professionals, doctors, engineers, and tech workers targeting high savings over 3-5 years. Not ideal for long-term settlement without Golden Visa.',
    },
    {
      country:'Singapore',flag:'SG',
      visa:'Employment Pass (EP): employer sponsored, minimum salary SGD 5,000/month for new applications (higher for financial services). No annual cap.',
      postStudy:'Long-Term Visit Pass (LTVP) available for graduates of Singapore universities. Strong industry-academia links for campus hiring.',
      pr:'Permanent Residence application after 2 years of EP. Competitive  -  approx 30-40% of applications approved.',
      jobMarket:'Strong for finance, tech, biomedical sciences, and logistics. Smaller market than UK/Canada/Australia but salaries are high and competition is lower.',
      taxNet:'SGD 90,000 gross = approx SGD 78,000 take-home (Singapore taxes are low: 15-22%).',
      cost:'SGD 2,800-4,000/month for comfortable living.',
      english:'English is an official language. Full English-language professional environment.',
      pros:'Low taxes, safe, efficient, English-speaking, strategic location for pan-Asia careers, strong finance and tech sectors.',
      cons:'Small country, high cost of living, competitive PR approval, family-size housing is expensive.',
      best:'Best for: finance professionals, software engineers, biomedical researchers, and people targeting pan-Asia career growth.',
    },
  ];

  var tableHtml='<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:900px">'
    +'<thead><tr style="background:#0A2E73">'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:12%">Country</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:18%">Visa route</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:12%">PR pathway</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:13%">Job market</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:12%">Take-home pay</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:12%">Cost of living</th>'
    +'<th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left;width:21%">Best for</th>'
    +'</tr></thead><tbody>'
    +countries.map(function(c,i){
      return '<tr style="background:'+(i%2===0?'#f8fafc':'#fff')+';border-bottom:1px solid #e2e8f0">'
        +'<td style="padding:10px 14px;font-weight:700;color:#0A2E73">'+c.country+'</td>'
        +'<td style="padding:10px 14px;color:#475569;line-height:1.55">'+c.visa+'</td>'
        +'<td style="padding:10px 14px;color:#475569;line-height:1.55">'+c.pr+'</td>'
        +'<td style="padding:10px 14px;color:#475569;line-height:1.55">'+c.jobMarket+'</td>'
        +'<td style="padding:10px 14px;color:#14532d;font-weight:600">'+c.taxNet+'</td>'
        +'<td style="padding:10px 14px;color:#475569">'+c.cost+'</td>'
        +'<td style="padding:10px 14px;color:#0f172a;font-weight:600;line-height:1.5">'+c.best+'</td>'
        +'</tr>';
    }).join('')+'</tbody></table></div>';

  var fieldRec;
  var f=A.field||'';
  if(f==='stem-cs'||f==='business-pm') fieldRec='For '+fieldDisplay+': <strong>USA and Canada</strong> offer the highest absolute salaries. <strong>UK</strong> has the clearest sponsored visa route and post-study work rights. <strong>Germany</strong> is an underrated option with zero university fees and a 2024 immigration reform that made employer sponsorship much more accessible. <strong>Singapore</strong> is ideal for pan-Asia positioning.';
  else if(f.indexOf('health-')===0) fieldRec='For '+fieldDisplay+': <strong>UK</strong> and <strong>Australia</strong> are the primary destinations  -  both have specific registration routes and significant shortages in most clinical specialisations. Australia\'s 6-year post-study visa for PhD holders is exceptional. UAE offers high tax-free salaries but no structured long-term settlement pathway.';
  else if(f==='business-finance') fieldRec='For '+fieldDisplay+': <strong>UK (London)</strong> and <strong>Singapore</strong> are the primary financial hubs. UAE (Dubai) offers tax-free income with high savings potential. Canada is strong for corporate finance and banking outside the major investment banking centres.';
  else if(f==='stem-engineering') fieldRec='For '+fieldDisplay+': <strong>Germany</strong> has the strongest engineering job market in Europe with a highly accessible skilled worker visa. <strong>Australia</strong> and <strong>Canada</strong> have skills shortages in civil, structural, and mining engineering. UAE has strong infrastructure demand.';
  else fieldRec='For '+fieldDisplay+': the best country depends on your specific specialisation, salary expectations, and long-term settlement goals. Use the comparison table above to shortlist 2 to 3 countries and research their specific pathways in depth.';

  return page('pathway',
    sectionHead('Global Country Comparison','Visa routes, PR pathways, salary take-home, and cost of living - all six major destinations side by side','#b45309')
    +infoBox('navy','Best option for '+fieldDisplay,fieldRec)
    +tableHtml
  );
}

/* ── Outreach Email Templates ── */
function buildOutreachTemplates(fn,fieldDisplay,targetDisplay,target,qual,exp){
  target=target||A['target-country']||''; /* ensure target is always defined */
  var expYrs=parseInt(exp||'0');
  var isStudent=(A.qualification||'').indexOf('student-')===0||expYrs===0;

  var coldLinkedIn=
    'Subject: '+fieldDisplay+' professional exploring opportunities in '+targetDisplay+'\n\n'
    +'Hi [Name],\n\n'
    +'I came across your profile while researching '+(target==='uk'?'UK':'international')+' '+fieldDisplay+' roles and noticed your work at [Company Name].\n\n'
    +(isStudent
      ?"I'm currently completing my "+(A.qualification==='student-mba'?'MBA':'degree')+' and actively building my career in '+fieldDisplay+'. I\'m particularly interested in [specific aspect of their company or recent project you found interesting].'
      :"I have "+expYrs+" year"+(expYrs!==1?"s":"")+' of experience in '+fieldDisplay+', most recently at [Your Company], where I [one specific achievement in one sentence].')
    +'\n\nI\'m researching how professionals with my background make the move to '+targetDisplay+' and would genuinely value 15 minutes of your time to understand:\n'
    +'- How you approached finding sponsored roles in '+targetDisplay+'\n'
    +'- What the interview process looks like for your company\n'
    +'- Whether your team is likely to have openings in the next 3 to 6 months\n\n'
    +'I\'m not asking you to refer me  -  I know that is a significant thing to ask of someone you don\'t know. I\'m just asking for your perspective.\n\n'
    +'Happy to work around your schedule entirely.\n\n'
    +'Best regards,\n[Your Name]\n[LinkedIn URL]\n[Current Company / University]';

  var recruiterEmail=
    'Subject: '+fieldDisplay+' | '+(target==='uk'?'Visa Sponsorship Available':targetDisplay+' work authorisation')+' | '+expYrs+(expYrs===1?' year':' years')+' experience\n\n'
    +'Hi [Recruiter Name],\n\n'
    +'I\'m reaching out about '+fieldDisplay+' opportunities in '+targetDisplay+'.\n\n'
    +'Quick summary of my profile:\n'
    +'- Role: [Your Current Title]\n'
    +'- Experience: '+expYrs+' year'+(expYrs!==1?'s':'')+' in '+fieldDisplay+'\n'
    +'- Current location: India\n'
    +'- Availability to relocate: [Your timeline]\n'
    +(target==='uk'?'- UK right to work: I require Skilled Worker visa sponsorship\n':
      target==='usa'?'- US authorisation: I will require H-1B sponsorship\n':
      '- Work authorisation: I require employer sponsorship\n')
    +'- Notice period: [Your notice period]\n\n'
    +'I have attached my CV. The roles I\'m targeting are [specific role titles, comma separated].\n\n'
    +'I am happy to have an initial call at your convenience to discuss fit before committing your time to a full submission.\n\n'
    +'Best regards,\n[Your Name]\n[Phone]\n[LinkedIn URL]';

  var hiringManagerEmail=
    'Subject: Application for [Role Title]  -  [Your Name]  -  '+fieldDisplay+(expYrs>0?' - '+expYrs+' years':'')+'\n\n'
    +'Dear [Hiring Manager Name],\n\n'
    +'I am writing to apply for the [Role Title] position at [Company Name] (ref: [job reference if available]).\n\n'
    +'[Company Name] is a specific target for me because [one specific, researched reason: a product they ship, a problem they solve, a recent news item  -  not "your values align with mine" or "I admire your work"].\n\n'
    +(isStudent
      ?'I am currently completing my '+(A.qualification==='student-mba'?'MBA':'degree')+' and will be available to start from [date]. My academic background has given me [specific relevant skill] which I applied to [a real project or academic achievement].'
      :'In my current role at [Company], I [specific achievement with a number]. Before that, I [second achievement with context]. Both have prepared me for [specific aspect of the role you are applying for].')
    +'\n\nI require [Skilled Worker / H-1B / TSS 482] visa sponsorship. I have noted that [Company Name] '+(target==='uk'?'is registered as an approved Skilled Worker sponsor on the UKVI register':'has a track record of sponsoring international candidates')+', which is part of why I am applying directly.\n\n'
    +'I have attached my CV. I would welcome the opportunity to discuss this further at your convenience.\n\n'
    +'Yours sincerely,\n[Your Name]\n[Phone]\n[Email]\n[LinkedIn URL]';

  var templateBox=function(title,text,color){
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-top:4px solid '+color+';border-radius:0 0 8px 8px;margin-bottom:20px">'
      +'<div style="background:'+color+';padding:10px 18px">'
      +'<div style="font-size:11px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:.08em">'+title+'</div>'
      +'</div>'
      +'<div style="padding:18px 20px">'
      +'<pre style="font-size:12.5px;color:#334155;line-height:1.72;white-space:pre-wrap;font-family:Inter,system-ui,sans-serif;margin:0">'+text+'</pre>'
      +'</div></div>';
  };

  return page('skills',
    sectionHead('Outreach Templates',
      fn?fn+', use these as starting points  -  edit every bracketed field before sending':'Edit every bracketed field before sending  -  a personalised email is 4x more likely to get a response','#7c3aed')
    +infoBox('navy','The rule for all outreach','Never send a template unchanged. The single most important edit: replace [Company Name] with their actual name and [one specific reason] with something you looked up. Recruiters receive hundreds of generic emails. The ones that get responses are the ones that show you read one thing about the company before writing.')
    +templateBox('LinkedIn connection request + message (300 character limit for connection note)',
      'Hi [Name]  -  I\'m in '+fieldDisplay+' in India, exploring '+targetDisplay+' opportunities. Came across your profile researching [Company]. Would value 15 minutes of your perspective if you\'re open to it.',
      '#0A2E73')
    +templateBox('Cold LinkedIn message (after connection accepted)',coldLinkedIn,'#1565c0')
    +templateBox('Email to recruiter - response to job posting',recruiterEmail,'#0d9488')
    +templateBox('Direct email to hiring manager',hiringManagerEmail,'#7c3aed')
  );
}

/* ── Sample CV Template ── */
function buildSampleCV(fn,fieldDisplay,targetDisplay,qual,exp){
  var expYrs=parseInt(exp||'0');
  var isStudent=(A.qualification||'').indexOf('student-')===0||expYrs===0;
  var targetKey=A['target-country']||'';
  var cvFormat=targetKey==='usa'||targetKey==='canada'?'Resume':'CV';
  var isUK=targetKey==='uk'||targetKey==='ireland';

  var sampleHtml='<div style="background:#fff;border:2px solid #e2e8f0;border-radius:8px;padding:32px 36px;font-family:Inter,system-ui,sans-serif;max-width:780px;margin:0 auto">'

  // Header
  +'<div style="border-bottom:3px solid #0A2E73;padding-bottom:16px;margin-bottom:20px">'
  +'<div style="font-size:22px;font-weight:800;color:#0A2E73;font-family:Manrope,Inter,sans-serif">[YOUR FULL NAME]</div>'
  +'<div style="font-size:14px;color:#475569;margin-top:4px">[Target Job Title]  -  '+fieldDisplay+'</div>'
  +'<div style="font-size:12.5px;color:#64748b;margin-top:8px;display:flex;flex-wrap:wrap;gap:12px">'
  +'<span>[City, Country]</span>'
  +'<span>[email@domain.com]</span>'
  +'<span>[+91 XXXXX XXXXX]</span>'
  +'<span>linkedin.com/in/[yourprofile]</span>'
  +(isUK?'<span style="color:#0A2E73;font-weight:600">Right to work: Requires Skilled Worker Visa sponsorship</span>':'')
  +'</div></div>'

  // Profile summary
  +'<div style="margin-bottom:20px">'
  +'<div style="font-size:11px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Professional Summary</div>'
  +'<p style="font-size:13px;color:#334155;line-height:1.7;margin:0">'
  +(isStudent
    ?'[MBA / Masters / Bachelor] student at [University Name], specialising in '+fieldDisplay+'. [One sentence about what you have built, researched, or led during your studies that is directly relevant to your target role]. Seeking [Graduate / Entry-level] roles in [Target Country] with Skilled Worker visa sponsorship.'
    :'[Your Job Title] with '+expYrs+' year'+(expYrs!==1?'s':'')+' of experience in '+fieldDisplay+'. [One sentence about your single most significant achievement  -  include a number]. Seeking [next-level role] in '+targetDisplay+' with visa sponsorship.')
  +'</p></div>'

  // Experience section
  +'<div style="margin-bottom:20px">'
  +'<div style="font-size:11px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Experience</div>'
  +(isStudent
    ?'<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:13.5px;font-weight:700;color:#0f172a">[Internship / Project Title]</span><span style="font-size:12.5px;color:#64748b">[Month Year] - [Month Year]</span></div><div style="font-size:13px;color:#475569;margin-bottom:6px">[Organisation Name]  -  [City]</div>'
    +'<ul style="margin:0;padding-left:18px;font-size:13px;color:#334155;line-height:1.7">'
    +'<li>[Action verb] + [what you did] + [result or impact]. E.g.: Analysed customer churn data for 12,000 users and identified 3 key drop-off points, leading to a redesigned onboarding flow.</li>'
    +'<li>[Second achievement. Always lead with a verb. Always include a number if you can find one.]</li>'
    +'<li>[Third achievement. If you cannot quantify it, describe the scope: "across 4 teams", "for 200 users", "over 8 weeks".]</li>'
    +'</ul></div>'
    :'<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:13.5px;font-weight:700;color:#0f172a">[Your Current Job Title]</span><span style="font-size:12.5px;color:#64748b">[Month Year] - Present</span></div><div style="font-size:13px;color:#475569;margin-bottom:6px">[Company Name]  -  [City, Country]</div>'
    +'<ul style="margin:0;padding-left:18px;font-size:13px;color:#334155;line-height:1.7">'
    +'<li>[Led / Built / Delivered / Reduced / Increased] + [what] + [result]. E.g.: Reduced API response time by 40% through query optimisation, improving user retention by 12%.</li>'
    +'<li>[Second achievement with a number or scale indicator.]</li>'
    +'<li>[Third achievement. Every bullet should make the reader think "this person has done real work".]</li>'
    +'</ul></div>'
    +'<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:13.5px;font-weight:700;color:#0f172a">[Previous Job Title]</span><span style="font-size:12.5px;color:#64748b">[Month Year] - [Month Year]</span></div><div style="font-size:13px;color:#475569;margin-bottom:6px">[Company Name]  -  [City]</div>'
    +'<ul style="margin:0;padding-left:18px;font-size:13px;color:#334155;line-height:1.7">'
    +'<li>[Achievement with number.]</li>'
    +'<li>[Achievement with scope.]</li>'
    +'</ul></div>')
  +'</div>'

  // Education
  +'<div style="margin-bottom:20px">'
  +'<div style="font-size:11px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Education</div>'
  +'<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between"><span style="font-size:13.5px;font-weight:700;color:#0f172a">[Degree Title, e.g. MBA / B.Tech Computer Science]</span><span style="font-size:12.5px;color:#64748b">[Year] - [Year or Present]</span></div>'
  +'<div style="font-size:13px;color:#475569">[University Name]  -  [City, Country]</div>'
  +(isStudent?'<div style="font-size:12.5px;color:#0A2E73;margin-top:3px">Currently in progress. Expected graduation: [Month Year]</div>':'')
  +'</div></div>'

  // Skills
  +'<div style="margin-bottom:20px">'
  +'<div style="font-size:11px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Skills</div>'
  +'<div style="font-size:13px;color:#334155;line-height:1.8">'
  +'<strong>Technical:</strong> [List 6-8 specific tools, technologies, or technical competencies relevant to your field. Be specific  -  not "Microsoft Office" but "Advanced Excel: financial modelling, VBA".]<br>'
  +'<strong>Professional:</strong> [3-4 professional skills: e.g. stakeholder management, financial modelling, product roadmapping, user research]<br>'
  +'<strong>Certifications:</strong> [List any: PMP, AWS SAA, CFA Level 1, IELTS 7.0, etc.]'
  +'</div></div>'

  +'</div>'

  // Instructions
  +'<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 18px;margin-top:16px">'
  +'<div style="font-size:11px;font-weight:800;color:#1e3a8a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Format rules for '+targetDisplay+'</div>'
  +'<ul style="font-size:13px;color:#1e3a8a;line-height:1.75;margin:0;padding-left:18px">'
  +(isUK?'<li>2 pages maximum. No photo. No date of birth. No marital status.</li><li>Reverse chronological order (most recent first).</li><li>Include: right to work status ("Requires Skilled Worker Visa sponsorship").</li><li>References: write "Available on request" at the bottom  -  do not include names.</li>':'')
  +(targetKey==='usa'||targetKey==='canada'?'<li>1 page for under 8 years experience. 2 pages for senior.</li><li>No photo. No nationality. No marital status.</li><li>ATS-optimised: paste keywords from each job description into your bullet points verbatim.</li><li>Objective statement at top replaced by a 2-line professional summary.</li>':'')
  +(targetKey==='australia'?'<li>2-3 pages acceptable. No photo becoming standard.</li><li>Key Selection Criteria (KSC) required for all government/public sector roles  -  each criterion addressed with a STAR example.</li><li>List 2-3 referees with contact details at the bottom.</li>':'')
  +'<li>Every bullet point: Lead with an action verb. Include a number or scale indicator. Remove: "responsible for", "worked on", "helped with".</li>'
  +'<li>Tailor for every application: re-read the job description, find the 5 most repeated phrases, and use them in your bullet points and summary.</li>'
  +'</ul></div>';

  return page('position',
    sectionHead('Sample '+cvFormat+' Template',
      fn?fn+', edit every field in brackets before using this. The structure, formatting rules, and right-to-work statement are set for '+targetDisplay+'.':'Edit every bracketed field. Structure and format rules are set for '+targetDisplay+'.','#be123c')
    +sampleHtml
  );
}

/* ── Interview Guide ── */
function buildInterviewGuide(fn,fieldDisplay,targetDisplay,exp,qual){
  var expYrs=parseInt(exp||'0');
  var isStudent=(A.qualification||'').indexOf('student-')===0||expYrs===0;
  var level=expYrs===0?'entry':expYrs<=3?'junior':expYrs<=7?'mid':'senior';
  var target=A['target-country']||''; /* resolve target from A directly */

  var levelGuide={
    entry:{
      expect:'For entry-level and graduate roles in '+targetDisplay+': expect 2 to 3 rounds. (1) HR screen: 20 to 30 minutes, basic background and motivation. (2) Technical or functional round: 45 to 60 minutes testing core knowledge, often with a case study or live problem. (3) Final round with hiring manager or panel.',
      behavioural:'STAR method is the standard for behavioural questions at all levels. At entry level, use academic projects, internships, and extracurricular examples if you have limited work experience. The format: Situation (1 sentence, set the context), Task (1 sentence, what you were responsible for), Action (2 to 3 sentences of what YOU specifically did  -  not the team), Result (one outcome with a number or observable impact).',
      technical:'Entry-level technical questions test fundamentals: can you apply what you studied to a real problem? Practice: explain your dissertation or final year project clearly without jargon. Be ready to say "I have not done that in a professional context, but in my studies I approached a similar problem by..."',
      common:[
        '"Tell me about yourself."  -  1 to 2 minutes. Your degree, one relevant project, why this role and this company. Not your life story.',
        '"Why do you want to work in '+targetDisplay+'?"  -  Be honest. Do not say "for a better life". Say "because [specific opportunity in this field in this country]".',
        '"Where do you see yourself in 5 years?"  -  Entry level: describe the skills and experience you want to build, not a specific title.',
        '"Tell me about a time you dealt with a difficult situation."  -  Use STAR. Academic or extracurricular examples are acceptable.',
        '"Do you require visa sponsorship?"  -  Say yes directly. Do not apologise for it. Know whether this company sponsors (check the UKVI register for UK roles before applying).',
      ]
    },
    junior:{
      expect:'For 1 to 3 year professionals: 3 rounds typical. (1) Recruiter screen. (2) Technical/functional interview with a senior team member. (3) Hiring manager interview. Some companies add a take-home task or case study.',
      behavioural:'Your STAR examples should now come from professional experience. Every example should have a number in the Result. "Increased X by Y%" is always better than "improved X significantly". Prepare 8 to 10 strong STAR examples covering: initiative, delivery under pressure, disagreement with a colleague or manager, learning from failure, cross-team collaboration.',
      technical:'Be ready to walk through real work you have done. Bring specific examples from your current role. If given a case study, think out loud  -  the interviewer wants to see how you approach problems, not just the answer.',
      common:[
        '"What\'s the biggest achievement in your current role?"  -  This is your best STAR story. Prepare it until you can deliver it in under 2 minutes without reading.',
        '"Why are you looking to move to '+targetDisplay+'?"  -  Honest, forward-looking, professional. Tie it to the opportunity in your field in this country.',
        '"What do you know about our company?"  -  Research: last two quarterly results or major announcements, the specific team you are interviewing with, one challenge they face in their market. Show you looked.',
        '"Describe a time you had to learn something new quickly."  -  Use STAR.',
        '"What salary are you expecting?"  -  Know the market range before the interview. Name a number or range based on your research. Saying "what is the budget?" is acceptable.',
      ]
    },
    mid:{
      expect:'For 3 to 8 year professionals: 3 to 5 rounds. (1) Recruiter screen. (2) Technical or functional panel (often 2 interviewers). (3) Leadership/management round. (4) Sometimes a presentation or business case. Senior roles may add a final CXO conversation.',
      behavioural:'Your examples need to demonstrate impact at team or business level, not just individual contribution. Upgrade your STAR examples: "my team reduced X by Y%  -  I did this by [specific action]" is stronger than "I reduced X by Y%". Show that you think about outcomes, not just tasks.',
      technical:'Mid-level interviews increasingly test judgment, not just knowledge. Be ready for ambiguous scenarios: "how would you approach X?" with no right answer. The interviewer is testing whether you ask the right questions before jumping to solutions.',
      common:[
        '"How do you manage stakeholders who disagree with your approach?"  -  Show empathy, evidence, and compromise. Not "I always convince them".',
        '"Describe a time your project did not go as planned."  -  Own it. What you learned matters more than what went wrong.',
        '"How do you stay current in your field?"  -  Name specific publications, communities, or practices.',
        '"What is your approach to managing a team?"  -  Even if you have not managed a team yet, describe how you have influenced people without authority.',
        '"What questions do you have for us?"  -  Prepare 2 to 3 real questions. Not "what are your company values?"  -  something you genuinely want to know about the team or the role.',
      ]
    },
    senior:{
      expect:'For 8+ year professionals: 4 to 6 rounds. Expect a mix of: (1) Executive screen with VP or C-suite. (2) Technical depth interviews with principal-level peers. (3) Cross-functional interviews. (4) A presentation or written proposal. References checked before final offer. Process can take 6 to 12 weeks.',
      behavioural:'At senior level, interviewers are assessing your strategic judgment and leadership character, not just your technical ability. Every answer should demonstrate business impact, organisational influence, or team development. "I managed a team" is not enough  -  "I grew the team from 4 to 12, set the technical strategy, and reduced delivery cycle from 6 weeks to 10 days" is.',
      technical:'Senior technical interviews test architectural thinking, trade-off reasoning, and the ability to defend decisions under challenge. Expect probing: "why that approach and not X?" Be comfortable saying "I would need to know more about the constraints to commit to a direction."',
      common:[
        '"Tell me about a time you influenced a decision at the executive level."  -  Describe the context, your approach to building the case, the stakeholders involved, and the outcome.',
        '"How do you build high-performing teams?"  -  Specific practices: how you hire, how you develop, how you exit underperformers without damaging culture.',
        '"Describe a strategic decision you made that did not work."  -  Show that you take calculated risks, learn systematically, and share learnings.',
        '"What is your management philosophy?"  -  Have a genuine, tested answer. Not "I like to empower people".',
        '"Where do you see this market / function / technology in 5 years?"  -  Show you have a point of view, backed by research and experience.',
      ]
    }
  };

  var lg=levelGuide[level]||levelGuide['junior'];

  return page('skills',
    sectionHead('Interview Preparation Guide',
      fn?fn+', at '+expYrs+' year'+(expYrs!==1?'s':'')+' of experience, here is exactly what to expect and how to prepare for interviews in '+targetDisplay:'How to prepare for interviews in '+targetDisplay+' at your experience level','#be123c')
    +'<div style="margin-bottom:20px">'
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px">What to expect in '+(target||'international')+' interviews</div>'
    +'<p style="font-size:13.5px;color:#475569;line-height:1.75;margin:0">'+lg.expect+'</p>'
    +'</div>'
    +infoBox('blue','Behavioural questions  -  STAR method',lg.behavioural)
    +infoBox('teal','Technical and functional rounds',lg.technical)
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:20px 0 12px">Most common questions at your level  -  with what the interviewer is actually testing</div>'
    +lg.common.map(function(q){
      var parts=q.split('  -  ');
      var question=parts[0].trim();
      var why=parts[1]?parts[1].trim():'';
      return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:13px 16px;margin-bottom:10px">'
        +'<div style="font-size:13.5px;font-weight:700;color:#0A2E73;margin-bottom:'+(why?'5px':'0')+'">'+question+'</div>'
        +(why?'<div style="font-size:12.5px;color:#475569;line-height:1.65">'+why+'</div>':'')
        +'</div>';
    }).join('')
  );
}


/* ═══════════════════════════════════
   OPTION A: AI REPORT GENERATION
   Calls Claude API with structured
   user data. Falls back to template
   if API call fails.
═══════════════════════════════════ */

function buildMigrateReport(A,name,fieldDisplay,targetDisplay,target,qual,exp,english,addons){
  var fn=name.split(' ')[0]||'there';
  var from=A['migrate-from']||'india';
  var expYrs=parseInt(exp||'0');
  var isReturn=target==='return-india';
  var isOpen=target==='open'||target==='';

  /* ── Readiness scoring ── */
  var r=calcReadiness('migrate',qual,exp,english,A);

  /* Build profile rows for display */
  var migrateRows=[
    ['Name', name||'—'],
    ['Field', fieldDisplay],
    ['Qualification', getQualDisplay(qual)],
    ['Experience', exp+' year'+(exp!=='1'?'s':'')],
    ['Currently based', getCountryDisplay(from)||from||'—'],
    ['Destination', isReturn?'Settling in India':isOpen?'Open to best option':getCountryDisplay(target)],
  ];
  if(english&&english!=='not-specified'){
    migrateRows.push(['English test', {
      'ielts-high':'IELTS 7.0+','ielts-65':'IELTS 6.5','ielts-mid':'IELTS 6.0 or below',
      'oet-b':'OET Grade B','toefl-high':'TOEFL 90+','pte-high':'PTE 65+',
      'below-required':'Below required threshold','not-taken':'Not yet taken','native':'Native / educated in English'
    }[english]||english]);
  }

  var html='';
  html+=buildProfileSection(migrateRows, r, isReturn?'India (settlement)':isOpen?'Global':getCountryDisplay(target), fn);

  /* ── ROUTE: Return to India ── */
  if(isReturn){
    html+=buildSettleInIndiaReport(fn,fieldDisplay,from,qual,exp,expYrs,r);
    return html;
  }

  /* ── ROUTE: Open / Best match ── */
  if(isOpen){
    html+=buildMigrateOpenReport(fn,fieldDisplay,qual,exp,expYrs,english,r);
    return html;
  }

  /* ── ROUTE: Specific country ── */
  html+=buildMigrateCountryReport(fn,fieldDisplay,target,targetDisplay,from,qual,exp,expYrs,english,r);
  return html;
}

/* ───────────────────────────────
   RETURN TO INDIA REPORT
─────────────────────────────── */

function buildMigrateOpenReport(fn,fieldDisplay,qual,exp,expYrs,english,r){
  var hasEnglish=english&&english!=='not-taken'&&english!=='not-specified';

  var recommendations=[
    {
      country:'Canada',flag:'🇨🇦',
      why:'Fastest permanent residency route globally. Express Entry draws every 2 weeks. No annual cap on skilled workers. Pathway to PR in 6 to 12 months from Invitation to Apply. Strong tech, engineering, and healthcare demand. Official language English  -  no additional language requirement for most streams.',
      pr:'Express Entry: CRS 470 to 510 points for recent draws. PR in 6 to 12 months from ITA. Citizenship: 3 of 5 years physical presence after PR.',
      best:'Strong fit for tech, engineering, finance, and healthcare professionals at all experience levels. Quebec streams favour French speakers.'
    },
    {
      country:'Australia',flag:'🇦🇺',
      why:'Points-based system with no employer sponsorship required for the Skilled Independent (189) visa. 65+ points typically needed. Points awarded for age, English, qualifications, experience, and state nomination. Growing tech and healthcare sectors. No language test needed beyond English.',
      pr:'Subclass 189: Points-tested permanent visa directly. Subclass 190: State nomination adds 5 points and leads to PR. Citizenship: 4 years as PR, including 1 year permanent, then apply.',
      best:'Particularly strong for healthcare workers, engineers, IT professionals, and tradespeople. Indian students now receive 5 to 6 year post-study work visas.'
    },
    {
      country:'Germany',flag:'🇩🇪',
      why:'New Skilled Workers Act (2023) and Chancenkarte (Opportunity Card, 2024) make Germany the most accessible European destination for Indian professionals. EU Blue Card requires job offer and degree recognition but processing is 2 to 4 weeks for Blue Card holders.',
      pr:'EU Blue Card + B1 German: Settlement Permit in 2 years. Without German: 4 years. Citizenship from 2024 reform: 5 years (3 years with exceptional integration). Dual citizenship now permitted.',
      best:'Engineers, software developers, researchers, doctors. German language (B1) significantly accelerates timelines and daily life quality. Public university fees are near-zero for MSc/PhD.'
    },
    {
      country:'Ireland',flag:'🇮🇪',
      why:'Critical Skills Employment Permit requires a job offer in a shortage occupation (most tech, engineering, healthcare, science roles qualify) at €32,000+. English-speaking. After 2 years on Critical Skills: Stamp 4 (work without restriction). After 5 years: Irish citizenship  -  which is EU citizenship, the most mobile passport in the world.',
      pr:'Stamp 4 after 2 years on Critical Skills. Irish citizenship after 5 years legal residence (1 of last 9). Strong diaspora community and India-Ireland IT industry links.',
      best:'Software engineers, data scientists, pharmacists, and healthcare professionals. Strong India connections through tech multinationals based in Dublin.'
    },
    {
      country:'United Kingdom',flag:'🇬🇧',
      why:'Skilled Worker visa requires employer sponsorship (85,000+ licensed sponsors). Clear 5-year pathway to ILR. English-speaking. Strong finance, tech, and healthcare sectors. The Health and Care Worker visa is a fast-track route for clinical professionals with reduced fees.',
      pr:'ILR after 5 years on Skilled Worker visa. British citizenship 12 months after ILR. Total: approximately 6 years.',
      best:'Healthcare professionals (nursing, physiotherapy, medicine), tech workers, and finance professionals. The NHS is one of the largest employers of Indian healthcare graduates globally.'
    },
  ];

  var tableHtml=recommendations.map(function(c,i){
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px 22px;margin-bottom:14px">'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'
      +'<span style="font-size:22px">'+c.flag+'</span>'
      +'<div><div style="font-size:15px;font-weight:800;color:#0A2E73">'+c.country+'</div>'
      +'<div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em">Recommended for your profile</div>'
      +'</div></div>'
      +'<p style="font-size:13px;color:#334155;line-height:1.72;margin-bottom:10px">'+c.why+'</p>'
      +'<div style="background:#f8fafc;border-radius:6px;padding:10px 14px;margin-bottom:8px">'
      +'<div style="font-size:11px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">PR and citizenship timeline</div>'
      +'<p style="font-size:12.5px;color:#475569;line-height:1.65;margin:0">'+c.pr+'</p>'
      +'</div>'
      +'<div style="font-size:12.5px;color:#059669;font-weight:600">Best for: '+c.best+'</div>'
      +'</div>';
  }).join('');

  return page('position',
    sectionHead('Section 2: Best Migration Pathways for Your Profile','The five strongest destinations based on visa accessibility, PR speed, and demand in your field','#0d9488')
    +infoBox('amber','What to prioritise when choosing a migration destination','Three things matter more than anything else: (1) Does your field have a skills shortage there  -  this determines visa accessibility and salary; (2) What is the realistic PR timeline  -  not the minimum, but the realistic median; (3) What is your English level  -  countries that require a points test (Australia, Canada) need IELTS 6.0 to 8.0 depending on the route. The UAE offers no PR for most people  -  high salaries but no long-term settlement pathway for the majority.')
    +tableHtml
  );
}

/* ───────────────────────────────
   SPECIFIC COUNTRY MIGRATE REPORT
─────────────────────────────── */
function buildMigrateCountryReport(fn,fieldDisplay,target,targetDisplay,from,qual,exp,expYrs,english,r){
  var countryData={
    uk:{
      routes:[
        ['Skilled Worker Visa','Main route. Requires a licensed sponsor (employer). Minimum salary: £26,200 or role going rate, whichever is higher. Healthcare: £23,200 minimum with shortage occupation. 85,000+ licensed sponsors on UKVI register.'],
        ['Health and Care Worker Visa','For doctors, nurses, allied health professionals. Lower visa fees, faster processing, no Immigration Health Surcharge. Requires NMC/GMC/HCPC registration or pending application.'],
        ['Global Talent Visa','No job offer required. Requires endorsement from: Tech Nation (digital tech), Royal Society (science), British Academy (humanities), or equivalent. Highly competitive.'],
        ['High Potential Individual','Graduated from top 50 global university within last 5 years. 2-year visa, no job offer needed. Must be employed within 2 years.'],
        ['Graduate Route','2 years (3 for PhD) post-study work after UK degree. No employer restriction. Can switch to Skilled Worker after landing a sponsored role.'],
      ],
      pr:'5 continuous years on Skilled Worker visa → ILR (Indefinite Leave to Remain). Must earn above £26,200 throughout. Absence must not exceed 180 days per year. After ILR: British citizenship after 12 further months. Total route: approximately 6 years.',
      english:'Skilled Worker: IELTS 4.0 or equivalent for most roles (very low bar). Healthcare roles: IELTS 7.0 each component (HCPC, NMC, GMC requirement). Global Talent: no English test required.',
      costs:'Visa fee: £719 (up to 3 years) or £1,420 (up to 5 years). Immigration Health Surcharge: £1,035/year (waived for Health and Care Worker). No fee for ILR after 5 years.',
      timeline:'Visa decision: 3 to 8 weeks from biometrics. ILR: 5 years from entry. Citizenship: 6 years from entry.',
    },
    canada:{
      routes:[
        ['Express Entry  -  Federal Skilled Worker','No job offer required. Points-based CRS score. Recent invitation draws: 470 to 510 CRS. Submit profile → wait for ITA (Invitation to Apply) → apply for PR within 60 days. Processing: 6 to 12 months from ITA.'],
        ['Federal Skilled Trades','Skilled trades workers. Less common but faster draws. Requires job offer or certification from provincial body.'],
        ['Provincial Nominee Program (PNP)','80+ streams across 11 provinces. Adds 600 CRS points  -  effectively guarantees ITA. Best provinces for Indian professionals: Ontario Tech, Alberta Advantage, BC Tech Pilot.'],
        ['Atlantic Immigration Program','New Brunswick, Nova Scotia, PEI, Newfoundland. Job offer required but lower CRS threshold. Strong healthcare and engineering demand.'],
        ['Rural and Northern Immigration Pilot','Small communities. Job offer required. Lower competition.'],
      ],
      pr:'Express Entry → PR in 6 to 12 months from ITA. No minimum residency to maintain PR in first 5 years (must be present 2 of 5 years). Citizenship: physically present 3 of 5 years after PR. No language test for citizenship (assessed during PR).',
      english:'Express Entry: IELTS CLB 7 (approx IELTS 6.0 each component) minimum for FSW. Higher score = more CRS points. IELTS 7.5 to 8.0 = maximum English points (24 to 28 CRS).',
      costs:'IRCC application fee: CAD 1,365 for principal applicant + CAD 1,365 spouse + CAD 260 per dependent child. Biometrics: CAD 85. PR card: included. No annual fee.',
      timeline:'Profile submission to ITA: varies by CRS score, typically 2 to 18 months. ITA to PR: 6 to 12 months. Total from profile: 8 to 30 months depending on CRS score.',
    },
    australia:{
      routes:[
        ['Skilled Independent (Subclass 189)','No employer sponsor, no state nomination needed. Points-tested. 65+ points for most occupation lists. Points: age (max 30 at 25 to 32), English (20 for superior), qualifications (15 for doctorate), experience (max 20 for 8+ years overseas). ANZSCO occupation list check required.'],
        ['Skilled Nominated (Subclass 190)','State or territory nominates. +5 points above 189 requirements. Different state lists have different in-demand occupations. Victoria, NSW, and Queensland most popular.'],
        ['Skilled Work Regional (Subclass 491)','Regional area nomination. +15 points. Must live and work in nominated region for 3 years before applying for 191 (permanent).'],
        ['Temporary Skill Shortage (Subclass 482)','Employer sponsored. Medium-term stream: 4 years. After 3 years can apply for 186 (permanent). Short-term stream: 2 years, limited pathways to PR.'],
        ['Employer Nomination Scheme (Subclass 186)','Permanent employer-sponsored. Requires 3 years experience in role in Australia (from 482) or direct entry for highly skilled workers.'],
      ],
      pr:'Subclass 189/190: PR on grant. Citizenship: 4 years as PR resident, including 12 months as permanent resident before application. Total from first visa: 5 to 7 years.',
      english:'Points-based: Competent (IELTS 6.0 each) = 0 extra points. Proficient (IELTS 7.0 each) = 10 points. Superior (IELTS 8.0 each) = 20 points. Most 189 applicants need Proficient or Superior to be competitive.',
      costs:'Subclass 189/190: AUD 4,640 principal applicant + AUD 2,320 spouse + AUD 1,160 each child. Subclass 482: AUD 3,115 (employer often covers). No annual residency fee after PR.',
      timeline:'EOI to invitation: 2 to 24 months depending on occupation and points. Application to PR: 3 to 12 months. Total: 5 to 36 months from first contact.',
    },
    germany:{
      routes:[
        ['EU Blue Card','Requires university degree (recognised in Germany), job offer ≥ €45,300/year (€41,042 for shortage occupations: IT, engineering, healthcare, science, maths). Fast-track: 2-week processing.'],
        ['Chancenkarte (Opportunity Card) 2024','New from 2024. No job offer needed. Points-based: degree (3 points), work experience (1 point per year), German language (1 point per level up to B2), age under 35 (1 point). Need 6 points. 1-year job search visa, can work 20 hours/week. Valid renewable.'],
        ['Skilled Worker Visa','Job offer required. Degree or 2 years vocational training recognised by Germany. Simpler than EU Blue Card for vocational occupations.'],
        ['Job Seeker Visa','6 months to look for work. Must have degree, 5 years experience, sufficient funds (approx EUR 10,000), and basic German (A1) for some consulates.'],
      ],
      pr:'EU Blue Card + B1 German: Settlement Permit (Niederlassungserlaubnis) after 2 years. Without B1 German: 4 years. Citizenship: 5 years legal residence (3 years for exceptional integration from 2024 reform). Dual citizenship now allowed for Indian nationals since 2024.',
      english:'Most tech companies in Berlin, Munich, and Hamburg operate fully in English. For non-tech sectors and daily life: German B1 minimum for comfortable integration, B2 for professional fluency. German language adds Chancenkarte points and accelerates PR.',
      costs:'National visa (Type D): EUR 75. EU Blue Card: EUR 100. Settlement permit: EUR 113. No annual fees. Health insurance mandatory: approx EUR 200 to 350/month (public statutory).',
      timeline:'Visa processing: 6 to 12 weeks at German consulate. Blue Card: 2 to 4 weeks on arrival. Settlement permit: 2 to 4 years from entry. Citizenship: 5 years from entry.',
    },
    ireland:{
      routes:[
        ['Critical Skills Employment Permit','Job offer in shortage occupation at €32,000+ (most tech, engineering, healthcare, science). Processed in 4 to 6 weeks. After 2 years: Stamp 4 (work without restriction).'],
        ['General Employment Permit','Job offer at €30,000+, not on ineligible list. Labour Market Needs Test (employer must show no EU candidate available). Slower: 8 to 12 weeks processing.'],
        ['Intra-Company Transfer Permit','Transfer from overseas branch to Irish office. Min. €30,000. No LMNT required.'],
        ['Start-Up Entrepreneur Programme','Bring a business idea with innovation potential. EUR 75,000 funding required.'],
      ],
      pr:'Critical Skills: Stamp 4 after 2 years (no restrictions on work). Stamp 4 → Irish citizenship: 5 years legal residence total (1 of last 9 years must be immediately before application). Irish citizenship = EU citizenship. Can then live and work in any of 27 EU countries.',
      english:'English is the working language. No formal test required for employment permits (employers assess informally). For citizenship application: no formal language test, but Irish or English proficiency assumed.',
      costs:'Critical Skills permit: EUR 1,000 (employer pays). Work permit renewal: EUR 500 to 750. IRP (registration card): EUR 300. No annual fee.',
      timeline:'Critical Skills processing: 4 to 6 weeks. Citizenship: 5 years from arrival if continuous residence.',
    },
    netherlands:{
      routes:[
        ['Highly Skilled Migrant (Kennismigrant)','Fastest route in Europe. Employer must be recognised sponsor. Minimum salary: €5,008/month gross (2024) for workers under 30: €3,672/month. Visa processed in 2 weeks. 1 to 3 year permit, renewable.'],
        ['EU Blue Card','Job offer ≥ €5,670/month gross. Similar to HSM but EU-wide recognition after 18 months.'],
        ['Orientation Year (Zoekjaar)','Graduated from top 200 global university within 3 years. 1-year search visa. Then switch to HSM on finding qualifying employer.'],
        ['Self-Employment (Zelfstandige)','Business plan required, assessed by IND. Points-based scoring. Higher threshold.'],
      ],
      pr:'5 years legal residence → permanent residence (Article 8 EU Long-Term Residence). Citizenship: 5 years + civic integration exam (inburgering) in Dutch. Dual citizenship generally not permitted (Indian exception: India does not recognise dual nationality anyway).',
      english:'Amsterdam, The Hague, and Rotterdam tech and finance sectors operate in English. Dutch required for civic integration exam for citizenship, and for roles outside international companies.',
      costs:'HSM permit: EUR 192 (initial) + EUR 192 renewal. IND processing: 2 weeks with recognised sponsor. MVV (entry visa if required): EUR 192.',
      timeline:'HSM visa: 2 weeks from employer application. PR: 5 years. Citizenship: 5 years + integration exam.',
    },
    singapore:{
      routes:[
        ['Employment Pass (EP)','Employer-sponsored. Minimum salary: SGD 5,000/month (SGD 5,500 for financial services). From 2023: COMPASS scoring system adds qualifications, diversity, and local employment ratio considerations. Approved in 3 to 8 weeks.'],
        ['S Pass','Mid-skilled workers. SGD 3,150/month minimum. Quota-based per employer.'],
        ['Tech.Pass','Fixed 2-year pass for experienced tech professionals: 5+ years in leading tech company or startup, or SGD 240,000+ income in last year.'],
      ],
      pr:'EP → PR application: typically apply after 2 to 3 years on EP. MOM approves approximately 30 to 40% of applications. No points threshold published  -  discretionary. PR validity: 5 years renewable. Citizenship: 2 years after PR, highly selective (Indian nationals: under 5% citizenship grant rate historically).',
      english:'English is one of four official languages and the working language across all professional sectors. No test required.',
      costs:'EP application: SGD 105 (employer). EP card: SGD 225. No annual fee. PR application: SGD 100. Citizenship application: SGD 100.',
      timeline:'EP: 3 to 8 weeks. PR application to decision: 4 to 6 months. Citizenship: 2 years after PR (if approved).',
    },
    'new-zealand':{
      routes:[
        ['Accredited Employer Work Visa (AEWV)','From 2023. Employer must be NZBN-registered and accredited. 1 to 3 years. Minimum salary NZD 29.66/hour (2024 minimum wage). Many AEWV holders transition to Skilled Migrant after 2 years.'],
        ['Skilled Migrant Category (SMC)','Points-based. 160+ points typically for invitation. Points: age, qualifications, skilled employment offer. Currently under review by government.'],
        ['Green List  -  Straight to Residence','Specific high-demand occupations (GPs, specialists, engineers, certain IT roles) can apply directly for residence. Two tiers: Tier 1 straight to residence, Tier 2 work-to-residence.'],
        ['Investor Visas','Investor 1 (passive): NZD 10 million. Investor 2 (active): NZD 3 million + business experience.'],
      ],
      pr:'AEWV → SMC Residence: 2 years work experience in NZ + 160+ SMC points. Green List: direct residence for eligible occupations. PR (Resident Visa) is permanent once granted in NZ. Citizenship: 5 years resident in NZ including at least 1,350 days.',
      english:'NZ Immigration: IELTS 6.5 overall (no band below 6.0) for most skilled residence categories. NZQA (qualifications authority) assessment may be needed for offshore qualifications.',
      costs:'AEWV: NZD 750 (employer) + NZD 700 (applicant). Residence application: NZD 4,080. No annual fee.',
      timeline:'AEWV: 4 to 8 weeks. SMC invitation: months to years depending on draw. Green List direct residence: 6 to 12 months.',
    },
    uae:{
      routes:[
        ['Employment Visa','Standard employer-sponsored. 2 to 3 year contracts typical. No minimum salary in law but de facto minimums apply by profession.'],
        ['Green Visa (2022)','5-year self-sponsored visa. Requires either: skilled employee earning AED 15,000+/month, or freelancer/self-employed with approved professional licence.'],
        ['Golden Visa (10-year)','10-year renewable. Categories: Investors (property AED 2M+), entrepreneurs, specialised talents (doctors, engineers, scientists, artists, athletes, PhD holders), outstanding students.'],
        ['Freelance Permit','Available through free zones: IFZA, SHAMS, RAKEZ. Cost: AED 5,750 to 15,000/year depending on zone.'],
      ],
      pr:'IMPORTANT: The UAE does not offer permanent residency or citizenship to most expats. The Golden Visa is a 10-year renewable long-term residency, not PR or citizenship. A small number of citizenship grants have been made by decree to exceptional individuals but this is not an open application process. If long-term settlement and citizenship are your goals, the UAE is NOT the right destination.',
      english:'English is the professional working language. Arabic not required for most corporate roles.',
      costs:'Employment visa: AED 3,000 to 5,000 (usually employer-paid). Golden Visa: AED 2,800 application + property or qualification evidence. Green Visa: AED 3,110 + professional licence.',
      timeline:'Employment visa: 2 to 4 weeks. Golden Visa: 4 to 8 weeks for eligible applicants. Residence renewal every 2 to 10 years depending on visa type.',
    },
    usa:{
      routes:[
        ['H-1B Specialty Occupation','Employer-sponsored. Annual cap: 65,000 regular + 20,000 Master\'s exemption. Registration lottery in March each year. If selected: visa valid 3 years (extendable to 6, then unlimited while GC pending).'],
        ['O-1A Extraordinary Ability','No lottery, no employer cap. Must demonstrate sustained national/international acclaim. Used by senior professionals, entrepreneurs, researchers.'],
        ['L-1 Intracompany Transfer','Transferring from overseas office to US office of same company. L-1A (manager/executive) → EB-1C Green Card fastest path.'],
        ['EB-1A / EB-1C Green Card','Extraordinary ability (EB-1A) or multinational executive (EB-1C). Priority Dates: often current for EB-1. Bypass the H-1B lottery.'],
        ['EB-2 / EB-3 Green Card','Professional workers. Indian nationals face Priority Date backlogs of 50 to 100+ years due to per-country caps. This is not a practical route for most Indian applicants.'],
      ],
      pr:'CRITICAL: Indian nationals face a Green Card backlog of 50 to 100+ years in EB-2 and EB-3 categories due to per-country numerical caps. Only EB-1A/1C (extraordinary ability / multinational executive) are practically achievable. The H-1B does not lead to PR without a Green Card petition. If permanent residency is your primary goal, Canada and Australia are significantly more accessible.',
      english:'English is the working language. No formal test required for H-1B (employer assesses). O-1 requires evidence of work quality.',
      costs:'H-1B filing: $730 base + $500 ACWIA + $2,500 to $4,500 fraud prevention fees (employer pays most). USCIS Premium Processing (15-day): $2,805 (optional). Attorney fees: $2,000 to $5,000 typical.',
      timeline:'H-1B lottery results: April. Visa validity start: October 1. Total: 6 months from registration. Green Card EB-1: 1 to 3 years. EB-2/EB-3: decades for Indian nationals.',
    },
  };

  var cd=countryData[target];
  if(!cd){
    /* fallback for countries not in our data */
    return page('position',
      sectionHead('Section 2: Migration Pathway  -  '+targetDisplay,'What we know about this destination','#0A2E73')
      +infoBox('amber','Research in progress',fn+', we have detailed data for the UK, Canada, Australia, Germany, Ireland, Netherlands, Singapore, New Zealand, UAE, and USA. For '+targetDisplay+', we recommend contacting the official immigration authority or booking a session with a Tutorment counsellor for personalised guidance.')
    );
  }

  var routesTable=reqTable(cd.routes,false);

  return page('position',
    sectionHead('Section 2: Migration Routes  -  '+targetDisplay,'Every pathway available for your profile, with eligibility and realistic timelines','#0A2E73')
    +routesTable
    +infoBox('navy','PR and citizenship pathway',cd.pr)
    +infoBox('blue','English language requirements',cd.english)
  )
  +page('skills',
    sectionHead('Section 3: Costs and Timelines','What it actually costs and how long it realistically takes','#7c3aed')
    +infoBox('teal','Visa and application costs',cd.costs)
    +infoBox('navy','Realistic timeline from today',cd.timeline)
    +infoBox('amber','What most people underestimate','The visa processing time is not the bottleneck  -  getting a qualifying job offer (for sponsored routes), gathering documents (birth certificate, police clearance, degree attestation, IELTS scores), and navigating the qualification recognition process (especially for Germany) are where most timelines slip. Begin document gathering on the same day you begin job applications.')
  );
}

function buildNegotiationGuide(fn,fieldDisplay,currentSal,targetSal){
  return page('skills',
    sectionHead('Salary Negotiation Guide',
      fn?fn+', use this framework when you have an offer or are requesting a review':'Use this framework when you have an offer or are requesting a review','#059669')
    +infoBox('navy','The single most important rule','Never name a number first. The first number in any negotiation anchors the entire conversation. When asked "what are your expectations?", respond with: "I am more interested in the right fit and the total package. What is the budget for this role?" If pressed, give a range where your minimum is your actual target.')
    +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:20px 0 10px">Script for a salary review conversation with your manager</div>'
    +reqTable([
      ['Opening','I wanted to have a conversation about my compensation. I have been here for [X months/years] and in that time I have [specific achievement with a metric]. I have also taken on [specific expanded responsibilities]. I would like to discuss aligning my salary to reflect that.'],
      ['When asked "what number are you thinking?"','Based on my research of the market for this role and my experience level, I am targeting [X to Y LPA]. I arrived at this from [Glassdoor / LinkedIn Salary / iimjobs market data]. Is that in the range the company can work with?'],
      ['When they say "we cannot do that right now"','I understand. Can we agree on a specific target and a specific timeline? I would like to know exactly what I need to demonstrate and by when to make this happen. If we cannot reach [X] in [timeframe], I will need to reassess my options.'],
      ['When they say "the budget is fixed"','I appreciate the transparency. Are there other components we can look at  -  variable pay, a one-time performance bonus, additional leave, or a faster review cycle? I want to find a way to make this work.'],
    ],false)
    +infoBox('amber','When to walk away','If after a structured conversation you cannot reach within 15% of your market rate, the company is telling you something. Internal salary corrections almost never reach market rate in one cycle. The most reliable salary increase for most professionals is a company change. Your action plan addresses this directly.')
  );
}

/* ═══════════════════════════════════════════════════════════
   SETTLE IN INDIA REPORT — 8-page comprehensive document
   For: NRIs returning, expats from any country settling in India,
   professionals relocating to India for career/family/lifestyle.
   Covers: salary parity, career choices, market reality, cities,
   tax implications, upskilling, job search strategy.
═══════════════════════════════════════════════════════════ */



/* ═══════════════════════════════════════════════════════
   SETTLE IN INDIA — COMPREHENSIVE REPORT
   Context-aware across: citizenship status, qualification
   type, source country, field, and years of experience.
═══════════════════════════════════════════════════════ */
function buildSettleInIndiaReport(fn,fieldDisplay,from,qual,exp,expYrs,r){
  var fromDisplay={'uk':'United Kingdom','usa':'United States','uae':'UAE',
    'canada':'Canada','australia':'Australia','germany':'Germany',
    'singapore':'Singapore','new-zealand':'New Zealand','ireland':'Ireland',
    'netherlands':'Netherlands','gulf-other':'Gulf region','india':'India'}[from]||from||'abroad';

  /* Read new answers */
  var citizenship = A['india-citizenship']||'nri-returning';
  var mastersType = A['masters-type']||'';
  var isIndianCitizen = citizenship==='indian-citizen'||citizenship==='nri-returning';
  var isOCI         = citizenship==='oci-holder'||citizenship==='pio';
  var isForeignNat  = citizenship==='foreign-national';

  /* Qualification label — specific to what was answered */
  var qualLabel = {
    'mba':'MBA','ms-tech':'MS / M.Tech','ms-finance':'Masters in Finance / Economics',
    'ma-social':'MA (Humanities / Policy / Law)','msc-science':'MSc (Sciences)',
    'mpa-mpp':'MPA / MPP','med-clinical':'Postgraduate clinical qualification',
    'mba-exec':'Executive MBA'
  }[mastersType]||getQualDisplay(qual);

  /* ── SECTION 2: SALARY PARITY ── */
  var parityData={
    'uk':{note:'A £65,000 role in London earns ₹66 LPA gross. After UK income tax (20–40%) and National Insurance, take-home is roughly £44,000 (₹45 LPA equivalent). London rent of £1,800–2,500/month takes another 25–35% of net income. A comparable senior role in Bangalore at ₹45–70 LPA, with rent of ₹25,000–50,000/month, sits within 15–35% of real purchasing power. The gap is real — but it is not the 2–3x the gross figures suggest.'},
    'usa':{note:'A $180,000 role in San Francisco earns ₹150 LPA gross. US federal and California state tax takes 38–45%, leaving ~$105,000 net. Rent in SF/NYC/Seattle runs $3,000–5,000/month — consuming 35–50% of net income. A senior India role at ₹70–100 LPA in Bangalore or Mumbai, with rent of ₹30,000–70,000/month, often delivers comparable real purchasing power for most lifestyle categories except international travel and certain imports.'},
    'uae':{note:'UAE salaries are entirely tax-free — AED 30,000/month (≈₹80 LPA/year) is fully take-home. No income tax, no NI, no pension deduction. This is a genuine advantage. However, there is no employer pension contribution, no social security, and no PR pathway for most expats. A ₹60–80 LPA India role carries social security (EPF), health benefits, and long-term career roots — factors worth pricing into the comparison.'},
    'canada':{note:'CAD 130,000 in Toronto becomes roughly CAD 88,000 after federal and Ontario provincial tax. Toronto rent of CAD 2,200–3,200/month takes another 30–40% of net. A comparable senior India role at ₹55–80 LPA sits within 20–40% of real purchasing power. The gap is narrower than the gross figure implies — and the India lifestyle quality at that income level, particularly outside Mumbai, is objectively strong.'},
    'australia':{note:'AUD 140,000 in Sydney becomes roughly AUD 97,000 after 32% tax. Sydney rent of AUD 2,500–4,000/month consumes 30–45% of net. A comparable India role at ₹55–75 LPA, particularly in Bangalore or Hyderabad, is within 15–30% on real purchasing power. For families with school-age children, India\'s private schooling costs are significantly lower — a meaningful offset.'},
    'germany':{note:'EUR 80,000 in Munich becomes roughly EUR 47,000 after 41% combined income and social security deductions. Munich rent of EUR 1,500–2,500/month takes another 30–40% of net. A comparable India role at ₹45–70 LPA at a similar company type comes within 10–20% of real purchasing power. Germany\'s social security benefits (unemployment, healthcare, pension) are significant — factor these in as non-salary income.'},
    'singapore':{note:'SGD 120,000 in Singapore becomes roughly SGD 95,000 after CPF deductions and 17–22% tax. Singapore rent of SGD 3,000–5,500/month (for a 3-room flat) consumes 35–60% of net income — extremely high. A comparable India senior role at ₹55–75 LPA in Bangalore or Mumbai delivers better absolute quality of life for most spending categories. The Singapore premium is real for savings rate, not necessarily lifestyle.'}
  };
  var pd=parityData[from]||{note:'International salaries in gross terms are typically 1.5–3x India equivalents. After income tax (35–48% in most Western countries vs 10–30% in India), cost of living, and purchasing power, the real gap is 20–60% — significant but not as extreme as gross figures suggest.'};

  var parityHtml='<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px 22px;margin-bottom:16px">'
    +'<div style="font-size:11px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">'+fromDisplay+' vs India: Salary Reality Check</div>'
    +'<p style="font-size:13.5px;color:#334155;line-height:1.75;margin-bottom:14px">'+pd.note+'</p>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">'
    +'<div style="background:#f8fafc;border-radius:7px;padding:12px;text-align:center"><div style="font-size:11px;color:#64748b;margin-bottom:4px">Gross salary gap</div><div style="font-size:18px;font-weight:800;color:#0A2E73">2-3x</div><div style="font-size:11px;color:#64748b">'+fromDisplay+' vs India gross</div></div>'
    +'<div style="background:#f0fdf4;border-radius:7px;padding:12px;text-align:center"><div style="font-size:11px;color:#64748b;margin-bottom:4px">After tax gap</div><div style="font-size:18px;font-weight:800;color:#16a34a">Smaller</div><div style="font-size:11px;color:#64748b">Taxes close the gap</div></div>'
    +'<div style="background:#eff6ff;border-radius:7px;padding:12px;text-align:center"><div style="font-size:11px;color:#64748b;margin-bottom:4px">Purchasing power gap</div><div style="font-size:18px;font-weight:800;color:#2563eb">10-60%</div><div style="font-size:11px;color:#64748b">Cost of living adjusted</div></div>'
    +'</div></div>';

  /* ── SECTION 3: QUALIFICATION + ROLE ANALYSIS ── */
  /* This is the key improvement — specific to what they studied */
  var roleAnalysis;
  var f=A.field||'business-pm';

  var mbaRoles=function(){return reqTable([
    ['Consulting (McKinsey/BCG/Bain India)','Associate level direct entry for top-20 global MBA. Application window: September–November. Compensation: ₹30–50 LPA base + bonus. Requirement: MBA from target school + case interview preparation (6–8 weeks intensive).'],
    ['Private Equity / Venture Capital','Associate to VP depending on prior experience. India PE/VC is actively hiring returned MBAs from global funds. Target: Sequoia India (now Peak XV), Lightspeed India, Accel India, General Catalyst India. Compensation: ₹40–80 LPA + carry.'],
    ['MNC India leadership','JP Morgan India, Goldman Sachs India, Unilever India, P&G India, McKinsey India, BCG India, Bain India, Deloitte India — all have structured return-to-India hiring for MBAs from target schools. Roles: Associate Director, Principal, Senior Manager.'],
    ['Growth-stage startup (Series B+)','VP Strategy, Chief of Staff, Head of Business — roles that need international exposure and strategic thinking. Compensation: ₹35–70 LPA + meaningful ESOP. Best boards: Jungle Ventures, Kalaari, Matrix, Bessemer India.'],
    ['Corporate strategy / M&A','Large Indian conglomerates (Tata, Reliance, Mahindra) and banks (HDFC, ICICI, Kotak) run structured M&A and strategy teams that hire international MBAs. Compensation: ₹25–45 LPA — below startup track but with stability and brand.'],
  ],false);};

  var msTechRoles=function(){return reqTable([
    ['FAANG India (direct)','Google, Amazon, Microsoft, Apple India all run India engineering centres. With international FAANG or tier-1 tech experience, direct Staff/Senior SWE or L5/L6 equivalent entry is realistic. Compensation: ₹60–150 LPA total (base + RSU). Prep: system design + DSA to LeetCode Hard.'],
    ['Engineering Manager / Director','For '+expYrs+'+ years experience, EM track is the highest-paying non-FAANG India path. Unicorns (Razorpay, CRED, Swiggy, Meesho) hire returning EMs at ₹50–100 LPA.'],
    ['Deep tech / AI startup (founding team)','ML/GenAI, quantum, semiconductor, climate tech startups in Bangalore are actively raising Series A/B and hiring international MS holders for founding and early engineering team roles. Equity can be 0.1–1% at this stage.'],
    ['Research labs','Google Research India, Microsoft Research India, Samsung Research India, TCS Research — all require MS/PhD. Compensation: ₹40–90 LPA. Work is publishable and high-quality.'],
    ['IIT/IISc research or visiting roles','For those interested in academia alongside industry: most major IITs now have visiting faculty and industry-affiliate programmes. Not a primary income source but strong for network and brand.'],
  ],false);};

  var msFinanceRoles=function(){return reqTable([
    ['Investment banking (bulge bracket India)','Goldman Sachs, JP Morgan, Morgan Stanley, Barclays, Deutsche Bank India — all hire returned MFin/MFE/CFA holders for Analyst to Associate level. Compensation: ₹18–45 LPA base + bonus.'],
    ['Asset management / Wealth management','HDFC AMC, SBI Mutual Fund, Motilal Oswal, Mirae Asset India — growing AUM with significant hiring at portfolio manager and research analyst level. CFA charter is strongly preferred.'],
    ['Fintech (Zerodha, Groww, Razorpay, PhonePe)','Finance roles at fintech companies pay 30–50% above traditional banking for equivalent levels. Compensation: ₹25–60 LPA + ESOP.'],
    ['CFO track at Series B+ startup','For '+expYrs+'+ years experience: VP Finance or CFO at a growth-stage company. This is the fastest path to senior finance leadership in India. Compensation: ₹35–70 LPA + significant ESOP.'],
  ],false);};

  var clinicalRoles=function(){return reqTable([
    ['Senior Specialist / Consultant','Apollo, Fortis, Manipal, Max Healthcare, Narayana Health — all actively hire returning specialists. International clinical experience (NHS, US hospital system, Australian healthcare) adds 40–60% premium over India market rate. Compensation: ₹25–80 LPA depending on specialisation.'],
    ['Private practice','India\'s private healthcare market is growing at 15%+ annually. Specialists with international training have strong independent practice potential, particularly in metros. Setup cost: ₹10–50 lakh depending on specialisation and clinic model.'],
    ['Medical device / Pharma clinical roles','Johnson & Johnson India, Abbott India, Medtronic India, Sun Pharma, Dr Reddy\'s — clinical roles at the intersection of medicine and industry. Compensation: ₹18–45 LPA.'],
    ['Medical education','Faculty roles at AIIMS, JIPMER, or major private medical colleges for those with postgraduate qualifications and research publications. Compensation: ₹12–30 LPA + housing allowance.'],
  ],false);};

  /* Route to correct role analysis based on what they studied */
  if(mastersType==='mba'||mastersType==='mba-exec'){
    roleAnalysis='<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:12px">Career pathways in India for MBA graduates</div>'+mbaRoles();
  } else if(mastersType==='ms-tech'){
    roleAnalysis='<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:12px">Career pathways in India for MS / M.Tech graduates</div>'+msTechRoles();
  } else if(mastersType==='ms-finance'){
    roleAnalysis='<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:12px">Career pathways in India for Finance Masters / CFA graduates</div>'+msFinanceRoles();
  } else if(mastersType==='med-clinical'){
    roleAnalysis='<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:12px">Career pathways in India for clinical postgraduate specialists</div>'+clinicalRoles();
  } else {
    /* No mastersType selected or Bachelors/PhD — use field-specific advice */
    roleAnalysis=infoBox('navy','Career pathways for '+fieldDisplay+' professionals in India',
      expYrs>=8
        ?fn+', at '+expYrs+' years and with international experience in '+fieldDisplay+', your India profile is senior. The strongest roles are: Director/VP at product companies or unicorns (₹70–130 LPA), leadership hire at MNC India office (₹50–100 LPA), or strategic advisor/consultant to growth-stage startups. The India market will not require you to start over — but you will need to demonstrate India-market relevance quickly in your first 90 days.'
        :fn+', at '+expYrs+' years in '+fieldDisplay+' with international experience, your India profile is mid-to-senior. Target: Senior Manager at product company or MNC India (₹35–70 LPA), early employee or team lead at funded startup (₹30–65 LPA + ESOP). Your international experience is a differentiator — use it to apply one level above where you would start without it.'
    );
  }

  /* ── SECTION 4: DOCUMENTS AND ADMIN ── */
  var relocRows;
  if(isIndianCitizen){
    relocRows=[
      ['Indian passport validity','Check your Indian passport expiry before returning. If expiring within 12 months, renew at Indian High Commission before leaving. Renewal takes 4–6 weeks.'],
      ['NRE/NRO account management','Your NRE account balance can be freely repatriated while you are an NRI. Once you establish Indian tax residency (182+ days in a financial year), this changes. Repatriate what you need BEFORE crossing the 182-day threshold. Consult a CA who specialises in NRI taxation before your return date.'],
      ['DTAA — avoid double taxation','India has tax treaties (DTAA) with the UK, USA, Canada, Australia, Germany, and Singapore. Income earned abroad before your return is typically not taxable in India. Get professional advice to ensure you are not paying tax twice. The key is establishing when your tax residency shifts — this is not automatic.'],
      ['EPF/PF from previous Indian employment','If you had an Indian employer before leaving, check your PF balance on the EPFO portal (epfindia.gov.in). Options: withdraw (subject to tax if under 5 years of service), keep invested (earns 8.1% annual interest), or transfer to new employer when you join.'],
      ['Health insurance','Your employer health plan abroad ends on your last day. India\'s top hospitals accept all major insurers. Take out individual/family health insurance BEFORE you fly: Star Health, Niva Bupa, or HDFC ERGO. Minimum ₹10 lakh cover. Apollo, Fortis, and Manipal have international patient services for those transitioning.'],
      ['Aadhaar and PAN','Update your Aadhaar address at any Aadhaar Seva Kendra within 30 days of establishing your India address. PAN is required for all salary above ₹2.5 LPA — check yours is active at the Income Tax e-filing portal.'],
    ];
  } else if(isOCI){
    relocRows=[
      ['OCI card validity','OCI cards issued before January 2015 need to be reissued once (now done). If your OCI is valid, you can live and work in India without any visa or registration requirement. No employment restrictions.'],
      ['PAN Card','Mandatory for all salary earners and investors in India. Apply at NSDL or UTIITSL if you do not have one. Needed for bank accounts, investments, and employer payroll.'],
      ['NRO bank account','As an OCI holder, open an NRO account for Indian salary and income, and an NRE account for foreign remittances. HDFC, ICICI, and SBI all have OCI account services.'],
      ['Tax residency','OCI holders who spend 182+ days in India in a financial year become Indian tax residents and are taxed on global income. Plan your return date to manage which financial year you first become resident.'],
      ['Health insurance','Same as Indian citizens — international employer plan ends on departure. Take out Indian coverage before arrival.'],
    ];
  } else {
    /* Foreign national */
    relocRows=[
      ['Employment Visa','Required for all paid work in India. Must be applied for BEFORE arriving in India. Requirements: confirmed job offer from Indian employer, minimum salary of USD 25,000/year (or equivalent), employer must be a registered Indian entity. Processing at Indian High Commission: 4–8 weeks.'],
      ['FRRO Registration','Foreign nationals on employment visa must register with the Foreigners Regional Registration Office (FRRO) within 14 days of arrival. Done online at indianfrro.gov.in.'],
      ['PAN Card','Apply at NSDL with passport, visa, and Indian address proof. Required for payroll, bank accounts, and tax filing.'],
      ['NRO Bank Account','As a foreign national, you can open an NRO account with passport and visa documentation. Needed for salary receipt and Indian financial transactions.'],
      ['Health insurance','International employer plan ends on departure. Indian health insurance is available to foreign nationals resident in India. Star Health, Niva Bupa, and HDFC ERGO all cover foreign nationals on employment visa.'],
      ['Housing','Expat-friendly areas: Bangalore (Koramangala, Indiranagar, Whitefield), Mumbai (Bandra, Powai), Gurgaon (Golf Course Road, DLF Cyber City), Hyderabad (Banjara Hills, Jubilee Hills). Furnished rentals are available and practical for the first 3–6 months.'],
    ];
  }

  /* ── SECTION 5: CITY GUIDE ── */
  var cityHtml='<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:700px">'
    +'<thead><tr style="background:#0A2E73"><th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left">City</th><th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left">Best sectors</th><th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left">Salary vs national</th><th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left">Living cost/month</th><th style="padding:10px 14px;color:#fff;font-weight:700;text-align:left">Honest note</th></tr></thead><tbody>'
    +[
      {c:'Bangalore',b:'Tech, PM, AI/ML, SaaS, design, biotech',s:'+15–25% above national median for tech',l:'Rent ₹25–75K. Total ₹60–150K',n:'India\'s strongest tech job market. Best international returnee community. Traffic and infrastructure are genuine challenges.'},
      {c:'Mumbai',b:'Finance, BFSI, consulting, FMCG, media, MNCs',s:'+10–20% for finance. Best finance salaries nationally',l:'Rent ₹30–90K. Total ₹80–200K (India\'s most expensive)',n:'Financial capital. Best for MBA roles, banking, PE/VC. Long commutes but strong professional network density.'},
      {c:'Gurgaon / NCR',b:'MNC India offices, consulting, e-commerce, BFSI',s:'+5–15% above national median',l:'Rent ₹20–60K. Total ₹50–120K',n:'Most MNC India headquarters. Close to Delhi airport. Air quality October–February is a significant health factor.'},
      {c:'Hyderabad',b:'Tech, pharma, cloud, biotech, gaming',s:'Near median — 5–10% below Bangalore for tech',l:'Rent ₹15–45K. Total ₹40–90K',n:'Fastest-growing major tech market. Google, Microsoft, Amazon campuses. Noticeably lower cost of living than Bangalore.'},
      {c:'Pune',b:'Manufacturing, automotive, IT services, engineering',s:'10–15% below Bangalore for tech',l:'Rent ₹12–40K. Total ₹35–80K',n:'Strong for engineering, manufacturing, and EV sector. Growing startup scene. 3 hours from Mumbai.'},
    ].map(function(c,i){
      return '<tr style="background:'+(i%2===0?'#f8fafc':'#fff')+';border-bottom:1px solid #e2e8f0">'
        +'<td style="padding:10px 14px;font-weight:700;color:#0A2E73">'+c.c+'</td>'
        +'<td style="padding:10px 14px;color:#334155">'+c.b+'</td>'
        +'<td style="padding:10px 14px;color:#16a34a;font-weight:600">'+c.s+'</td>'
        +'<td style="padding:10px 14px;color:#b45309">'+c.l+'</td>'
        +'<td style="padding:10px 14px;color:#475569;font-style:italic">'+c.n+'</td>'
        +'</tr>';
    }).join('')+'</tbody></table></div>';

  /* ── SECTION 6: JOB SEARCH — Tutorment as the service provider ── */
  var jobSearchHtml=infoBox('navy','How The Tutorment helps you land the right India role',
    'The Tutorment manages your India job search end-to-end. This includes: (1) positioning your international experience correctly for India employers — the framing matters as much as the credentials; (2) applying to 20–30 tailored roles per month on your behalf across LinkedIn, iimjobs, Naukri, Cutshort, and direct company portals; (3) weekly tracking and status updates so you always know exactly where each application stands; (4) CV and LinkedIn profile optimisation specifically for the India market; (5) interview preparation with practitioners currently working in your target role in India. Book your first session at thetutorment.com.')
  +infoBox('teal','How to position your '+fromDisplay+' experience for India employers',
    'Two specific changes to your CV and LinkedIn: (1) Translate scale — "served 2 million UK customers" is stronger than "managed product roadmap". India employers want to see what scale you operated at, because they are building for India\'s 1.4 billion user base and want people who have done it at scale. (2) Add India context — "applying this to India\'s growing fintech market" or "relevant to Razorpay\'s payment infrastructure challenges" in your summary shows you have thought about the India application of your work, not just your international credentials.')
  +'<div style="font-size:14px;font-weight:700;color:#0f172a;margin:20px 0 10px">Where to search in parallel</div>'
  +reqTable([
    ['LinkedIn India','Update location to your specific target city now — not "Open to Relocation". This puts you in local recruiter searches immediately. Turn on "Open to Work" visible to recruiters only.'],
    ['iimjobs.com','India\'s strongest platform for management, product, strategy, and senior professional roles. Free to apply. Strong in Bangalore and Mumbai.'],
    ['Naukri.com','Largest job board by volume. Set up role and city alerts. Best for senior roles at larger companies.'],
    ['Cutshort.io','Best for startup and product roles. Strong Bangalore and Hyderabad inventory.'],
    ['Direct company applications','For your top 10 target companies: find the hiring manager or CHRO on LinkedIn and send a direct note. At senior level, this converts at 3–4x the rate of job board applications.'],
  ],false);

  /* ── SECTION 7: ACTION PLAN ── */
  var actionHtml=[
    {period:'Before you leave '+fromDisplay, actions:[
      isIndianCitizen?'Check Indian passport validity. Renew at Indian High Commission if expiring within 12 months.':
        isOCI?'Confirm OCI card is valid and up to date before departure.':
        'Apply for Employment Visa at Indian High Commission. You need a confirmed job offer before applying.',
      'Start your India job search now — not when you arrive. Indian employers move fast when interested and slow when the candidate is "still deciding". Being in active conversation before you land removes the biggest objection.',
      isIndianCitizen?'Manage NRE account timing. Understand the 182-day tax residency trigger. Consult a CA on DTAA if you have income from both countries in the transition year.':
        'Open an NRO bank account remotely with your target Indian bank. HDFC and ICICI both allow account opening for OCI/employment visa holders before arrival.',
      'Update LinkedIn location to your specific target city. Connect with 30–50 professionals in your target role in that city. Message 10 of them with a specific, brief note about your return.',
    ]},
    {period:'Week 1–2 in India', actions:[
      'Register with The Tutorment. In your first session: review your CV for India market positioning, identify your top 15 target companies, and agree your application strategy. The Tutorment begins applications on your behalf from Week 2.',
      isIndianCitizen?'Update Aadhaar address and verify PAN is active at the IT e-filing portal.':
        isForeignNat?'Complete FRRO registration within 14 days of arrival. Then PAN and NRO bank account.':
        'Update Aadhaar address (if previously registered) and verify PAN.',
      'Attend one in-person professional event, meetup, or alumni gathering in your city in your first week. LinkedIn connections from in-person meetings convert to referrals at 3–4x the rate of cold outreach.',
      'Take out health insurance before or immediately on arrival. Do not rely on travel insurance beyond the first week.',
    ]},
    {period:'Month 1–2', actions:[
      'The India hiring cycle is typically 6–10 weeks from first interview to offer. If you have no first-round interviews after 3 weeks of active applications, your CV or application strategy needs to change — this is the trigger for a The Tutorment recalibration session.',
      'In every first conversation (recruiter, interviewer, referral): ask for 2–3 names of other people in similar roles at other companies. India hiring is relationship-dense. One strong contact generates 3–4 others.',
      (mastersType==='mba'?'For MBA consulting applications (McKinsey/BCG/Bain): case interview preparation takes 6–8 weeks of focused practice. Start this before you arrive, not after. The Tutorment connects you with practitioners who have been through the India consulting interview process.':
        mastersType==='ms-tech'?'For FAANG India applications: system design and DSA preparation takes 4–8 weeks. LeetCode Medium/Hard level required. The Tutorment connects you with engineers currently at FAANG India who have recently been through the interview loop.':
        'Ask your The Tutorment counsellor to connect you with someone currently in your target role at your target company. This is the most valuable single action in your India job search.'),
    ]},
    {period:'On receiving an offer', actions:[
      'First offer is rarely final. In India: asking "Is there flexibility on the base?" or "Can we revisit the joining bonus?" is standard and expected. The Tutorment advises on the specific negotiation for your role and company type.',
      'Do not resign from your current role abroad until the India offer is confirmed in writing with a start date. For Indian citizens, this means the formal offer letter — not a verbal commitment.',
      'Give yourself a 6–12 month perspective window before comparing your India income to what you earned abroad. The first India role is a platform for the next 3–5 years, not a final number.',
    ]},
  ].map(function(phase){
    return '<div style="margin-bottom:20px">'
      +'<div style="font-size:12px;font-weight:800;color:#0A2E73;text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">'+phase.period+'</div>'
      +'<ul style="margin:0;padding-left:0;list-style:none">'
      +phase.actions.map(function(a){
        return '<li style="font-size:13.5px;color:#334155;line-height:1.72;padding:9px 0 9px 20px;border-bottom:1px solid #f1f5f9;position:relative">'
          +'<span style="position:absolute;left:0;top:13px;width:8px;height:8px;background:#00B3A4;border-radius:50%;display:block"></span>'
          +a+'</li>';
      }).join('')+'</ul></div>';
  }).join('');

  /* ── ASSEMBLE ── */
  return page('position',
      sectionHead('Section 2: Salary Parity — What the Numbers Actually Mean',
        fn+', the gross gap is real but the purchasing power gap is much smaller','#059669')
      +parityHtml
      +infoBox('amber','The comparison that matters',
        'Compare net take-home minus cost of living — not gross salary. A $180,000 San Francisco salary with $4,000/month rent and 42% tax leaves roughly $5,500/month spendable. A ₹80 LPA Bangalore salary with ₹50,000/month rent and 20% tax leaves roughly ₹4,50,000/month spendable. The gap is real — roughly 20% — but it is not the 3x the headlines suggest.')
    )
  +page('skills',
      sectionHead('Section 3: Your Qualification and Career Options in India',
        fn+', here is what your '+qualLabel+' from '+fromDisplay+' specifically opens for you','#0A2E73')
      +roleAnalysis
    )
  +page('pathway',
      sectionHead('Section 4: Documents and Administration',
        isIndianCitizen?'Key financial and legal steps for Indian citizens returning from abroad':
        isOCI?'Key steps for OCI card holders settling in India':
        'Key legal and financial steps for foreign nationals working in India','#7c3aed')
      +reqTable(relocRows,false)
    )
  +page('position',
      sectionHead('Section 5: City Guide — Where to Base Yourself',
        'Salary premiums, cost of living, and job depth by city for '+fieldDisplay,'#b45309')
      +cityHtml
    )
  +page('skills',
      sectionHead('Section 6: Finding the Right Role',
        'How The Tutorment manages your India job search, and what you do in parallel','#0d9488')
      +jobSearchHtml
    )
  +page('pathway',
      sectionHead('Section 7: Action Plan',
        fn+', here is the sequenced plan — what to do, in what order, and why the sequence matters','#0A2E73')
      +actionHtml
    );
}

