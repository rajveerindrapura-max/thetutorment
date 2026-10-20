var isLocalHost = window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname === '' ||
                  window.location.protocol === 'file:';

var TT_API = isLocalHost
  ? (window.location.origin && window.location.origin.startsWith('http') ? window.location.origin + '/api' : 'http://localhost:8080/api')
  : 'https://tutorment-backend-wjew.onrender.com/api';

/* Pre-warm Render backend on page load */
setTimeout(function(){ fetch(TT_API + '/').catch(function(){}); }, 2000);

/* Strict Email Validation Regex & Helpers */
function ttIsValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  email = email.trim();
  var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  if (email.indexOf('..') !== -1) return false;
  var parts = email.split('@');
  if (parts.length !== 2) return false;
  var user = parts[0];
  var domain = parts[1];
  if (!user || user.startsWith('.') || user.endsWith('.')) return false;
  if (domain.startsWith('.') || domain.endsWith('.') || domain.startsWith('-') || domain.endsWith('-')) return false;
  var domainParts = domain.split('.');
  if (domainParts.some(function(p){ return p.length === 0 || p.startsWith('-') || p.endsWith('-'); })) return false;
  return true;
}

var ttEmailTouched = false;

function ttEmailFocus() {
  var input = document.getElementById('ttSignupEmail');
  if (!input) return;
  var val = (input.value || '').trim();
  if (ttEmailTouched && val && !ttIsValidEmail(val)) {
    input.style.borderColor = '#EF4444';
  } else {
    input.style.borderColor = '#0F3D91';
  }
}

function ttValidateSignupEmail(isBlur) {
  var input = document.getElementById('ttSignupEmail');
  var errEl = document.getElementById('ttSignupEmailErr');
  if (!input) return false;

  if (isBlur) ttEmailTouched = true;

  var val = (input.value || '').trim();
  input.value = val;

  if (!ttEmailTouched && !isBlur) return true;

  if (!val) {
    if (isBlur) {
      input.style.borderColor = '#EF4444';
      if (errEl) {
        errEl.textContent = 'Please enter a valid email address (e.g., name@gmail.com)';
        errEl.style.display = 'block';
      }
      return false;
    } else {
      input.style.borderColor = '#E2E8F0';
      if (errEl) errEl.style.display = 'none';
      return true;
    }
  }

  if (!ttIsValidEmail(val)) {
    input.style.borderColor = '#EF4444';
    if (errEl) {
      errEl.textContent = 'Please enter a valid email address (e.g., name@gmail.com)';
      errEl.style.display = 'block';
    }
    return false;
  } else {
    input.style.borderColor = '#E2E8F0';
    if (errEl) errEl.style.display = 'none';
    return true;
  }
}

