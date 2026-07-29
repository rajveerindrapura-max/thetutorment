/* THE TUTORMENT — nav.js v3 */

var TT_API = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://tutorment-backend-wjew.onrender.com/api';

/* Pre-warm Render backend on page load */
setTimeout(function(){ fetch(TT_API + '/').catch(function(){}); }, 2000);

document.addEventListener('DOMContentLoaded', function () {
  var nav = document.getElementById('main-nav');
  if (!nav) return;
  var r = nav.dataset.root || '';

  /* ── NAV HTML ── */
  nav.innerHTML =
    '<div class="nav-inner">' +
      '<a href="' + r + '" class="nav-logo"><img src="' + r + 'TT_Logo_SVG.svg" alt="The Tutorment" width="160" height="40"></a>' +
      '<div class="nav-links">' +

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
            '<a href="' + r + 'pages/eligibility.html" style="font-weight:700;color:#0056d2">Am I eligible? Free check</a>' +
            '<a href="' + r + 'pages/salary-calculator.html">Salary calculator</a>' +
            '<a href="' + r + 'pages/blog.html">Career guides</a>' +
            '<a href="' + r + 'pages/dashboard.html">My dashboard</a>' +
          '</div>' +
        '</div>' +

        '<div class="nav-dd"><a href="' + r + 'pages/about.html" class="nav-dt" style="text-decoration:none">About</a></div>' +
        '<div class="nav-dd"><a href="' + r + 'pages/results.html" class="nav-dt" style="text-decoration:none">Results</a></div>' +

      '</div>' +

      /* Search — hidden when logged in via JS */
      '<div class="nav-sw" id="tt-nav-sw" role="search">' +
        '<input type="search" id="ttSrch" placeholder="Search..." autocomplete="off" name="q" x-search="1" aria-label="Search The Tutorment" onkeydown="if(event.key===\'Enter\')ttSearch()">' +
        '<button onclick="ttSearch()" aria-label="Search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>' +
      '</div>' +

      /* Actions — Sign in shown when logged out, user avatar when logged in */
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
      '<a href="' + r + 'pages/eligibility.html">Am I eligible? Free check</a>' +
      '<a href="' + r + 'pages/salary-calculator.html">Salary calculator</a>' +
      '<a href="' + r + 'pages/blog.html">Career guides</a>' +
      '<a href="' + r + 'pages/about.html">About Us</a>' +
      '<a href="' + r + 'pages/results.html">Results</a>' +
      '<a href="' + r + 'pages/contact.html" class="mob-cta">Contact us</a>' +
    '</div>';

  /* ── MODAL ── */
  var m = document.createElement('div');
  m.id = 'ttModal';
  m.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.65);z-index:99999;overflow-y:auto;padding:50px 16px 40px;box-sizing:border-box';
  m.onclick = function(e){ if(e.target===m) ttClose(); };
  m.innerHTML =
    '<div style="background:#fff;border-radius:10px;width:100%;max-width:420px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid #e2e2e2">' +
        '<h3 id="ttModalTitle" style="font-size:17px;font-weight:700;color:#1f1f1f;margin:0">Sign in to The Tutorment</h3>' +
        '<button onclick="ttClose()" aria-label="Close" style="width:30px;height:30px;border-radius:50%;border:1px solid #e2e2e2;background:#f5f5f5;font-size:18px;cursor:pointer;line-height:1">&times;</button>' +
      '</div>' +
      '<div style="display:flex;border-bottom:1px solid #e2e2e2">' +
        '<button id="ttTabLogin" onclick="ttTab(\'login\')" style="flex:1;padding:13px;font-size:14px;font-weight:600;background:none;border:none;border-bottom:3px solid #0A2E73;color:#0A2E73;cursor:pointer;font-family:inherit">Sign in</button>' +
        '<button id="ttTabSignup" onclick="ttTab(\'signup\')" style="flex:1;padding:13px;font-size:14px;font-weight:600;background:none;border:none;border-bottom:3px solid transparent;color:#6b7280;cursor:pointer;font-family:inherit">Join for free</button>' +
      '</div>' +
      '<div style="padding:22px">' +
        /* LOGIN PANEL */
        '<div id="ttPanelLogin">' +
          '<div style="margin-bottom:14px"><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">Email address</label>' +
          '<input id="ttLoginEmail" type="email" placeholder="you@example.com" autocomplete="off" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;box-sizing:border-box;font-family:inherit"></div>' +
          '<div style="margin-bottom:14px"><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">Password</label>' +
          '<input id="ttLoginPass" type="password" placeholder="Your password" autocomplete="off" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;box-sizing:border-box;font-family:inherit"></div>' +
          '<p id="ttLoginErr" style="font-size:13px;color:#dc2626;margin-bottom:8px;display:none"></p>' +
          '<button id="ttLoginBtn" onclick="ttLogin()" style="width:100%;font-size:15px;font-weight:700;padding:12px;border-radius:6px;background:#0A2E73;color:#fff;border:none;cursor:pointer;font-family:inherit;margin-bottom:12px">Sign in to my account</button>' +
          '<p style="font-size:12.5px;color:#6b7280;text-align:center;line-height:1.8">' +
            '<a href="#" onclick="ttTab(\'signup\');return false" style="color:#1E88E5">New here? Join for free</a>' +
            ' &nbsp;&middot;&nbsp; ' +
            '<a href="#" onclick="alert(\'Email support@thetutorment.com\');return false" style="color:#1E88E5">Forgot password?</a>' +
          '</p>' +
          '<div style="display:flex;align-items:center;gap:10px;margin:14px 0"><div style="flex:1;height:1px;background:#e2e2e2"></div><span style="font-size:12px;color:#9ca3af">or</span><div style="flex:1;height:1px;background:#e2e2e2"></div></div>' +
          '<a href="https://wa.me/919057054077" target="_blank" style="width:100%;font-size:14px;font-weight:600;padding:10px;border:1.5px solid #e2e2e2;border-radius:5px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;text-decoration:none;color:#1f1f1f;box-sizing:border-box">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>' +
            'Contact us on WhatsApp' +
          '</a>' +
        '</div>' +
        /* SIGNUP PANEL */
        '<div id="ttPanelSignup" style="display:none">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">' +
            '<div><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">First name</label><input id="ttSignupFirst" type="text" placeholder="First name" autocomplete="given-name" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;box-sizing:border-box;font-family:inherit"></div>' +
            '<div><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">Last name</label><input id="ttSignupLast" type="text" placeholder="Last name" autocomplete="family-name" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;box-sizing:border-box;font-family:inherit"></div>' +
          '</div>' +
          '<div style="margin-bottom:14px"><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">Email address</label><input id="ttSignupEmail" type="email" placeholder="you@example.com" autocomplete="off" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;box-sizing:border-box;font-family:inherit"></div>' +
          '<div style="margin-bottom:14px"><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">Phone or WhatsApp</label><input id="ttSignupPhone" type="tel" placeholder="+44 or +91" autocomplete="tel" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;box-sizing:border-box;font-family:inherit"></div>' +
          '<div style="margin-bottom:14px"><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">What do you need help with?</label>' +
          '<select id="ttSignupService" aria-label="What do you need help with" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;background:#fff;box-sizing:border-box;font-family:inherit">' +
            '<option value="">Select one</option>' +
            '<option value="hcpc">HCPC Registration</option>' +
            '<option value="nmc">NMC Registration</option>' +
            '<option value="jobs-uk">Sponsored Job Search UK</option>' +
            '<option value="teaching">Teaching in UK</option>' +
            '<option value="phd">Funded PhD or Scholarship</option>' +
            '<option value="psw">Post Study Work Visa</option>' +
            '<option value="placement">Campus Placement India</option>' +
            '<option value="salary">Salary Enhancement India</option>' +
            '<option value="jobs-in">Job Applications India</option>' +
            '<option value="upskilling">Professional Upskilling</option>' +
            '<option value="other">Not sure yet</option>' +
          '</select></div>' +
          '<div style="margin-bottom:14px"><label style="display:block;font-size:13px;font-weight:600;color:#1f1f1f;margin-bottom:6px">Set a password</label><input id="ttSignupPass" type="password" placeholder="Min 6 characters" autocomplete="new-password" style="width:100%;font-size:14px;padding:10px 13px;border:1.5px solid #e2e2e2;border-radius:5px;outline:none;box-sizing:border-box;font-family:inherit"></div>' +
          '<p id="ttSignupErr" style="font-size:13px;color:#dc2626;margin-bottom:8px;display:none"></p>' +
          '<button id="ttSignupBtn" onclick="ttSignup()" style="width:100%;font-size:15px;font-weight:700;padding:12px;border-radius:6px;background:#0A2E73;color:#fff;border:none;cursor:pointer;font-family:inherit;margin-bottom:10px">Create account and book free session</button>' +
          '<p style="font-size:12px;color:#6b7280;text-align:center;line-height:1.6">First session always free. No card required. <a href="#" onclick="ttTab(\'login\');return false" style="color:#0A2E73;font-weight:600">Already have an account?</a></p>' +
        '</div>' +
        /* SUCCESS PANEL */
        '<div id="ttPanelSuccess" style="display:none;text-align:center;padding:20px 0">' +
          '<div style="font-size:52px;margin-bottom:14px;color:#0056d2">&#10003;</div>' +
          '<div id="ttSuccessTitle" style="font-size:18px;font-weight:700;color:#1f1f1f;margin-bottom:10px">Welcome to The Tutorment</div>' +
          '<p style="font-size:14px;color:#6b7280;line-height:1.65">Redirecting to your dashboard...</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(m);

  /* ── UPDATE NAV FOR LOGIN STATE ── runs 150ms after DOM ready */
  setTimeout(function(){
    var token   = localStorage.getItem('tt_token');
    var userStr = localStorage.getItem('tt_user');
    var siBtn   = document.getElementById('tt-btn-si');
    var userMenu= document.getElementById('tt-user-menu');
    var navSw   = document.getElementById('tt-nav-sw');

    if(token && userStr){
      try {
        var u = JSON.parse(userStr);
        /* Proper case name */
        var fname = (u.firstName||'');
        var lname = (u.lastName||'');
        fname = fname ? fname.charAt(0).toUpperCase()+fname.slice(1).toLowerCase() : '';
        lname = lname ? lname.charAt(0).toUpperCase()+lname.slice(1).toLowerCase() : '';
        var fullName = (fname+(lname?' '+lname:'')).trim()||'Account';
        var initials = (fname.charAt(0)+(lname.charAt(0)||fname.charAt(1)||'')).toUpperCase()||'U';

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

});

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
  localStorage.removeItem('tt_user');
  localStorage.removeItem('tt_elig_user');
  window.location.reload();
}

/* ── MODAL CONTROLS ── */
function ttOpenOrDash() {
  var token = localStorage.getItem('tt_token');
  if (token) {
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
      localStorage.setItem('tt_token', data.token);
      localStorage.setItem('tt_user', JSON.stringify(data.user));
      var fname = data.user && data.user.firstName ? data.user.firstName : 'there';
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

/* ── SIGNUP ── */
async function ttSignup() {
  var first = ((document.getElementById('ttSignupFirst')||{}).value||'').trim();
  var last  = ((document.getElementById('ttSignupLast')||{}).value||'').trim();
  var email = ((document.getElementById('ttSignupEmail')||{}).value||'').trim();
  var phone = ((document.getElementById('ttSignupPhone')||{}).value||'').trim();
  var svc   = ((document.getElementById('ttSignupService')||{}).value||'');
  var pass  = ((document.getElementById('ttSignupPass')||{}).value||'').trim();
  var err   = document.getElementById('ttSignupErr');
  var btn   = document.getElementById('ttSignupBtn');
  if(err){ err.style.display='none'; err.textContent=''; }

  function showErr(msg){ if(err){ err.textContent=msg; err.style.display='block'; } }

  if(!first)         { showErr('Please enter your first name.'); return; }
  if(!email)         { showErr('Please enter your email address.'); return; }
  if(!email.includes('@')){ showErr('Please enter a valid email address.'); return; }
  if(!pass)          { showErr('Please set a password for your account.'); return; }
  if(pass.length < 6){ showErr('Password must be at least 6 characters.'); return; }

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
      localStorage.setItem('tt_token', data.token);
      localStorage.setItem('tt_user', JSON.stringify(data.user));
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
      if(btn){ btn.textContent='Create account and book free session'; btn.disabled=false; }
    }
  } catch(e){
    clearTimeout(slowTimer);
    showErr('Connection error. Please check your internet and try again.');
    if(btn){ btn.textContent='Create account and book free session'; btn.disabled=false; }
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
