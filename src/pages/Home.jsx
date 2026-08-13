<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AutoimmuneVoices — Polished Homepage Mockup</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #2B2A28;
    --navy: #1B2A4A;
    --amber: #A87C2A;
    --body: #5A5952;
    --muted: #8A8880;
    --line: #E4E0D6;
    --line-strong: #C9C4B4;
    --paper: #FAF8F3;
    --tint: #F2EEE3;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--ink);
    background: var(--paper);
    line-height: 1.5;
  }
  h1, h2, h3 { font-family: "Fraunces", Georgia, serif; margin: 0; }
  a { color: inherit; }

  /* ---------- reveal-on-scroll (respects reduced motion) ---------- */
  .reveal {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
    * { animation: none !important; transition-duration: 0.01ms !important; }
  }

  /* ---------- nav ---------- */
  header.site-nav {
    border-bottom: 1px solid var(--line);
    padding: 16px 24px;
    background: #FAF8F3;
    position: sticky;
    top: 0;
    z-index: 40;
  }
  .nav-inner {
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .brand {
    font-family: "Fraunces", serif;
    font-weight: 600;
    font-size: 18px;
    color: var(--navy);
    text-decoration: none;
  }
  .nav-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .nav-links a {
    position: relative;
    font-size: 14px;
    color: var(--body);
    text-decoration: none;
    padding-bottom: 4px;
  }
  .nav-links a::after {
    content: "";
    position: absolute;
    left: 0; right: 100%;
    bottom: 0;
    height: 2px;
    background: var(--amber);
    transition: right 0.25s ease;
  }
  .nav-links a:hover::after,
  .nav-links a.active::after {
    right: 0;
  }
  .nav-links a.active { color: var(--navy); font-weight: 600; }

  /* ---------- hero ---------- */
  .hero { max-width: 1120px; margin: 0 auto; padding: 88px 24px 64px; }
  .eyebrow {
    font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--amber); font-weight: 500; margin-bottom: 20px; display: block;
  }
  .hero h1 {
    font-weight: 500; font-size: clamp(30px, 4.6vw, 50px); line-height: 1.08;
    color: var(--navy); max-width: 780px; letter-spacing: -0.01em;
  }
  .hero p.lede { font-size: 17px; line-height: 1.65; color: var(--body); max-width: 560px; margin-top: 24px; }
  .hero-ctas { display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500;
    color: var(--paper); background: var(--navy); padding: 13px 22px; border-radius: 3px;
    text-decoration: none; transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(27,42,74,0.18); }
  .btn-secondary {
    display: inline-flex; align-items: center; font-size: 14px; font-weight: 500; color: var(--navy);
    padding: 13px 22px; border: 1px solid var(--line-strong); border-radius: 3px; text-decoration: none;
    transition: border-color 0.18s ease, transform 0.18s ease;
  }
  .btn-secondary:hover { border-color: var(--amber); transform: translateY(-2px); }

  /* ---------- stats (count-up) ---------- */
  .stats-section { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .stats-grid {
    max-width: 1120px; margin: 0 auto; padding: 36px 24px;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 24px;
  }
  .stat-num { font-family: "Fraunces", serif; font-size: 32px; color: var(--navy); font-weight: 500; }
  .stat-label { font-size: 13px; color: #6B6A64; margin-top: 4px; }

  /* ---------- values strip ---------- */
  .values {
    max-width: 1120px; margin: 0 auto; padding: 28px 24px;
    display: flex; gap: 32px; flex-wrap: wrap; justify-content: center;
  }
  .values span { font-size: 13px; letter-spacing: 0.04em; color: var(--muted); }
  .values .dot { margin-left: 32px; color: #D8D4C6; }

  /* ---------- process ---------- */
  .process { max-width: 1120px; margin: 0 auto; padding: 72px 24px; }
  .process h2 { font-size: 28px; color: var(--navy); font-weight: 500; margin-bottom: 44px; }
  .process-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; }
  .process-item {
    padding: 20px; border-radius: 6px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .process-item:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(27,42,74,0.08); }
  .process-n { font-family: "Fraunces", serif; font-size: 15px; color: var(--amber); margin-bottom: 10px; }
  .process-item h3 { font-size: 17px; font-weight: 600; color: var(--navy); margin-bottom: 10px; }
  .process-item p { font-size: 14.5px; line-height: 1.65; color: var(--body); margin: 0; }

  /* ---------- legislation cards + skeleton ---------- */
  .legislation { background: var(--tint); padding: 72px 24px; }
  .legislation-inner { max-width: 1120px; margin: 0 auto; }
  .legislation-head {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 44px; flex-wrap: wrap; gap: 12px;
  }
  .legislation-head h2 { font-size: 28px; color: var(--navy); font-weight: 500; }
  .legislation-head span { font-size: 13px; color: var(--muted); }
  .bill-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
  .bill-card {
    background: var(--paper); border: 1px solid var(--line); border-radius: 4px; padding: 24px 22px;
    display: flex; flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .bill-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(27,42,74,0.1);
    border-color: var(--line-strong);
  }
  .bill-tag { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--amber); font-weight: 500; }
  .bill-card h3 { font-size: 16px; font-weight: 600; color: var(--navy); margin: 10px 0; }
  .bill-card p { font-size: 14px; line-height: 1.6; color: var(--body); margin-bottom: 16px; flex: 1; }
  .bill-card .read-link {
    font-size: 13px; font-weight: 500; color: var(--navy); text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px; margin-top: auto;
  }

  /* skeleton loading state */
  .skeleton-card {
    background: var(--paper); border: 1px solid var(--line); border-radius: 4px; padding: 24px 22px;
  }
  .skeleton-line {
    height: 12px; border-radius: 3px; margin-bottom: 12px;
    background: linear-gradient(90deg, #ECE7DA 25%, #F5F2E9 37%, #ECE7DA 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
  }
  @keyframes shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }
  .skeleton-line.w-40 { width: 40%; }
  .skeleton-line.w-80 { width: 80%; }
  .skeleton-line.w-100 { width: 100%; }
  .skeleton-line.w-60 { width: 60%; }
  .skeleton-line.tag { height: 9px; width: 90px; margin-bottom: 16px; }

  /* ---------- spotlight ---------- */
  .spotlight { max-width: 900px; margin: 0 auto; padding: 80px 24px; text-align: center; }
  .spotlight blockquote {
    font-family: "Fraunces", serif; font-size: clamp(20px, 3vw, 26px); line-height: 1.5;
    color: var(--navy); font-style: italic; margin: 0;
  }
  .spotlight cite {
    display: block; font-size: 13px; color: var(--muted); margin-top: 20px;
    letter-spacing: 0.03em; font-style: normal;
  }

  /* ---------- CTA ---------- */
  .cta { border-top: 1px solid var(--line); padding: 56px 24px; }
  .cta-inner { max-width: 640px; margin: 0 auto; text-align: center; }
  .cta h2 { font-size: 24px; color: var(--navy); font-weight: 500; margin-bottom: 12px; }
  .cta p { font-size: 14.5px; color: var(--body); margin-bottom: 24px; }

  /* ---------- footer ---------- */
  footer.site-footer { border-top: 1px solid var(--line); background: var(--navy); color: #D8DAE0; padding: 48px 24px 32px; }
  .footer-grid {
    max-width: 1120px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px;
  }
  .footer-grid .brand-foot { font-family: "Fraunces", serif; font-size: 17px; color: var(--paper); margin-bottom: 10px; }
  .footer-grid p { font-size: 13px; line-height: 1.6; color: #A9ADBB; margin: 0; }
  .footer-col-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #7C8199; margin-bottom: 12px; }
  .footer-grid a { display: block; font-size: 13.5px; color: #D8DAE0; text-decoration: none; margin-bottom: 8px; }
  .footer-bottom {
    max-width: 1120px; margin: 40px auto 0; padding-top: 20px; border-top: 1px solid #2E3B5C;
    font-size: 12px; color: #7C8199;
  }

  .mockup-note {
    max-width: 1120px; margin: 0 auto; padding: 14px 24px;
    background: #FFF7E6; border-bottom: 1px solid #EAD9A8; font-size: 13px; color: #6B4F0F;
    text-align: center;
  }
</style>
</head>
<body>

<div class="mockup-note">This is a mockup — hover the bill cards, scroll slowly, and watch the stats count up. All motion here respects "reduce motion" accessibility settings.</div>

<header class="site-nav">
  <div class="nav-inner">
    <a class="brand" href="#">AutoimmuneVoices</a>
    <nav class="nav-links">
      <a href="#" class="active">Home</a>
      <a href="#">Legislation</a>
      <a href="#">Resource Library</a>
      <a href="#">Start a Chapter</a>
      <a href="#">Events</a>
      <a href="#">Impact</a>
      <a href="#">Brainstorm</a>
    </nav>
  </div>
</header>

<section class="hero">
  <span class="eyebrow">Advocacy for autoimmune and chronic disease patients</span>
  <h1>Shaping the policies around autoimmune diseases. Our conditions. Our voices. Policies that matter.</h1>
  <p class="lede">AutoimmuneVoices tracks the legislation that actually affects your diagnosis, translates it out of legal language, and connects you with Congress.</p>
  <div class="hero-ctas">
    <a class="btn-primary" href="#">See tracked legislation →</a>
    <a class="btn-secondary" href="#">How it works</a>
  </div>
</section>

<section class="stats-section">
  <div class="stats-grid">
    <div><div class="stat-num" data-target="212">0</div><div class="stat-label">Bills tracked</div></div>
    <div><div class="stat-num" data-target="146">0</div><div class="stat-label">Conditions covered</div></div>
    <div><div class="stat-num" data-target="49">0</div><div class="stat-label">States + federal</div></div>
    <div><div class="stat-num" data-target="87">0</div><div class="stat-label">Letters sent</div></div>
  </div>
</section>

<section class="values">
  <span>Patient-led<span class="dot">·</span></span>
  <span>Evidence-based<span class="dot">·</span></span>
  <span>Nonpartisan<span class="dot">·</span></span>
  <span>Actionable</span>
</section>

<section class="process reveal">
  <h2>How it works</h2>
  <div class="process-grid">
    <div class="process-item">
      <div class="process-n">01</div>
      <h3>Track</h3>
      <p>We monitor federal and state bills that affect people living with autoimmune and chronic conditions, and translate the legal language into plain terms.</p>
    </div>
    <div class="process-item">
      <div class="process-n">02</div>
      <h3>Act</h3>
      <p>Patients read the plain-language summary, see who represents them, and send a message directly to their legislator in minutes.</p>
    </div>
    <div class="process-item">
      <div class="process-n">03</div>
      <h3>Amplify</h3>
      <p>Every message sent and every vote cast is counted in public, so legislators see the size of the community behind each bill.</p>
    </div>
  </div>
</section>

<section class="legislation reveal">
  <div class="legislation-inner">
    <div class="legislation-head">
      <h2>Legislation we're tracking</h2>
      <span>119th Congress, 2025–2026</span>
    </div>
    <div class="bill-grid" id="bill-grid">
      <!-- skeleton cards inserted by JS, then swapped for real cards -->
    </div>
  </div>
</section>

<section class="spotlight reveal">
  <blockquote>"I was diagnosed at five. Testifying in front of legislators who write the rules for my medical foods was the first time I felt like my diagnosis had a seat in the room."</blockquote>
  <cite>Patient advocate, Washington State delegate</cite>
</section>

<section class="cta reveal">
  <div class="cta-inner">
    <h2>Send a letter about a bill that affects you</h2>
    <p>Takes about two minutes. We draft it, you review it, your legislator reads it.</p>
    <a class="btn-primary" href="#">✉ Draft my letter</a>
  </div>
</section>

<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <div class="brand-foot">AutoimmuneVoices</div>
      <p>A nonpartisan advocacy platform for patients navigating autoimmune and chronic disease policy.</p>
    </div>
    <div>
      <div class="footer-col-label">Explore</div>
      <a href="#">Legislation</a>
      <a href="#">How it works</a>
      <a href="#">Stories</a>
      <a href="#">About</a>
    </div>
    <div>
      <div class="footer-col-label">Contact</div>
      <a href="mailto:autoimmunevoices@gmail.com">autoimmunevoices@gmail.com</a>
    </div>
  </div>
  <div class="footer-bottom">© 2026 AutoimmuneVoices</div>
</footer>

<script>
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- scroll reveal ----------
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---------- count-up stats ----------
  const statEls = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (reduceMotion) {
      el.textContent = target.toLocaleString();
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }
  const statsIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsIo.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => statsIo.observe(el));

  // ---------- skeleton -> real bill cards ----------
  const BILLS = [
    {
      tag: "Insurance coverage",
      title: "Medical foods and gluten-free labeling coverage",
      body: "Would require insurers to treat prescribed medical foods for diagnosed conditions the same as other prescribed treatments.",
    },
    {
      tag: "Research funding",
      title: "Autoimmune disease research investment",
      body: "Directs additional NIH funding toward early diagnosis and treatment research for autoimmune and chronic gastrointestinal conditions.",
    },
    {
      tag: "Food safety",
      title: "Celiac Safety Act of 2026",
      body: "Would amend federal food labeling law to formally classify gluten-containing grain as a major food allergen, giving celiac patients the same labeling protections as other allergen groups.",
    },
  ];

  const grid = document.getElementById("bill-grid");

  // show skeletons first
  grid.innerHTML = BILLS.map(
    () => `
      <div class="skeleton-card">
        <div class="skeleton-line tag"></div>
        <div class="skeleton-line w-80" style="height:16px;"></div>
        <div class="skeleton-line w-100"></div>
        <div class="skeleton-line w-100"></div>
        <div class="skeleton-line w-60"></div>
      </div>
    `
  ).join("");

  // swap to real cards after a short simulated load (mirrors the real
  // Congress.gov live-fetch delay on the actual site)
  setTimeout(() => {
    grid.innerHTML = BILLS.map(
      (b) => `
        <div class="bill-card">
          <span class="bill-tag">${b.tag}</span>
          <h3>${b.title}</h3>
          <p>${b.body}</p>
          <a class="read-link" href="#">Read the summary ↗</a>
        </div>
      `
    ).join("");
  }, reduceMotion ? 0 : 1400);
</script>

</body>
</html>