function initTTNav() {
  var nav = document.getElementById('main-nav');
  if (!nav) return;
  var r = nav.dataset.root || '';

  /* ── NAV HTML ── */
  nav.innerHTML =
    '<div class="nav-inner">' +
      '<a href="' + r + '" class="nav-logo"><img src="' + r + 'TT_Logo_SVG.svg" alt="The Tutorment" width="160" height="40"></a>' +
      '<div class="nav-links">' +

        /* ABOUT */
        '<div class="nav-dd">' +
          '<button class="nav-dt" aria-haspopup="true" onclick="window.location.href=\'' + r + 'pages/about.html\'">About</button>' +
          '<div class="nav-dm" style="min-width:230px;padding:8px 0">' +
            '<a href="' + r + 'pages/about.html" style="display:block;font-size:14px;font-weight:500;color:#1E293B;padding:10px 18px;line-height:1.5;text-decoration:none;transition:all .15s ease" onmouseover="this.style.color=\'#0F3D91\';this.style.background=\'#F8FAFC\'" onmouseout="this.style.color=\'#1E293B\';this.style.background=\'transparent\'">About The Tutorment</a>' +
            '<a href="' + r + 'pages/results.html" style="display:block;font-size:14px;font-weight:500;color:#1E293B;padding:10px 18px;line-height:1.5;text-decoration:none;transition:all .15s ease" onmouseover="this.style.color=\'#0F3D91\';this.style.background=\'#F8FAFC\'" onmouseout="this.style.color=\'#1E293B\';this.style.background=\'transparent\'">Student Outcomes & Reviews</a>' +
            '<a href="' + r + 'pages/contact.html" style="display:block;font-size:14px;font-weight:500;color:#1E293B;padding:10px 18px;line-height:1.5;text-decoration:none;transition:all .15s ease" onmouseover="this.style.color=\'#0F3D91\';this.style.background=\'#F8FAFC\'" onmouseout="this.style.color=\'#1E293B\';this.style.background=\'transparent\'">Book Free Consultation</a>' +
          '</div>' +
        '</div>' +

        /* INTERNATIONAL two-level */
        '<div class="nav-dd">' +
          '<button class="nav-dt" aria-haspopup="true">International</button>' +
          '<div class="nav-dm nav-dm2">' +
            '<div class="ndm2-countries">' +
              '<div class="ndm2-c ndm2-on" onmouseenter="ndm2Show(this,\'intl-uk\')">United Kingdom</div>' +
              '<div class="ndm2-c" onmouseenter="ndm2Show(this,\'intl-usa\')">United States</div>' +
              '<div class="ndm2-c" onmouseenter="ndm2Show(this,\'intl-ca\')">Canada</div>' +
              '<div class="ndm2-c" onmouseenter="ndm2Show(this,\'intl-au\')">Australia</div>' +
              '<div class="ndm2-c" onmouseenter="ndm2Show(this,\'intl-de\')">Germany</div>' +
              '<div class="ndm2-c" onmouseenter="ndm2Show(this,\'intl-sg\')">Singapore</div>' +
              '<div class="ndm2-c" onmouseenter="ndm2Show(this,\'intl-ie\')">Ireland</div>' +
              '<hr>' +
              '<div class="ndm2-c" onmouseenter="ndm2Show(this,\'intl-guides\')">Knowledge Guides</div>' +
            '</div>' +
            '<div class="ndm2-svcs ndm2-active" id="intl-uk">' +
              '<a href="' + r + 'pages/international.html?c=uk">All United Kingdom Services</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-hcpc">HCPC Registration</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-nmc">NMC Registration</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-sqe">SQE Registration</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-jobs">Sponsored Jobs</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-teaching">Teaching and QTS</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-phd">PhD and Scholarships</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-psw">Post Study Work Visa</a>' +
              '<a href="' + r + 'pages/international.html?c=uk#uk-admissions">University Admissions</a>' +
            '</div>' +
            '<div class="ndm2-svcs" id="intl-usa">' +
              '<a href="' + r + 'pages/international.html?c=usa">All United States Services</a>' +
              '<a href="' + r + 'pages/international.html?c=usa#usa-visa">F-1 Student Visa</a>' +
              '<a href="' + r + 'pages/international.html?c=usa#usa-opt">Optional Practical Training</a>' +
              '<a href="' + r + 'pages/international.html?c=usa#usa-h1b">H-1B Work Visa</a>' +
              '<a href="' + r + 'pages/international.html?c=usa#usa-phd">PhD and Funding</a>' +
              '<a href="' + r + 'pages/international.html?c=usa#usa-admissions">University Admissions</a>' +
            '</div>' +
            '<div class="ndm2-svcs" id="intl-ca">' +
              '<a href="' + r + 'pages/international.html?c=canada">All Canada Services</a>' +
              '<a href="' + r + 'pages/international.html?c=canada#ca-visa">Study Permit</a>' +
              '<a href="' + r + 'pages/international.html?c=canada#ca-pgwp">Post-Graduation Work Permit</a>' +
              '<a href="' + r + 'pages/international.html?c=canada#ca-pr">Permanent Residence</a>' +
              '<a href="' + r + 'pages/international.html?c=canada#ca-admissions">University Admissions</a>' +
            '</div>' +
            '<div class="ndm2-svcs" id="intl-au">' +
              '<a href="' + r + 'pages/international.html?c=australia">All Australia Services</a>' +
              '<a href="' + r + 'pages/international.html?c=australia#au-visa">Student Visa</a>' +
              '<a href="' + r + 'pages/international.html?c=australia#au-485">Post-Study Work Visa</a>' +
              '<a href="' + r + 'pages/international.html?c=australia#au-pr">Skilled Migration</a>' +
              '<a href="' + r + 'pages/international.html?c=australia#au-admissions">University Admissions</a>' +
            '</div>' +
            '<div class="ndm2-svcs" id="intl-de">' +
              '<a href="' + r + 'pages/international.html?c=germany">All Germany Services</a>' +
              '<a href="' + r + 'pages/international.html?c=germany#de-visa">Student Visa</a>' +
              '<a href="' + r + 'pages/international.html?c=germany#de-psw">Job Seeker Permit</a>' +
              '<a href="' + r + 'pages/international.html?c=germany#de-blue">EU Blue Card</a>' +
              '<a href="' + r + 'pages/international.html?c=germany#de-admissions">University Admissions</a>' +
            '</div>' +
            '<div class="ndm2-svcs" id="intl-sg">' +
              '<a href="' + r + 'pages/international.html?c=singapore">All Singapore Services</a>' +
              '<a href="' + r + 'pages/international.html?c=singapore#sg-visa">Student Pass</a>' +
              '<a href="' + r + 'pages/international.html?c=singapore#sg-ep">Employment Pass</a>' +
              '<a href="' + r + 'pages/international.html?c=singapore#sg-pr">Permanent Residence</a>' +
            '</div>' +
            '<div class="ndm2-svcs" id="intl-ie">' +
              '<a href="' + r + 'pages/international.html?c=ireland">All Ireland Services</a>' +
              '<a href="' + r + 'pages/international.html?c=ireland#ie-visa">Study Visa</a>' +
              '<a href="' + r + 'pages/international.html?c=ireland#ie-grad">Graduate Scheme</a>' +
              '<a href="' + r + 'pages/international.html?c=ireland#ie-csep">Critical Skills Permit</a>' +
              '<a href="' + r + 'pages/international.html?c=ireland#ie-admissions">University Admissions</a>' +
            '</div>' +
            '<div class="ndm2-svcs" id="intl-guides">' +
              '<a href="' + r + 'pages/global-guide.html">Global Career Guide</a>' +
              '<a href="' + r + 'pages/psw.html">Post Study Work Visa Guide</a>' +
              '<a href="' + r + 'pages/visas.html">Student Visa Guide</a>' +
              '<a href="' + r + 'pages/phd-guide.html">Complete PhD Guide</a>' +
              '<a href="' + r + 'pages/university-guide.html">How to Choose a University</a>' +
              '<a href="' + r + 'pages/career-prospects.html">Career After Study</a>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* INDIA */
        '<div class="nav-dd">' +
          '<button class="nav-dt" aria-haspopup="true">India</button>' +
          '<div class="nav-dm" style="min-width:230px">' +
            '<a href="' + r + 'pages/india.html" style="font-weight:700;color:#0056d2">All India Services</a>' +
            '<hr>' +
            '<a href="' + r + 'pages/india.html#placement">Campus Placement</a>' +
            '<a href="' + r + 'pages/india.html#salary">Salary Enhancement</a>' +
            '<a href="' + r + 'pages/india.html#jobs">Job Applications Done For You</a>' +
            '<a href="' + r + 'pages/india.html#upskilling">Professional Upskilling</a>' +
            '<a href="' + r + 'pages/india.html#abroad">Study Abroad from India</a>' +
          '</div>' +
        '</div>' +

        /* TOOLS */
        '<div class="nav-dd">' +
          '<button class="nav-dt" aria-haspopup="true">Tools</button>' +
          '<div class="nav-dm" style="min-width:210px">' +
            '<a href="https://forms.gle/2hmLdeJAT7Tt7Cb9A" target="_blank" rel="noopener" style="font-weight:700;color:#0056d2">Check your Eligibility</a>' +
            '<a href="' + r + 'pages/salary-calculator.html">Salary calculator</a>' +
            '<a href="' + r + 'pages/blog.html">Career guides</a>' +
            '<a href="' + r + 'pages/dashboard.html">My dashboard</a>' +
          '</div>' +
        '</div>' +

      '</div>' +

      '<div class="nav-sw" id="tt-nav-sw" role="search">' +
        '<input type="search" id="ttSrch" placeholder="Search..." autocomplete="off" name="q" x-search="1" aria-label="Search The Tutorment" onkeydown="if(event.key===\'Enter\')ttSearch()">' +
        '<button onclick="ttSearch()" aria-label="Search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>' +
      '</div>' +

      '<div class="nav-actions" id="tt-nav-actions">' +
        '<button class="btn-si" id="tt-btn-si" onclick="ttOpenOrDash()">Sign in</button>' +
        '<a href="' + r + 'pages/contact.html" class="btn-jn">Contact us</a>' +
        /* User avatar — hidden until logged in */
        '<div class="tt-user-menu" id="tt-user-menu" style="display:none">' +
          '<button class="tt-avatar-btn" onclick="ttUserMenuToggle()" aria-label="Account menu" aria-haspopup="true">' +
            '<div class="tt-avatar" id="tt-avatar-initials">P</div>' +
            '<span class="tt-avatar-name" id="tt-avatar-name">Account</span>' +
            '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:4px;flex-shrink:0"><path d="M6 9l6 6 6-6"/></svg>' +
          '</button>' +
          '<div class="tt-user-dd" id="tt-user-dd" style="display:none">' +
            '<div class="tt-user-dd-head">' +
              '<div class="tt-user-dd-name" id="tt-dd-name">User</div>' +
              '<div class="tt-user-dd-email" id="tt-dd-email"></div>' +
            '</div>' +
            '<div class="tt-user-dd-divider"></div>' +
            '<a class="tt-user-dd-item" href="' + r + 'pages/dashboard.html">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' +
              'My dashboard' +
            '</a>' +
            '<a class="tt-user-dd-item" href="' + r + 'pages/eligibility.html">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>' +
              'New report' +
            '</a>' +
            '<a class="tt-user-dd-item" href="' + r + 'pages/contact.html">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
              'Book a session' +
            '</a>' +
            '<div class="tt-user-dd-divider"></div>' +
            '<button class="tt-user-dd-item tt-user-dd-signout" onclick="ttNavSignout()">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
              'Sign out' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* Hamburger */
      '<button class="nav-hb" onclick="document.getElementById(\'mobNav\').classList.toggle(\'open\')" aria-label="Open menu">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
      '</button>' +
    '</div>' +

    /* Mobile nav */
    '<div class="mob-nav" id="mobNav">' +
      '<a href="' + r + 'pages/international.html">International Wing</a>' +
      '<a href="' + r + 'pages/international.html?c=uk">United Kingdom</a>' +
      '<a href="' + r + 'pages/international.html?c=usa">United States</a>' +
      '<a href="' + r + 'pages/international.html?c=canada">Canada</a>' +
      '<a href="' + r + 'pages/international.html?c=australia">Australia</a>' +
      '<a href="' + r + 'pages/india.html">India Wing</a>' +
      '<a href="' + r + 'pages/india.html#placement">Campus Placement</a>' +
      '<a href="' + r + 'pages/india.html#salary">Salary Enhancement</a>' +
      '<a href="https://forms.gle/2hmLdeJAT7Tt7Cb9A" target="_blank" rel="noopener">Check your Eligibility</a>' +
      '<a href="' + r + 'pages/salary-calculator.html">Salary calculator</a>' +
      '<a href="' + r + 'pages/blog.html">Career guides</a>' +
      '<a href="' + r + 'pages/about.html">About Us</a>' +
      '<a href="' + r + 'pages/results.html">Results</a>' +
      '<a href="' + r + 'pages/contact.html" class="mob-cta">Contact us</a>' +
    '</div>';

  /* ── MODAL ── */
  var m = document.createElement('div');
  m.id = 'ttModal';
  m.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.65);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:99999;overflow-y:auto;padding:50px 16px 40px;box-sizing:border-box';
  m.onclick = function(e){ if(e.target===m) ttClose(); };
  m.innerHTML =
    '<div style="background:#fff;border-radius:16px;width:100%;max-width:440px;margin:0 auto;box-shadow:0 24px 64px -12px rgba(15,23,42,0.35);border:1px solid #E2E8F0;overflow:hidden">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #F1F5F9">' +
        '<h3 id="ttModalTitle" style="font-size:18px;font-weight:800;color:#0F172A;margin:0;letter-spacing:-.01em;font-family:\'Plus Jakarta Sans\',sans-serif">Sign in to The Tutorment</h3>' +
        '<button onclick="ttClose()" aria-label="Close modal" style="background:none;border:none;color:#64748B;font-size:20px;line-height:1;cursor:pointer;padding:6px;border-radius:8px;transition:all .15s;display:flex;align-items:center;justify-content:center" onmouseenter="this.style.background=\'#F1F5F9\';this.style.color=\'#0F172A\'" onmouseleave="this.style.background=\'none\';this.style.color=\'#64748B\'">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div style="display:flex;border-bottom:1px solid #F1F5F9;background:#F8FAFC">' +
        '<button id="ttTabLogin" onclick="ttTab(\'login\')" style="flex:1;padding:14px;font-size:14px;font-weight:700;background:none;border:none;border-bottom:2.5px solid #0F3D91;color:#0F3D91;cursor:pointer;font-family:inherit;transition:all .15s">Sign in</button>' +
        '<button id="ttTabSignup" onclick="ttTab(\'signup\')" style="flex:1;padding:14px;font-size:14px;font-weight:700;background:none;border:none;border-bottom:2.5px solid transparent;color:#64748B;cursor:pointer;font-family:inherit;transition:all .15s">Join for free</button>' +
      '</div>' +
      '<div style="padding:24px">' +
        /* LOGIN PANEL */
        '<div id="ttPanelLogin">' +
          '<div style="margin-bottom:16px"><label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">Email address</label>' +
          '<input id="ttLoginEmail" type="email" placeholder="you@example.com" autocomplete="off" style="width:100%;font-size:14px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s" onfocus="this.style.borderColor=\'#0F3D91\'" onblur="this.style.borderColor=\'#E2E8F0\'"></div>' +
          '<div style="margin-bottom:16px"><label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">Password</label>' +
          '<input id="ttLoginPass" type="password" placeholder="Your password" autocomplete="off" style="width:100%;font-size:14px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s" onfocus="this.style.borderColor=\'#0F3D91\'" onblur="this.style.borderColor=\'#E2E8F0\'"></div>' +
          '<p id="ttLoginErr" style="font-size:13px;color:#dc2626;margin-bottom:10px;display:none;background:#fef2f2;border:1px solid #fecaca;padding:8px 12px;border-radius:6px"></p>' +
          '<button id="ttLoginBtn" onclick="ttLogin()" style="width:100%;font-size:15px;font-weight:700;padding:13px;border-radius:10px;background:linear-gradient(135deg, #0F3D91 0%, #0B2F73 100%);color:#fff;border:none;cursor:pointer;font-family:inherit;margin-bottom:14px;box-shadow:0 4px 14px rgba(15,61,145,0.25);transition:all .15s">Sign in to my account</button>' +
          '<p style="font-size:13px;color:#64748B;text-align:center;line-height:1.8">' +
            '<a href="#" onclick="ttTab(\'signup\');return false" style="color:#0F3D91;font-weight:600;text-decoration:none">New here? Join for free</a>' +
            ' &nbsp;&middot;&nbsp; ' +
            '<a href="#" onclick="alert(\'Email support@thetutorment.com\');return false" style="color:#0F3D91;font-weight:600;text-decoration:none">Forgot password?</a>' +
          '</p>' +
          '<div style="display:flex;align-items:center;gap:10px;margin:16px 0"><div style="flex:1;height:1px;background:#E2E8F0"></div><span style="font-size:12px;color:#94A3B8;font-weight:500">or</span><div style="flex:1;height:1px;background:#E2E8F0"></div></div>' +
          '<a href="https://wa.me/919057054077" target="_blank" style="width:100%;font-size:14px;font-weight:600;padding:11px;border:1.5px solid #E2E8F0;border-radius:10px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;text-decoration:none;color:#0F172A;box-sizing:border-box;transition:all .15s" onmouseenter="this.style.borderColor=\'#25D366\';this.style.background=\'#F0FDF4\'" onmouseleave="this.style.borderColor=\'#E2E8F0\';this.style.background=\'#fff\'">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>' +
            'Contact us on WhatsApp' +
          '</a>' +
        '</div>' +
        /* SIGNUP PANEL */
        '<div id="ttPanelSignup" style="display:none">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">' +
            '<div><label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">First name</label><input id="ttSignupFirst" type="text" placeholder="First name" autocomplete="given-name" style="width:100%;font-size:14px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s" onfocus="this.style.borderColor=\'#0F3D91\'" onblur="this.style.borderColor=\'#E2E8F0\'"></div>' +
            '<div><label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">Last name</label><input id="ttSignupLast" type="text" placeholder="Last name" autocomplete="family-name" style="width:100%;font-size:14px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s" onfocus="this.style.borderColor=\'#0F3D91\'" onblur="this.style.borderColor=\'#E2E8F0\'"></div>' +
          '</div>' +
          '<div style="margin-bottom:16px">' +
            '<label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">Email address</label>' +
            '<input id="ttSignupEmail" type="email" required autocomplete="email" placeholder="you@example.com" onblur="ttValidateSignupEmail(true)" oninput="ttValidateSignupEmail(false)" onfocus="ttEmailFocus()" style="width:100%;font-size:14px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s">' +
            '<p id="ttSignupEmailErr" style="font-size:12px;color:#EF4444;margin-top:5px;margin-bottom:0;display:none;font-family:inherit">Please enter a valid email address (e.g., name@gmail.com)</p>' +
          '</div>' +
          /* Phone or WhatsApp with auto-suggest country code */
          '<div style="margin-bottom:16px">' +
            '<label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">Phone or WhatsApp</label>' +
            '<div style="display:flex;gap:8px">' +
              '<select id="ttSignupCountryCode" onchange="ttUpdatePhonePrefix(this.value)" aria-label="Select Country Code" style="width:130px;font-size:13px;font-weight:600;padding:11px 6px;border:1.5px solid #E2E8F0;border-radius:10px;background:#F8FAFC;color:#0F172A;outline:none;cursor:pointer;font-family:inherit;flex-shrink:0;box-sizing:border-box;transition:border-color .15s">' +
                '<option value="+91">🇮🇳 +91 (India)</option>' +
                '<option value="+44">🇬🇧 +44 (UK)</option>' +
                '<option value="+1">🇺🇸 +1 (USA)</option>' +
                '<option value="+1">🇨🇦 +1 (Canada)</option>' +
                '<option value="+61">🇦🇺 +61 (Australia)</option>' +
                '<option value="+49">🇩🇪 +49 (Germany)</option>' +
                '<option value="+65">🇸🇬 +65 (Singapore)</option>' +
                '<option value="+353">🇮🇪 +353 (Ireland)</option>' +
                '<option value="+971">🇦🇪 +971 (UAE)</option>' +
                '<option value="+966">🇸🇦 +966 (Saudi Arabia)</option>' +
                '<option value="+64">🇳🇿 +64 (New Zealand)</option>' +
                '<option value="+974">🇶🇦 +974 (Qatar)</option>' +
                '<option value="+965">🇰🇼 +965 (Kuwait)</option>' +
                '<option value="+968">🇴🇲 +968 (Oman)</option>' +
                '<option value="+973">🇧🇭 +973 (Bahrain)</option>' +
                '<option value="+60">🇲🇾 +60 (Malaysia)</option>' +
                '<option value="+92">🇵🇰 +92 (Pakistan)</option>' +
                '<option value="+880">🇧🇩 +880 (Bangladesh)</option>' +
                '<option value="+94">🇱🇰 +94 (Sri Lanka)</option>' +
                '<option value="+977">🇳🇵 +977 (Nepal)</option>' +
                '<option value="+33">🇫🇷 +33 (France)</option>' +
                '<option value="+39">🇮🇹 +39 (Italy)</option>' +
                '<option value="+34">🇪🇸 +34 (Spain)</option>' +
                '<option value="+31">🇳🇱 +31 (Netherlands)</option>' +
                '<option value="+46">🇸🇪 +46 (Sweden)</option>' +
                '<option value="+47">🇳🇴 +47 (Norway)</option>' +
                '<option value="+45">🇩🇰 +45 (Denmark)</option>' +
                '<option value="+358">🇫🇮 +358 (Finland)</option>' +
                '<option value="+41">🇨🇭 +41 (Switzerland)</option>' +
                '<option value="+43">🇦🇹 +43 (Austria)</option>' +
                '<option value="+32">🇧🇪 +32 (Belgium)</option>' +
                '<option value="+351">🇵🇹 +351 (Portugal)</option>' +
                '<option value="+48">🇵🇱 +48 (Poland)</option>' +
                '<option value="+40">🇷🇴 +40 (Romania)</option>' +
                '<option value="+36">🇭🇺 +36 (Hungary)</option>' +
                '<option value="+420">🇨🇿 +420 (Czechia)</option>' +
                '<option value="+30">🇬🇷 +30 (Greece)</option>' +
                '<option value="+90">🇹🇷 +90 (Turkey)</option>' +
                '<option value="+7">🇷🇺 +7 (Russia)</option>' +
                '<option value="+380">🇺🇦 +380 (Ukraine)</option>' +
                '<option value="+81">🇯🇵 +81 (Japan)</option>' +
                '<option value="+82">🇰🇷 +82 (South Korea)</option>' +
                '<option value="+86">🇨🇳 +86 (China)</option>' +
                '<option value="+852">🇭🇰 +852 (Hong Kong)</option>' +
                '<option value="+886">🇹🇼 +886 (Taiwan)</option>' +
                '<option value="+66">🇹🇭 +66 (Thailand)</option>' +
                '<option value="+84">🇻🇳 +84 (Vietnam)</option>' +
                '<option value="+63">🇵🇭 +63 (Philippines)</option>' +
                '<option value="+62">🇮🇩 +62 (Indonesia)</option>' +
                '<option value="+27">🇿🇦 +27 (South Africa)</option>' +
                '<option value="+234">🇳🇬 +234 (Nigeria)</option>' +
                '<option value="+254">🇰🇪 +254 (Kenya)</option>' +
                '<option value="+20">🇪🇬 +20 (Egypt)</option>' +
                '<option value="+212">🇲🇦 +212 (Morocco)</option>' +
                '<option value="+52">🇲🇽 +52 (Mexico)</option>' +
                '<option value="+55">🇧🇷 +55 (Brazil)</option>' +
                '<option value="+54">🇦🇷 +54 (Argentina)</option>' +
                '<option value="+56">🇨🇱 +56 (Chile)</option>' +
                '<option value="+57">🇨🇴 +57 (Colombia)</option>' +
                '<option value="+51">🇵🇪 +51 (Peru)</option>' +
                '<option value="">🌐 Other / Custom</option>' +
              '</select>' +
              '<input id="ttSignupPhone" type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="Enter phone number" autocomplete="tel" onkeypress="return (event.charCode>=48&&event.charCode<=57)||[32,43,45].includes(event.charCode)" oninput="ttAutoSuggestCountry(this)" style="flex:1;font-size:14px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s" onfocus="this.style.borderColor=\'#0F3D91\'" onblur="this.style.borderColor=\'#E2E8F0\'">' +
            '</div>' +
          '</div>' +
          '<div style="margin-bottom:16px"><label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">What do you need help with?</label>' +
          '<select id="ttSignupService" aria-label="What do you need help with" style="width:100%;font-size:13.5px;padding:11px 12px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;background:#fff;box-sizing:border-box;font-family:inherit;transition:border-color .15s;color:#0F172A" onfocus="this.style.borderColor=\'#0F3D91\'" onblur="this.style.borderColor=\'#E2E8F0\'">' +
            '<option value="">Select what you need help with</option>' +
            '<optgroup label="Professional & Healthcare Registrations">' +
              '<option value="hcpc">HCPC Registration (Physio, Radiography, OT, Biomed, Paramedics)</option>' +
              '<option value="nmc">NMC Registration (Nurses & Midwives)</option>' +
              '<option value="sqe">SQE Registration (Solicitors Qualifying Examination)</option>' +
              '<option value="gmc">GMC Registration / PLAB (Doctors & Physicians)</option>' +
              '<option value="oet-ielts">OET / IELTS / PTE Language Coaching</option>' +
            '</optgroup>' +
            '<optgroup label="UK Careers & Teaching">' +
              '<option value="jobs-uk">UK Sponsored Job Search (Skilled Worker Visa Sponsorship)</option>' +
              '<option value="teaching">UK Teaching (QTS / iQTS / Assessment Only)</option>' +
              '<option value="psw">Post Study Work Visa (Graduate Route UK)</option>' +
            '</optgroup>' +
            '<optgroup label="Global Universities & PhD Scholarships">' +
              '<option value="phd">Funded PhD & Research Fellowships (UK, EU, US, AU)</option>' +
              '<option value="scholarships">Chevening, Commonwealth & GREAT Scholarships</option>' +
              '<option value="admissions-uk">UK University Admissions & Personal Statement</option>' +
              '<option value="admissions-global">USA, Canada, Australia & Ireland Admissions</option>' +
            '</optgroup>' +
            '<optgroup label="India Career Growth & Placements">' +
              '<option value="placement">Campus Placement Prep (Tier-2 & Tier-3 Colleges)</option>' +
              '<option value="salary">Salary Enhancement & Offer Negotiation (Working Pros)</option>' +
              '<option value="jobs-in">Job Applications Done-For-You (Naukri & LinkedIn)</option>' +
              '<option value="mock-interviews">Mock Interviews (Technical & HR Coaching)</option>' +
            '</optgroup>' +
            '<optgroup label="Professional Upskilling Courses">' +
              '<option value="upskill-dev">Full Stack Software Development (Python / MERN)</option>' +
              '<option value="upskill-data">Data Science, Analytics & AI Engineering</option>' +
              '<option value="upskill-cloud">Cloud Computing & DevOps (AWS / Azure)</option>' +
              '<option value="upskill-pm">Product Management & Agile Certification</option>' +
              '<option value="upskill-design">UI/UX Product Design & Interface</option>' +
              '<option value="upskill-mkt">Digital Marketing & Growth Strategy</option>' +
              '<option value="upskill-fin">Corporate Finance & Financial Modeling</option>' +
            '</optgroup>' +
            '<optgroup label="General Mentorship">' +
              '<option value="other">Not sure yet — Need 1-to-1 Diagnostic Session</option>' +
            '</optgroup>' +
          '</select></div>' +
          '<div style="margin-bottom:16px"><label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px">Set a password</label><input id="ttSignupPass" type="password" placeholder="Min 6 characters" autocomplete="new-password" style="width:100%;font-size:14px;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s" onfocus="this.style.borderColor=\'#0F3D91\'" onblur="this.style.borderColor=\'#E2E8F0\'"></div>' +
          '<p id="ttSignupErr" style="font-size:13px;color:#dc2626;margin-bottom:10px;display:none;background:#fef2f2;border:1px solid #fecaca;padding:8px 12px;border-radius:6px"></p>' +
          '<button id="ttSignupBtn" onclick="ttSignup()" style="width:100%;font-size:15px;font-weight:700;padding:13px;border-radius:10px;background:linear-gradient(135deg, #0F3D91 0%, #0B2F73 100%);color:#fff;border:none;cursor:pointer;font-family:inherit;margin-bottom:12px;box-shadow:0 4px 14px rgba(15,61,145,0.25);transition:all .15s">Create account and Book a Free Consultation</button>' +
          '<p style="font-size:12.5px;color:#64748B;text-align:center;line-height:1.6">First session always free. No card required. <a href="#" onclick="ttTab(\'login\');return false" style="color:#0F3D91;font-weight:600;text-decoration:none">Already have an account?</a></p>' +
        '</div>' +
        /* SUCCESS PANEL */
        '<div id="ttPanelSuccess" style="display:none;text-align:center;padding:24px 0">' +
          '<div style="font-size:52px;margin-bottom:14px;color:#0284C7">&#10003;</div>' +
          '<div id="ttSuccessTitle" style="font-size:18px;font-weight:700;color:#0F172A;margin-bottom:10px">Welcome to The Tutorment</div>' +
          '<p style="font-size:14px;color:#64748B;line-height:1.65">Redirecting to your dashboard...</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(m);

  /* ── SESSION STORAGE HELPERS ── */
  function ttGetStoredSession() {
    var userStr = localStorage.getItem('tt_user') || localStorage.getItem('currentUser') || localStorage.getItem('tutorment_user');
    var token = localStorage.getItem('tt_token') || localStorage.getItem('token');
    var u = null;
    if (userStr) {
      try {
        u = typeof userStr === 'string' ? JSON.parse(userStr) : userStr;
        if (typeof u === 'string') u = JSON.parse(u);
      } catch(e) {}
    }
    if (!token && u && (u.token || u.isLoggedIn)) {
      token = u.token || 'local-session-active';
    }
    return { user: u, token: token };
  }

  function ttSaveStoredSession(userObj, token) {
    if (!userObj) return;
    if (typeof userObj !== 'object') {
      try { userObj = JSON.parse(userObj); } catch(e) { return; }
    }
    if (!userObj.isLoggedIn) userObj.isLoggedIn = true;
    var tokenVal = token || userObj.token || ('local-token-' + (userObj.id || Date.now()));
    userObj.token = tokenVal;
    var userStr = JSON.stringify(userObj);
    localStorage.setItem('tt_token', tokenVal);
    localStorage.setItem('token', tokenVal);
    localStorage.setItem('tt_user', userStr);
    localStorage.setItem('currentUser', userStr);
    localStorage.setItem('tutorment_user', userStr);
  }

  function ttClearStoredSession() {
    localStorage.removeItem('tt_token');
    localStorage.removeItem('token');
    localStorage.removeItem('tt_user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tutorment_user');
    localStorage.removeItem('tt_elig_user');
  }

  /* ── UPDATE NAV FOR LOGIN STATE ── runs 150ms after DOM ready */
  setTimeout(function(){
    var session = ttGetStoredSession();
    var token   = session.token;
    var u       = session.user;
    var siBtn   = document.getElementById('tt-btn-si');
    var userMenu= document.getElementById('tt-user-menu');
    var navSw   = document.getElementById('tt-nav-sw');

    if(u || token){
      try {
        if (!u) u = { firstName: 'Account', isLoggedIn: true };
        /* Proper case name */
        var rawFirst = u.firstName || (u.name ? u.name.split(' ')[0] : '');
        var rawLast  = u.lastName || (u.name ? u.name.split(' ').slice(1).join(' ') : '');
        var fname = rawFirst ? rawFirst.charAt(0).toUpperCase()+rawFirst.slice(1).toLowerCase() : '';
        var lname = rawLast ? rawLast.charAt(0).toUpperCase()+rawLast.slice(1).toLowerCase() : '';
        var fullName = (fname+(lname?' '+lname:'')).trim()||u.name||'Account';
        var initials = ((fname ? fname.charAt(0) : '') + (lname ? lname.charAt(0) : (fname.length > 1 ? fname.charAt(1) : ''))).toUpperCase()||'U';

        /* Hide sign-in, show avatar */
        if(siBtn) siBtn.style.display = 'none';
        if(userMenu) userMenu.style.display = 'flex';
        /* Hide search bar — eliminates gmail autofill completely */
        if(navSw) navSw.style.display = 'none';

        /* Fill avatar details */
        var el; 
        el = document.getElementById('tt-avatar-initials'); if(el) el.textContent = initials;
        el = document.getElementById('tt-avatar-name');    if(el) el.textContent = fname||'Account';
        el = document.getElementById('tt-dd-name');        if(el) el.textContent = fullName;
        el = document.getElementById('tt-dd-email');       if(el) el.textContent = u.email||'';
      } catch(e){}
    } else {
      /* Logged out — restore defaults */
      if(siBtn){ siBtn.style.display=''; siBtn.textContent='Sign in'; }
      if(userMenu) userMenu.style.display = 'none';
      if(navSw) navSw.style.display = '';
    }
  }, 150);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTTNav);
} else {
  initTTNav();
}

