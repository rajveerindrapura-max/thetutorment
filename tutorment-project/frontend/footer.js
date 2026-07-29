try{
document.addEventListener('DOMContentLoaded', function() {
  try {
  const f = document.getElementById('site-footer');
  if (!f) return;
  const root = f.dataset.root || '';
  f.innerHTML = `
  <div style="max-width:1160px;margin:0 auto;padding:52px 24px 0">
    <div style="display:grid;grid-template-columns:280px 1fr 1fr 1fr;gap:48px;padding-bottom:44px;border-bottom:1px solid rgba(255,255,255,.08)">

      <!-- Brand column -->
      <div>
        <div style="margin-bottom:20px">
          <img src="${root}TT_Logo_White_Bg.png" alt="The Tutorment"
            style="height:28px;width:auto;display:block;border-radius:4px">
        </div>
        <p style="font-size:13.5px;line-height:1.75;color:rgba(255,255,255,.5);margin-bottom:24px;font-family:'Inter',sans-serif">
          Career counselling, professional registration, upskilling and admissions.
          India and internationally.
        </p>
        <div style="display:flex;gap:10px">
          <a href="https://www.instagram.com/thetutorment/" target="_blank" aria-label="Instagram"
            style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);transition:all .15s;text-decoration:none"
            onmouseover="this.style.background='rgba(255,255,255,.16)';this.style.color='#fff'"
            onmouseout="this.style.background='rgba(255,255,255,.08)';this.style.color='rgba(255,255,255,.55)'">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://www.facebook.com/people/The-TutorMent/61580670887113/" target="_blank" aria-label="Facebook"
            style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);transition:all .15s;text-decoration:none"
            onmouseover="this.style.background='rgba(255,255,255,.16)';this.style.color='#fff'"
            onmouseout="this.style.background='rgba(255,255,255,.08)';this.style.color='rgba(255,255,255,.55)'">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.linkedin.com/company/thetutorment/" target="_blank" aria-label="LinkedIn"
            style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);transition:all .15s;text-decoration:none"
            onmouseover="this.style.background='rgba(255,255,255,.16)';this.style.color='#fff'"
            onmouseout="this.style.background='rgba(255,255,255,.08)';this.style.color='rgba(255,255,255,.55)'">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://www.youtube.com/@thetutorment" target="_blank" aria-label="YouTube"
            style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);transition:all .15s;text-decoration:none"
            onmouseover="this.style.background='rgba(255,255,255,.16)';this.style.color='#fff'"
            onmouseout="this.style.background='rgba(255,255,255,.08)';this.style.color='rgba(255,255,255,.55)'">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="https://wa.me/919057054077" target="_blank" aria-label="WhatsApp"
            style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);transition:all .15s;text-decoration:none"
            onmouseover="this.style.background='rgba(37,211,102,.15)';this.style.color='#25d366'"
            onmouseout="this.style.background='rgba(255,255,255,.08)';this.style.color='rgba(255,255,255,.55)'">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>

      <!-- International -->
      <div>
        <h5 style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:18px;font-family:'Manrope','Inter',sans-serif">International</h5>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
          <li><a href="${root}pages/international.html?c=uk#uk-hcpc" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s;font-family:'Inter',sans-serif"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">HCPC Registration</a></li>
          <li><a href="${root}pages/international.html?c=uk#uk-nmc" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">NMC Registration</a></li>
          <li><a href="${root}pages/international.html?c=uk#uk-sqe" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">SQE Registration</a></li>
          <li><a href="${root}pages/international.html?c=uk#uk-jobs" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Sponsored Jobs UK</a></li>
          <li><a href="${root}pages/international.html?c=uk#uk-phd" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">PhD and Scholarships</a></li>
          <li><a href="${root}pages/international.html?c=uk#uk-teaching" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Teaching in the UK</a></li>
          <li><a href="${root}pages/international.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">University Admissions</a></li>
          <li><a href="${root}pages/blog.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Career Guides</a></li>
        </ul>
      </div>

      <!-- India -->
      <div>
        <h5 style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:18px;font-family:'Manrope','Inter',sans-serif">India</h5>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
          <li><a href="${root}pages/india.html#placement" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Campus Placement</a></li>
          <li><a href="${root}pages/india.html#upskilling" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Professional Upskilling</a></li>
          <li><a href="${root}pages/india.html#jobs" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Job Applications</a></li>
          <li><a href="${root}pages/india.html#salary" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Salary Enhancement</a></li>
          <li><a href="${root}pages/salary-calculator.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Salary Calculator</a></li>
          <li><a href="${root}pages/eligibility.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Am I Eligible?</a></li>
        </ul>
      </div>

      <!-- Company -->
      <div>
        <h5 style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:18px;font-family:'Manrope','Inter',sans-serif">Company</h5>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
          <li><a href="${root}pages/about.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">About Us</a></li>
          <li><a href="${root}pages/results.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Student Results</a></li>
          <li><a href="${root}pages/contact.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Contact Us</a></li>
          <li><a href="${root}pages/dashboard.html" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">My Dashboard</a></li>
          <li><a href="mailto:support@thetutorment.com" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">support@thetutorment.com</a></li><li>3, Waterloo Road, Upton Park, London E6 1AP</li>
          <li><a href="https://wa.me/919057054077" target="_blank" style="font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.5)'">+91 90570 54077</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:20px 0;font-size:12px;color:rgba(255,255,255,.25)">
      <span style="font-family:'Inter',sans-serif">2026 The Tutorment. Career counselling.</span>
      <div style="display:flex;gap:16px">
        <a href="#" style="color:rgba(255,255,255,.25);text-decoration:none;transition:color .15s"
          onmouseover="this.style.color='rgba(255,255,255,.6)'" onmouseout="this.style.color='rgba(255,255,255,.25)'">Privacy</a>
        <a href="#" style="color:rgba(255,255,255,.25);text-decoration:none;transition:color .15s"
          onmouseover="this.style.color='rgba(255,255,255,.6)'" onmouseout="this.style.color='rgba(255,255,255,.25)'">Terms</a>
        <a href="#" style="color:rgba(255,255,255,.25);text-decoration:none;transition:color .15s"
          onmouseover="this.style.color='rgba(255,255,255,.6)'" onmouseout="this.style.color='rgba(255,255,255,.25)'">Cookies</a>
      </div>
    </div>
  </div>
  `;

  // Responsive: stack on mobile
  var inner = f.querySelector('[style*="grid-template-columns:280px"]');
  function handleResize(){
    if(!inner) return;
    if(window.innerWidth < 900){
      inner.style.gridTemplateColumns = '1fr 1fr';
      inner.style.gap = '32px';
    } else if(window.innerWidth < 640){
      inner.style.gridTemplateColumns = '1fr';
    } else {
      inner.style.gridTemplateColumns = '280px 1fr 1fr 1fr';
      inner.style.gap = '48px';
    }
  }
  handleResize();
  window.addEventListener('resize', handleResize);

  } catch(e) {
    /* Footer JS failed — inject minimal fallback */
    var footerEl = document.getElementById('site-footer');
    if (footerEl) {
      footerEl.style.cssText = 'background:#0A2E73;color:#fff;padding:32px 24px;text-align:center';
      footerEl.innerHTML = '<div style="font-size:14px;font-weight:600;margin-bottom:8px">The Tutorment</div>'
        + '<div style="font-size:13px;color:rgba(255,255,255,.7)">3, Waterloo Road, Upton Park, London E6 1AP &nbsp;·&nbsp; support@thetutorment.com &nbsp;·&nbsp; +91 90570 54077 &nbsp;·&nbsp; thetutorment.com</div>';
    }
  }
});
}catch(e){}