/* ── THETUTORMENT OFFICIAL AI ASSISTANT SYSTEM ── */
(function(){
  if (document.getElementById('tt-chatbot-container')) return;

  var KB = [
    {
      keys: ['about', 'tutorment', 'who are you', 'what is tutorment', 'founders', 'team', 'company', 'why tutorment', 'overview'],
      answer: 'Welcome to **TheTutorment** (thetutorment.com)! We are a premier professional career counselling, academic mentorship, and global mobility platform.\n\n• **International Wing**: UK HCPC & NMC registrations, GMC PLAB guidance, Skilled Worker visa-sponsored jobs, QTS teaching, funded PhDs, & university admissions.\n• **India Wing**: Campus placement prep for Tier-2/Tier-3 colleges, 1-to-1 professional upskilling, resume overhauls, and salary package enhancement.\n\nWould you like to explore a specific pathway, or book a free 1-to-1 diagnostic call on **thetutorment.com**?'
    },
    {
      keys: ['hcpc', 'physio', 'physiotherapist', 'occupational', 'radiographer', 'dietitian', 'podiatrist', 'paramedic', 'speech', 'prosthetist', 'operating department', 'arts therapist', 'biomedical scientist', 'clinical scientist', 'allied health', 'chiropodist', 'hearing aid'],
      answer: 'Our **HCPC Registration Guidance** is a dedicated 1-to-1 service for internationally trained health professionals:\n\n• **15 Professions Covered**: Physiotherapy, Occupational Therapy, Diagnostic & Therapeutic Radiography, Speech & Language Therapy, Paramedics, Dietetics, Podiatry, Biomedical Science, Clinical Science, Arts Therapy, ODP, etc.\n• **100% Audit Precision**: Every syllabus module, clinical log, & reference letter is verified before submission.\n• **NHS Placement**: Following HCPC registration, we support your UK NHS Skilled Worker visa job search.\n• **Timeline**: 8 to 16 weeks.\n\nWhat is your health profession and total years of clinical experience?'
    },
    {
      keys: ['nmc', 'nurse', 'nursing', 'midwife', 'midwives', 'nursing associate', 'cbt', 'osce', 'oet', 'ielts nurse'],
      answer: 'Our **NMC Registration Guidance** helps overseas nurses and midwives register with the UK Nursing and Midwifery Council:\n\n• **Eligibility Verification**: Complete audit of overseas nursing credentials.\n• **CBT & OSCE Coaching**: Comprehensive exam strategies & practical simulation preparation.\n• **Language Support**: OET (Grade B) & IELTS (7.0) guidance.\n• **NHS Band 5 Jobs**: Direct routing to NHS Trusts providing visa sponsorship.\n\nAre you currently preparing for IELTS/OET or the CBT exam?'
    },
    {
      keys: ['sqe', 'sqe1', 'sqe2', 'sra', 'solicitor', 'lawyer', 'qwe', 'law', 'legal', 'qualifying work experience', 'roll of solicitors'],
      answer: 'Our **SQE Registration & Solicitor Pathway Guidance** supports legal professionals becoming solicitors in England and Wales:\n\n• **SRA Eligibility & MySRA Mapping**: Complete check of SRA degree and suitability requirements.\n• **SQE1 & SQE2 Prep**: Functioning Legal Knowledge (FLK) & practical legal skills assessment guidance.\n• **QWE Confirmation**: Guidance on fulfilling and signing off two years of Qualifying Work Experience (QWE).\n• **Roll of Solicitors Admission**: Final application support for SRA admission.\n\nAre you looking to prepare for SQE1, SQE2, or document your Qualifying Work Experience (QWE)?'
    },
    {
      keys: ['gmc', 'plab', 'doctor', 'physician', 'medical doctor', 'epic', 'nhs doctor'],
      answer: 'Our **GMC Registration & PLAB Guidance** supports international medical graduates (IMGs):\n\n• **Primary Source Verification**: EPIC verification & GMC online account mapping.\n• **PLAB 1 & 2 Strategy**: Exam guidance & clinical scenario preparation.\n• **NHS Doctor Placement**: CV tailoring for NHS FY2/ST1/ST2 medical posts.\n\nHave you completed PLAB 1 or IELTS/OET?'
    },
    {
      keys: ['sponsored', 'job', 'visa', 'tier 2', 'skilled worker', 'cos', 'nhs job', 'uk job', 'work permit', 'relocate uk', 'sponsor', 'sponsor licence', 'done for you'],
      answer: 'We provide **Done-For-You UK Job Application & Visa Sponsorship Support**:\n\n• **30 to 50 Applications / Month**: Submitted directly on your behalf to UK employers on the official Home Office Sponsor Register.\n• **UK ATS Resume & Cover Letters**: Custom tailored for each vacancy.\n• **Sectors**: Healthcare (NHS/Private), Software Engineering, IT, Finance, Engineering, & Education.\n• **Weekly Reports & Mock Calls**: Full application pipeline tracking & interview prep.\n\nWhat is your primary field and target timeline for relocating to the UK?'
    },
    {
      keys: ['teach', 'teacher', 'qts', 'iqts', 'assessment only', 'pgce', 'teaching uk', 'education uk', 'school uk'],
      answer: 'We guide internationally trained teachers to achieve **UK Qualified Teacher Status (QTS)**:\n\n• **Assessment Only (AO) Route**: Qualify in 12 weeks without retraining if you have 2+ years classroom experience.\n• **iQTS Programme**: Train internationally while working.\n• **Evidence Mapping**: Aligning your lesson plans & teaching history against UK Teachers\' Standards.\n• **School Outreach**: Direct guidance for UK state-maintained school jobs.\n\nHow many years of formal classroom teaching experience do you have?'
    },
    {
      keys: ['phd', 'scholarship', 'research', 'proposal', 'funding', 'funded', 'chevening', 'gates', 'rhodes', 'commonwealth', 'fulbright', 'ukri', 'supervisor', 'fellowship'],
      answer: 'Our **Funded PhD & Global Scholarship Mentorship** boasts a **68% candidate success rate**:\n\n• **Research Proposal Strategy**: Formulating genuine research gaps, methodology, and literature reviews.\n• **Supervisor Outreach**: Identifying & cold-emailing UK, European, US, & Australian university professors.\n• **Scholarship Applications**: End-to-end essay writing for Chevening, Commonwealth, UKRI, GREAT, & Fulbright funding.\n\nWhat field of research are you planning to pursue?'
    },
    {
      keys: ['upskill', 'course', 'full stack', 'python', 'mern', 'data science', 'ai', 'cloud', 'devops', 'aws', 'azure', 'product management', 'ui ux', 'digital marketing', 'finance', 'upskilling'],
      answer: 'Our **1-to-1 Professional Upskilling Courses** are taught live by active industry practitioners (no recorded videos):\n\n• **Full Stack Development**: Python, MERN, Java, System Design.\n• **Data Science & AI**: Python, Data Engineering, Machine Learning.\n• **Cloud Computing & DevOps**: AWS, Azure, Docker, Kubernetes.\n• **Product Management**: Agile/Scrum, Product Strategy.\n• **UI/UX Design**: Figma, User Research, Interface Design.\n• **Digital Marketing & Growth**: SEO, Performance Marketing.\n• **Corporate Finance**: Financial Modeling, Valuation.\n\nWhich course would you like to master 1-to-1 with a mentor?'
    },
    {
      keys: ['placement', 'tier 2', 'tier 3', 'college', 'campus', 'fresher', 'btech', 'bca', 'mca', 'mba', 'off campus', 'product company', 'entry level'],
      answer: 'Our **India Wing Campus Placement Programme** is built for students from Tier-2 and Tier-3 colleges in India:\n\n• **12-Week Intensive Program**: Mentorship by senior engineers & product managers from top tech firms.\n• **DSA, System Design & Aptitude**: Live technical drilling & HR mock interviews.\n• **Off-Campus Referrals**: Direct referrals to companies in Bangalore, Pune, Hyderabad, Gurgaon, & Noida.\n\nWhat degree are you pursuing and what is your graduation year?'
    },
    {
      keys: ['salary', 'hike', 'increment', 'switch', 'ctc', 'lpa', 'working professional', 'package', 'appraisal', 'negotiate', 'raise'],
      answer: 'Our **Salary Package Enhancement & Negotiation Programme** helps working professionals jump CTC brackets:\n\n• **Skill Gap Diagnosis**: Identifying high-paying skill gaps in your profile.\n• **Targeted 6-10 Week Upskilling**: 1-to-1 mentorship with active practitioners.\n• **CTC Benchmarking**: Repositioning your profile for top 10% market pay.\n• **Negotiation Coaching**: Proven strategies to negotiate **40% to 80% CTC hikes**.\n\nWhat is your current domain and target salary jump?'
    },
    {
      keys: ['psw', 'post study', 'graduate route', 'graduate visa', 'stay back'],
      answer: 'Our **Post Study Work (PSW) & Graduate Route Support**:\n\n• **2-Year Stay Back UK**: Guidance on maximizing your 2-year Graduate Route visa (3 years for PhDs).\n• **Skilled Worker Transition**: Structuring your job applications to transition from Graduate Visa to Tier 2 Sponsorship before your visa expires.\n\nAre you currently studying in the UK or preparing to graduate?'
    },
    {
      keys: ['study abroad', 'university', 'admission', 'masters', 'msc', 'mba', 'bachelor', 'canada', 'australia', 'ireland', 'usa', 'germany', 'singapore', 'sop', 'lor'],
      answer: 'Our **Global University Admissions Service** covers top destinations (UK, USA, Canada, Australia, Ireland, Germany, Singapore):\n\n• **SOP & LOR Writing**: Drafting compelling Statements of Purpose & Recommendation letters.\n• **Scholarship Negotiation**: Built-in scholarship applications *before* accepting offer letters.\n• **Visa & Financial Guidance**: End-to-end student visa file preparation.\n\nWhich country and intake year are you targeting?'
    },
    {
      keys: ['tool', 'calculator', 'salary calculator', 'eligibility', 'check eligibility', 'tax', 'take home'],
      answer: 'We offer interactive self-service tools on **thetutorment.com**:\n\n• **Salary Calculator** (`pages/salary-calculator.html`): Calculate net take-home pay, UK tax, and NHS salary bands.\n• **Eligibility Checker** (`pages/eligibility.html`): Interactive diagnostic report for UK/Global career readiness.\n• **Global Guide** (`pages/global-guide.html`): Detailed visa policies for UK, US, CA, AU, & EU.\n\nWould you like to try our free Eligibility Diagnostic tool?'
    },
    {
      keys: ['cost', 'fee', 'pricing', 'price', 'charge', 'free', 'paid', 'how much', 'guarantee', 'refund'],
      answer: 'At **TheTutorment** (thetutorment.com):\n\n• **100% Free 1-to-1 Diagnostic Call**: 20-minute profile evaluation with a senior mentor. No credit card required.\n• **Custom Program Structure**: Because every candidate\'s qualifications, target country, and background differ, customized pricing is provided after your diagnostic call.\n• **Zero Fake Guarantees**: We provide honest roadmaps and execute alongside you until your outcome is achieved.\n\nWould you like to schedule your free diagnostic session today?'
    },
    {
      keys: ['contact', 'phone', 'whatsapp', 'email', 'office', 'address', 'location', 'jaipur', 'london', 'support'],
      answer: 'You can contact **TheTutorment** team directly:\n\n• **Website**: [thetutorment.com](https://thetutorment.com)\n• **WhatsApp / Call**: +91 90570 54077\n• **Email**: support@thetutorment.com\n• **UK Office**: 3, Waterloo Road, Upton Park, London E6 1AP\n• **India Office**: Jaipur, Rajasthan\n\nClick "Book a Free Consultation" on **thetutorment.com** to reserve your call!'
    },
    {
      keys: ['resume', 'cv', 'ats', 'cover letter', 'linkedin', 'profile', 'application'],
      answer: 'We provide **ATS Resume & LinkedIn Overhauls**:\n\n• **ATS Formatting**: Rebuilding your CV with keywords to pass ATS screeners in UK, US, & India.\n• **LinkedIn Branding**: Headline, summary, and experience optimization.\n• **Cover Letters**: Tailored application letters for recruiters.\n\nWould you like to review your CV on a free 1-to-1 call?'
    },
    {
      keys: ['interview', 'mock', 'prepare', 'hr', 'technical', 'behavioral', 'star method'],
      answer: 'Our **1-to-1 Mock Interview Coaching** includes:\n\n• Domain-specific Technical interviews.\n• HR & Behavioral rounds using the STAR method.\n• Case study & coding simulations led by active hiring managers.\n\nWhat role or interview are you preparing for?'
    },
    {
      keys: ['process', 'how it works', 'steps', 'get started', 'begin', 'how to start'],
      answer: 'Getting started with **TheTutorment** takes 3 simple steps:\n\n1. **Book a Free Session**: Register on **thetutorment.com**.\n2. **1-to-1 Diagnostic Call**: A senior mentor audits your background and target goals.\n3. **Tailored Execution**: We build your customized roadmap and mentor you directly to success.\n\nReady to book your free call?'
    }
  ];

  var chatHistory = [];
  try {
    var saved = localStorage.getItem('ttChatHistory');
    if (saved) chatHistory = JSON.parse(saved);
  } catch(e){}

  // Inject Styles
  var style = document.createElement('style');
  style.textContent = `
    #tt-chatbot-toggle {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #0F3D91 0%, #0B2F73 100%);
      color: #FFFFFF; border: 2px solid rgba(255,255,255,0.2);
      box-shadow: 0 8px 25px rgba(15,61,145,0.4); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    }
    #tt-chatbot-toggle:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 12px 30px rgba(15,61,145,0.5);
    }
    #tt-chatbot-toggle svg { width: 28px; height: 28px; fill: none; stroke: #FFFFFF; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    
    #tt-chatbot-box {
      position: fixed; bottom: 96px; right: 24px; z-index: 99999;
      width: 380px; max-width: calc(100vw - 32px); height: 530px; max-height: calc(100vh - 120px);
      background: #FFFFFF; border-radius: 20px;
      border: 1px solid rgba(229, 231, 235, 0.9);
      box-shadow: 0 20px 50px -10px rgba(15, 23, 42, 0.25);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      animation: ttChatSlideUp 0.25s cubic-bezier(0.16,1,0.3,1);
    }
    @keyframes ttChatSlideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .tt-chat-header {
      background: linear-gradient(135deg, #0F3D91 0%, #0B2F73 100%);
      color: #FFFFFF; padding: 16px 20px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .tt-chat-header-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .tt-chat-header-status { width: 8px; height: 8px; border-radius: 50%; background: #16A34A; }
    .tt-chat-close { background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; padding: 4px; border-radius: 6px; }
    .tt-chat-close:hover { color: #FFFFFF; background: rgba(255,255,255,0.1); }
    
    .tt-chat-messages {
      flex: 1; padding: 16px; overflow-y: auto;
      display: flex; flex-direction: column; gap: 12px;
      background: #F8FAFC;
    }
    .tt-msg {
      max-width: 88%; font-size: 13.5px; line-height: 1.6;
      padding: 12px 16px; border-radius: 16px; word-break: break-word;
    }
    .tt-msg-bot {
      background: #FFFFFF; color: #0F172A;
      border: 1px solid #E5E7EB; border-bottom-left-radius: 4px;
      align-self: flex-start; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .tt-msg-user {
      background: #0F3D91; color: #FFFFFF;
      border-bottom-right-radius: 4px; align-self: flex-end;
    }
    
    .tt-chat-input-area {
      padding: 12px 16px; background: #FFFFFF;
      border-top: 1px solid #E5E7EB; display: flex; gap: 8px; align-items: center;
    }
    .tt-chat-input {
      flex: 1; border: 1px solid #E5E7EB; border-radius: 20px;
      padding: 10px 16px; font-size: 13.5px; outline: none;
      font-family: inherit; color: #0F172A;
    }
    .tt-chat-input:focus { border-color: #0F3D91; }
    .tt-chat-send {
      width: 40px; height: 40px; border-radius: 50%;
      background: #0F3D91; color: #FFFFFF; border: none;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s; flex-shrink: 0;
    }
    .tt-chat-send:hover { background: #0B2F73; transform: scale(1.05); }
    .tt-chat-send svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.5; }
  `;
  document.head.appendChild(style);

  // Inject Container
  var wrap = document.createElement('div');
  wrap.id = 'tt-chatbot-container';
  wrap.innerHTML = `
    <button id="tt-chatbot-toggle" aria-label="TheTutorment Official AI Assistant">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
    <div id="tt-chatbot-box">
      <div class="tt-chat-header">
        <div class="tt-chat-header-title">
          <span class="tt-chat-header-status"></span>
          TheTutorment AI Assistant
        </div>
        <button class="tt-chat-close" id="tt-chat-close-btn" aria-label="Close Chat">✕</button>
      </div>
      <div class="tt-chat-messages" id="tt-chat-msg-list">
        <div class="tt-msg tt-msg-bot">
          👋 Welcome to <strong>TheTutorMent</strong>!<br><br>
          I'm your AI assistant.<br><br>
          I can help you with:<br>
          • <strong>International licensing</strong><br>
          • <strong>Professional registration (HCPC, NMC, SQE)</strong><br>
          • <strong>Study pathways & Funded PhDs</strong><br>
          • <strong>Career guidance & Sponsored Jobs</strong><br>
          • <strong>Eligibility assessment</strong><br>
          • <strong>Application & documentation support</strong><br><br>
          Tell me:<br>
          • Which country are you from?<br>
          • What is your profession?<br>
          • Which country are you interested in?<br><br>
          I'll guide you step by step.
        </div>
      </div>
      <div class="tt-chat-input-area">
        <input type="text" class="tt-chat-input" id="tt-chat-input-field" placeholder="Ask about your career pathway..." onkeydown="if(event.key==='Enter') window.ttSendMsg()">
        <button class="tt-chat-send" onclick="window.ttSendMsg()" aria-label="Send Message">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // Functions
  var toggleBtn = document.getElementById('tt-chatbot-toggle');
  var box = document.getElementById('tt-chatbot-box');
  var closeBtn = document.getElementById('tt-chat-close-btn');
  var msgList = document.getElementById('tt-chat-msg-list');
  var inputField = document.getElementById('tt-chat-input-field');

  toggleBtn.onclick = function() {
    box.style.display = box.style.display === 'flex' ? 'none' : 'flex';
    if (box.style.display === 'flex') inputField.focus();
  };
  closeBtn.onclick = function() { box.style.display = 'none'; };

  // Restore previous history
  if (chatHistory.length > 0) {
    chatHistory.forEach(function(m) {
      appendMessage(m.role, m.text, true);
    });
  }

  function appendMessage(role, text, skipSave) {
    var div = document.createElement('div');
    div.className = 'tt-msg ' + (role === 'user' ? 'tt-msg-user' : 'tt-msg-bot');
    div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color:#0F3D91;font-weight:700;text-decoration:underline">$1</a>');
    msgList.appendChild(div);
    msgList.scrollTop = msgList.scrollHeight;
    if (!skipSave) {
      chatHistory.push({ role: role, text: text });
      try { localStorage.setItem('ttChatHistory', JSON.stringify(chatHistory)); } catch(e){}
    }
  }

  window.ttSendMsg = function() {
    var q = inputField.value.trim();
    if (!q) return;
    inputField.value = '';
    appendMessage('user', q);

    // Typing indicator
    var typing = document.createElement('div');
    typing.className = 'tt-msg tt-msg-bot';
    typing.id = 'tt-typing';
    typing.textContent = 'Thinking...';
    msgList.appendChild(typing);
    msgList.scrollTop = msgList.scrollHeight;

    setTimeout(function() {
      var t = document.getElementById('tt-typing');
      if (t) t.remove();
      var ans = getResponse(q);
      appendMessage('bot', ans);
    }, 450);
  };

  function getResponse(query) {
    var q = query.toLowerCase().trim();
    var bestMatch = null;
    var maxScore = 0;

    KB.forEach(function(item) {
      var score = 0;
      item.keys.forEach(function(k) {
        if (q.includes(k)) {
          score += k.length * 2;
        }
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && maxScore >= 3) return bestMatch.answer;

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings')) {
      return '👋 Welcome to **TheTutorMent**!\n\nI\'m your AI assistant.\n\nI can help you with:\n• **International licensing**\n• **Professional registration (HCPC, NMC, SQE)**\n• **Study pathways & Funded PhDs**\n• **Career guidance & Sponsored Jobs**\n• **Eligibility assessment**\n• **Application & documentation support**\n\nTell me:\n• Which country are you from?\n• What is your profession?\n• Which country are you interested in?\n\nI\'ll guide you step by step.';
    }
    if (q.includes('thank')) {
      return 'You are very welcome! If you would like a personalized roadmap for your profile, feel free to book a 1-to-1 diagnostic call on **thetutorment.com**!';
    }

    return 'I would love to help you with that!\n\nAt **TheTutorment** (thetutorment.com), we provide 1-to-1 tailored mentorship rather than one-size-fits-all advice.\n\n• Could you share a bit about your **current background** and **target career goal**?\n• Or you can book a **free 1-to-1 diagnostic session** on **thetutorment.com** to review your specific situation with a senior mentor!';
  }
})();