/* ── NAV SCROLL SHADOW ── */
window.addEventListener('scroll', function(){
  var nav = document.getElementById('main-nav');
  if(!nav) return;
  nav.classList[window.scrollY > 10 ? 'add' : 'remove']('scrolled');
});

/* ── TWO-LEVEL DROPDOWN ── */
function ndm2Show(el, id) {
  var dm = el.closest('.nav-dm2');
  if (!dm) return;
  dm.querySelectorAll('.ndm2-c').forEach(function(c){ c.classList.remove('ndm2-on'); });
  el.classList.add('ndm2-on');
  dm.querySelectorAll('.ndm2-svcs').forEach(function(s){ s.classList.remove('ndm2-active'); });
  var t = document.getElementById(id);
  if (t) t.classList.add('ndm2-active');
}

/* ── USER AVATAR MENU ── */
function ttUserMenuToggle() {
  var dd = document.getElementById('tt-user-dd');
  if(!dd) return;
  var isOpen = dd.style.display === 'block';
  dd.style.display = isOpen ? 'none' : 'block';
  if(!isOpen){
    setTimeout(function(){
      document.addEventListener('click', function closeDD(e){
        if(!e.target.closest || !e.target.closest('.tt-user-menu')){
          dd.style.display = 'none';
          document.removeEventListener('click', closeDD);
        }
      });
    }, 10);
  }
}

function ttNavSignout() {
  localStorage.removeItem('tt_token');
  localStorage.removeItem('token');
  localStorage.removeItem('tt_user');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('tutorment_user');
  localStorage.removeItem('tt_elig_user');
  window.location.reload();
}

/* ── MODAL CONTROLS ── */
function ttOpenOrDash() {
  var userStr = localStorage.getItem('tt_user') || localStorage.getItem('currentUser') || localStorage.getItem('tutorment_user');
  var token = localStorage.getItem('tt_token') || localStorage.getItem('token');
  if (token || userStr) {
    var nav = document.getElementById('main-nav');
    var r = nav ? (nav.dataset.root || '') : '';
    window.location.href = r + 'pages/dashboard.html';
  } else {
    ttOpen('login');
  }
}
function ttOpen(tab) {
  var m = document.getElementById('ttModal');
  if (!m) return;
  m.style.display = 'block';
  document.body.style.overflow = 'hidden';
  ttTab(tab || 'login');
}
function ttClose() {
  var m = document.getElementById('ttModal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') ttClose(); });

function ttTab(t) {
  ['ttPanelLogin','ttPanelSignup','ttPanelSuccess'].forEach(function(id){
    var el = document.getElementById(id); if(el) el.style.display = 'none';
  });
  var show = t==='login'?'ttPanelLogin':t==='signup'?'ttPanelSignup':'ttPanelSuccess';
  var el = document.getElementById(show); if(el) el.style.display = 'block';
  var tl = document.getElementById('ttTabLogin'), ts = document.getElementById('ttTabSignup');
  if(tl){ tl.style.color=t==='login'?'#0056d2':'#6b7280'; tl.style.borderBottom=t==='login'?'3px solid #0056d2':'3px solid transparent'; }
  if(ts){ ts.style.color=t==='signup'?'#0056d2':'#6b7280'; ts.style.borderBottom=t==='signup'?'3px solid #0056d2':'3px solid transparent'; }
  var ti = document.getElementById('ttModalTitle');
  if(ti) ti.textContent = t==='login'?'Sign in to The Tutorment':t==='signup'?'Join The Tutorment':'';

  var signupErr = document.getElementById('ttSignupErr');
  if (signupErr) { signupErr.style.display = 'none'; signupErr.textContent = ''; }
  var emailErr = document.getElementById('ttSignupEmailErr');
  if (emailErr) { emailErr.style.display = 'none'; emailErr.textContent = ''; }
  var emailInput = document.getElementById('ttSignupEmail');
  if (emailInput && !emailInput.value) { emailInput.style.borderColor = '#E2E8F0'; }
  ttEmailTouched = false;
}

/* ── LOGIN ── */
async function ttLogin() {
  var email = (document.getElementById('ttLoginEmail')||{}).value||'';
  var pass  = (document.getElementById('ttLoginPass')||{}).value||'';
  var err   = document.getElementById('ttLoginErr');
  var btn   = document.getElementById('ttLoginBtn');
  if(err) err.style.display = 'none';
  if(!email.trim()){ if(err){ err.textContent='Please enter your email address.'; err.style.display='block'; } return; }
  if(!pass){ if(err){ err.textContent='Please enter your password.'; err.style.display='block'; } return; }
  if(btn){ btn.textContent='Signing in...'; btn.disabled=true; }
  try {
    var res  = await fetch(TT_API+'/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:email.trim(), password:pass})});
    var data = await res.json();
    if(data.success){
      var userObj = data.user || {};
      if (!userObj.isLoggedIn) userObj.isLoggedIn = true;
      var tokenVal = data.token || ('local-token-' + (userObj.id || Date.now()));
      userObj.token = tokenVal;
      var userStr = JSON.stringify(userObj);
      localStorage.setItem('tt_token', tokenVal);
      localStorage.setItem('token', tokenVal);
      localStorage.setItem('tt_user', userStr);
      localStorage.setItem('currentUser', userStr);
      localStorage.setItem('tutorment_user', userStr);
      var fname = userObj.firstName ? userObj.firstName : (userObj.name ? userObj.name.split(' ')[0] : 'there');
      fname = fname.charAt(0).toUpperCase()+fname.slice(1).toLowerCase();
      var t = document.getElementById('ttSuccessTitle'); if(t) t.textContent = 'Welcome back, '+fname;
      ttTab('success');
      setTimeout(function(){
        ttClose();
        var nav = document.getElementById('main-nav');
        var r = nav ? (nav.dataset.root||'') : '';
        window.location.href = r+'pages/dashboard.html';
      }, 1200);
    } else {
      if(err){ err.textContent=data.error||'Incorrect email or password.'; err.style.display='block'; }
      if(btn){ btn.textContent='Sign in to my account'; btn.disabled=false; }
    }
  } catch(e){
    if(err){ err.textContent='Could not connect. Please try WhatsApp.'; err.style.display='block'; }
    if(btn){ btn.textContent='Sign in to my account'; btn.disabled=false; }
  }
}

/* ── COUNTRY CODE HELPER FUNCTIONS ── */
function ttUpdatePhonePrefix(code) {
  var input = document.getElementById('ttSignupPhone');
  if (!input) return;
  var val = input.value.trim();
  if (val.startsWith('+')) {
    val = val.replace(/^\+\d{1,4}\s*/, '');
    input.value = val;
  }
  input.focus();
}

function ttAutoSuggestCountry(input) {
  if (!input) return;
  // Instantly strip non-numeric characters (keep digits, spaces, hyphens, and leading + if pasted)
  var raw = input.value;
  var clean = raw.startsWith('+')
    ? '+' + raw.slice(1).replace(/[^0-9\s-]/g, '')
    : raw.replace(/[^0-9\s-]/g, '');

  if (raw !== clean) {
    input.value = clean;
  }

  var val = clean.trim();
  var select = document.getElementById('ttSignupCountryCode');
  if (!select || !val) return;

  // 1. Handle pasted or typed leading '+'
  if (val.startsWith('+')) {
    for (var i = 0; i < select.options.length; i++) {
      var optVal = select.options[i].value;
      if (optVal && val.startsWith(optVal)) {
        select.value = optVal;
        input.value = val.substring(optVal.length).trim();
        return;
      }
    }
  }

  // 2. If user types code digits directly at start (e.g. 91, 44, 1) and length > 10, strip leading code
  var currentCodeDigits = select.value.replace('+', '');
  if (currentCodeDigits && val.startsWith(currentCodeDigits) && val.length > 10) {
    input.value = val.substring(currentCodeDigits.length).trim();
  }
}

/* ── SIGNUP ── */
async function ttSignup() {
  var firstInput = document.getElementById('ttSignupFirst');
  var first = ((firstInput||{}).value||'').trim();
  var last  = ((document.getElementById('ttSignupLast')||{}).value||'').trim();
  var emailInput = document.getElementById('ttSignupEmail');
  var email = ((emailInput||{}).value||'').trim();
  var code  = ((document.getElementById('ttSignupCountryCode')||{}).value||'').trim();
  var phoneRaw = ((document.getElementById('ttSignupPhone')||{}).value||'').trim();
  var phone = phoneRaw;
  if (code && phoneRaw) {
    var codeDigits = code.replace('+', '');
    if (phoneRaw.startsWith('+')) {
      phone = phoneRaw;
    } else if (phoneRaw.startsWith(codeDigits) && phoneRaw.length > 10) {
      phone = code + ' ' + phoneRaw.substring(codeDigits.length).trim();
    } else {
      phone = code + ' ' + phoneRaw;
    }
  }
  var svc   = ((document.getElementById('ttSignupService')||{}).value||'');
  var passInput = document.getElementById('ttSignupPass');
  var pass  = ((passInput||{}).value||'').trim();
  var err   = document.getElementById('ttSignupErr');
  var btn   = document.getElementById('ttSignupBtn');
  if(err){ err.style.display='none'; err.textContent=''; }

  function showErr(msg){ if(err){ err.textContent=msg; err.style.display='block'; } }

  if(!first) {
    showErr('Please enter your first name.');
    if(firstInput) firstInput.focus();
    return;
  }

  // Strict Email Validation & Interception
  ttEmailTouched = true;
  if(!email) {
    ttValidateSignupEmail(true);
    showErr('Please enter your email address.');
    if(emailInput) emailInput.focus();
    return;
  }
  if(!ttIsValidEmail(email)) {
    ttValidateSignupEmail(true);
    showErr('Please enter a valid email address (e.g., name@gmail.com)');
    if(emailInput) emailInput.focus();
    return;
  }

  if(!pass) {
    showErr('Please set a password for your account.');
    if(passInput) passInput.focus();
    return;
  }
  if(pass.length < 6) {
    showErr('Password must be at least 6 characters.');
    if(passInput) passInput.focus();
    return;
  }

  if(btn){ btn.textContent='Creating account...'; btn.disabled=true; }
  var slowTimer = setTimeout(function(){ if(btn&&btn.disabled) btn.textContent='Almost there — server starting...'; }, 5000);

  try {
    var res  = await fetch(TT_API+'/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({firstName:first, lastName:last, email:email, phone:phone, service:svc, password:pass})
    });
    var data = await res.json();
    clearTimeout(slowTimer);
    if(data.success){
      var userObj = data.user || { firstName: first, lastName: last, email: email, service: svc };
      if (!userObj.isLoggedIn) userObj.isLoggedIn = true;
      var tokenVal = data.token || ('local-token-' + (userObj.id || Date.now()));
      userObj.token = tokenVal;
      var userStr = JSON.stringify(userObj);
      localStorage.setItem('tt_token', tokenVal);
      localStorage.setItem('token', tokenVal);
      localStorage.setItem('tt_user', userStr);
      localStorage.setItem('currentUser', userStr);
      localStorage.setItem('tutorment_user', userStr);
      var fname = first.charAt(0).toUpperCase()+first.slice(1).toLowerCase();
      var t = document.getElementById('ttSuccessTitle'); if(t) t.textContent='Welcome, '+fname+'. Your account is ready.';
      ttTab('success');
      setTimeout(function(){
        ttClose();
        var nav = document.getElementById('main-nav');
        var r = nav ? (nav.dataset.root||'') : '';
        window.location.href = r+'pages/dashboard.html';
      }, 1500);
    } else {
      showErr(data.error||'Could not create account. Please try again.');
      if(btn){ btn.textContent='Create account and Book a Free Consultation'; btn.disabled=false; }
    }
  } catch(e){
    clearTimeout(slowTimer);
    showErr('Connection error. Please check your internet and try again.');
    if(btn){ btn.textContent='Create account and Book a Free Consultation'; btn.disabled=false; }
  }
}

/* ── SEARCH ── */
function ttSearch() {
  var nav = document.getElementById('main-nav');
  var r = nav ? (nav.dataset.root||'') : '';
  var q = ((document.getElementById('ttSrch')||{}).value||'').toLowerCase().trim();
  if(!q) return;
  if(q.includes('hcpc'))                           location.href=r+'pages/international.html?c=uk#uk-hcpc';
  else if(q.includes('nmc')||q.includes('nurs'))   location.href=r+'pages/international.html?c=uk#uk-nmc';
  else if(q.includes('sqe')||q.includes('solicitor')||q.includes('law')) location.href=r+'pages/international.html?c=uk#uk-sqe';
  else if(q.includes('eligible'))                  location.href=r+'pages/eligibility.html';
  else if(q.includes('salary')||q.includes('lpa')) location.href=r+'pages/salary-calculator.html';
  else if(q.includes('blog')||q.includes('guide')) location.href=r+'pages/blog.html';
  else if(q.includes('dashboard'))                 location.href=r+'pages/dashboard.html';
  else if(q.includes('phd')||q.includes('doctor')) location.href=r+'pages/phd-guide.html';
  else if(q.includes('psw')||q.includes('post study')) location.href=r+'pages/psw.html';
  else if(q.includes('usa')||q.includes('h1b'))    location.href=r+'pages/international.html?c=usa';
  else if(q.includes('canada')||q.includes('pgwp'))location.href=r+'pages/international.html?c=canada';
  else if(q.includes('australia'))                 location.href=r+'pages/international.html?c=australia';
  else if(q.includes('germany'))                   location.href=r+'pages/international.html?c=germany';
  else if(q.includes('singapore'))                 location.href=r+'pages/international.html?c=singapore';
  else if(q.includes('ireland'))                   location.href=r+'pages/international.html?c=ireland';
  else if(q.includes('visa'))                      location.href=r+'pages/visas.html';
  else if(q.includes('teach')||q.includes('qts'))  location.href=r+'pages/international.html?c=uk#uk-teaching';
  else if(q.includes('job')||q.includes('sponsor'))location.href=r+'pages/international.html?c=uk#uk-jobs';
  else if(q.includes('placement')||q.includes('campus')) location.href=r+'pages/india.html#placement';
  else if(q.includes('university'))                location.href=r+'pages/university-guide.html';
  else                                             location.href=r+'pages/international.html';
}

/* ── FALLBACK NAV (if main fails) ── */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var nav = document.getElementById('main-nav');
    if (nav && !nav.querySelector('.nav-inner')) {
      var r = nav.dataset.root || '';
      nav.style.cssText = 'position:sticky;top:0;z-index:300;background:#fff;border-bottom:1px solid #E4E7EC;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px;font-family:Inter,sans-serif';
      nav.innerHTML =
        '<a href="' + r + '" style="font-weight:700;font-size:16px;color:#0A2E73;text-decoration:none">The Tutorment</a>' +
        '<div style="display:flex;gap:12px;align-items:center">' +
          '<a href="' + r + 'pages/international.html" style="font-size:13px;color:#374151;text-decoration:none">International</a>' +
          '<a href="' + r + 'pages/india.html" style="font-size:13px;color:#374151;text-decoration:none">India</a>' +
          '<a href="' + r + 'pages/eligibility.html" style="font-size:13px;font-weight:600;color:#0A2E73;text-decoration:none">Free Report</a>' +
          '<a href="' + r + 'pages/contact.html" style="font-size:13px;font-weight:700;color:#fff;background:#0A2E73;padding:8px 16px;border-radius:5px;text-decoration:none">Book Session</a>' +
        '</div>';
    }
  }, 500);
});
