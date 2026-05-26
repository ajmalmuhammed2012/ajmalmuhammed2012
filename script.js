/* --- UNIVERSAL SYSTEM DESIGN TOKENS --- */
:root[data-theme="light"] {
  --bg: #f5f5f7;                   /* Premium Apple layout canvas tone */
  --bg-subtle: #ffffff;
  --bg-canvas: #fcfcfd;            
  --ink: #1d1d1f;
  --muted: #6e6e73;
  --line: rgba(0, 0, 0, 0.06);
  
  /* Liquid Glass Core Parameters */
  --glass: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.06);
  --glass-specular: rgba(255, 255, 255, 0.8);
  
  /* Antigravity Luminescent Core Channels */
  --accent: #14a596;              /* Constellation particle resting teal */
  --accent-glow: rgba(20, 165, 150, 0.2);
  --accent-hover: #e65500;         /* Constellation particle hover orange */
  --accent-hover-glow: rgba(230, 85, 0, 0.3);
  
  --card-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.02);
  --radius-apple: 24px;            /* Signature fluid curve profiles */
  --canvas-opacity: 0.55;
}

:root[data-theme="dark"] {
  --bg: #000000;
  --bg-subtle: #0d0d0f;            /* High-end obsidian space backdrop */
  --bg-canvas: #050507;
  --ink: #f5f5f7;
  --muted: #86868b;
  --line: rgba(255, 255, 255, 0.07);
  
  /* Liquid Glass Core Parameters */
  --glass: rgba(10, 10, 12, 0.5);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-specular: rgba(255, 255, 255, 0.04);
  
  /* Antigravity Luminescent Core Channels */
  --accent: #2de2ce;              /* Constellation particle resting teal */
  --accent-glow: rgba(45, 226, 206, 0.25);
  --accent-hover: #ff7600;         /* Constellation particle hover orange */
  --accent-hover-glow: rgba(255, 118, 0, 0.45);
  
  --card-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.65);
  --radius-apple: 24px;            /* Signature fluid curve profiles */
  --canvas-opacity: 0.85;
}

* {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  margin: 0;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  line-height: 1.47059;
  letter-spacing: -0.022em;
  transition: background-color 0.4s ease, color 0.3s ease;
}

a {
  color: inherit;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* --- CINEMATIC INITIAL SLIDE NAVIGATION CAPSULE --- */
.site-header {
  position: fixed;
  top: 12px;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  height: 48px;
  pointer-events: none;
  
  /* Locked default hidden state for cinematic entry choreography */
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Trigger class mapped via javascript viewport scrolls */
.header-visible .site-header {
  opacity: 1;
  transform: translateY(0);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 48px);
  max-width: 1024px;
  padding: 0 24px;
  pointer-events: auto;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  box-shadow: var(--card-shadow), inset 0 1px 1px var(--glass-specular);
  border-radius: 40px; 
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
}

/* --- LUXURY SCIFI BRAND COMPOSITION --- */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.brand span:not(.brand-main):not(.brand-sub) {
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: var(--ink);
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  background: var(--glass);
  border: 1px solid var(--accent);
  border-radius: 8px; 
  box-shadow: 0 0 10px var(--accent-glow), inset 0 1px 0 var(--glass-specular);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand strong {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  transition: color 0.3s ease;
}

.brand:hover span:not(.brand-main):not(.brand-sub) {
  border-color: var(--accent-hover);
  background: var(--accent-hover);
  color: #ffffff;
  box-shadow: 0 0 18px var(--accent-hover-glow);
  transform: scale(1.05) rotate(-4deg);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links a {
  color: var(--ink);
  opacity: 0.75;
  font-size: 0.75rem;
  font-weight: 500;
}

.nav-links a:hover {
  color: var(--accent);
  opacity: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-action {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border: 1px solid var(--accent);
  background: rgba(45, 226, 206, 0.05);
  color: var(--ink);
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 0 8px var(--accent-glow);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.header-action:hover {
  border-color: var(--accent-hover);
  color: #ffffff;
  background: var(--accent-hover);
  box-shadow: 0 0 16px var(--accent-hover-glow);
}

.theme-toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  color: var(--ink);
  opacity: 0.8;
}

.sun-icon, [data-theme="dark"] .moon-icon { display: none; }
[data-theme="dark"] .sun-icon, .moon-icon { display: block; width: 14px; height: 14px; }

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  width: 100%;
  height: 1.5px;
  background-color: var(--ink);
}

/* --- THE CINEMATIC MORPH MATRIX HERO --- */
.hero {
  position: relative;
  min-height: 100svh;               /* Hard locked window axis on splash state */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-canvas);
  border-bottom: 1px solid var(--line);
}

/* Hyper-Sharp Layer Composition Engine (Safari Blur Patch) */
.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: var(--canvas-opacity);
  image-rendering: -webkit-optimize-contrast; 
  image-rendering: crisp-edges;               
  transform: translateZ(0);                   
  -webkit-transform: translateZ(0);           
}

.hero-shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.02) 0%, 
    rgba(255, 255, 255, 0) 40%, 
    rgba(0, 0, 0, 0.03) 100%
  );
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 130px 24px 40px;
}

.hero h1 {
  font-size: clamp(3rem, 8vw, 5.5rem); /* Cinematic title layout weighting */
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 0;
  text-align: center;
  will-change: transform, opacity;
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Staged reveal block container states */
.hero-reveal-block {
  opacity: 0;
  transform: translateY(24px);
  margin-top: 36px;                 /* Typographic ratio breathing gap space */
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, 
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}

/* ---> CHOREOGRAPHED SCROLL STATE CONVERSIONS <--- */
.js-morphed h1 {
  font-size: clamp(2.4rem, 6vw, 4.2rem) !important;
  text-align: left !important;
  letter-spacing: -0.035em !important;
}

.js-morphed .hero-reveal-block {
  opacity: 1;
  transform: translateY(0);
}

.hero-copy {
  max-width: 600px;
  margin: 0;
  color: var(--muted);
  font-size: 1.35rem;
  line-height: 1.55;
}

/* --- FUTURISTIC LIQUID GLASS BUTTON CORES --- */
.hero-actions-row, .project-links {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 36px;
}

.button {
  position: relative;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 14px 32px;
  border-radius: var(--radius-apple); 
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button.primary {
  background: var(--glass);
  border: 1px solid var(--accent);
  color: var(--ink);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px var(--accent-glow), inset 0 1px 1px var(--glass-specular);
}

.button.primary:hover {
  border-color: var(--accent-hover);
  background: var(--accent-hover);
  color: #ffffff;
  box-shadow: 0 8px 24px var(--accent-hover-glow);
  transform: translateY(-3px);
}

.button.secondary {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--glass-border);
  color: var(--muted);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

[data-theme="dark"] .button.secondary {
  background: rgba(255, 255, 255, 0.02);
}

.button.secondary:hover {
  border-color: var(--accent);
  color: var(--ink);
  background: var(--glass);
  box-shadow: 0 4px 16px var(--accent-glow);
  transform: translateY(-2px);
}

.hero-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 64px;
  border-top: 1px solid var(--line);
  padding-top: 28px;
  max-width: 700px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item .label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.05em;
}

.meta-item .value {
  font-size: 0.95rem;
  font-weight: 500;
}

/* --- THE HORIZON RUNNING MARQUEE --- */
.marquee {
  overflow: hidden;
  padding: 18px 0;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--line);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: drift 50s linear infinite;
}

.marquee span {
  padding: 0 32px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-transform: uppercase;
}

/* --- CORE STRUCTURAL SECTION FRAME WORK --- */
.section-shell {
  max-width: 1024px;
  margin: 0 auto;
  padding: 120px 24px;
}

.editorial-row {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 64px;
  align-items: start;
}

.section-title-block h2, .section-title-block h3, h2, h3, h4 {
  font-size: clamp(2rem, 4.5vw, 2.8rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0;
}

.section-desc {
  font-size: 1.15rem;
  color: var(--muted);
  margin-top: 18px;
  line-height: 1.5;
}

.intro-section { border-bottom: 1px solid var(--line); }
.intro-body p {
  font-size: 1.4rem;
  color: var(--ink);
  line-height: 1.55;
  margin: 0;
}

/* --- UNIFORM GLASS CARDS CORE STYLING MATRIX --- */
.glass-card {
  background: rgba(255, 255, 255, 0.45) !important;
  border-radius: var(--radius-apple) !important; /* Locks curved 24px configuration specs */
  border: 1px solid var(--glass-border) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  box-shadow: var(--card-shadow), inset 0 1px 1px var(--glass-specular) !important;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

[data-theme="dark"] .glass-card {
  background: rgba(22, 22, 23, 0.45) !important;
}

.glass-card:hover {
  border-color: var(--accent) !important;
  box-shadow: 0 12px 32px var(--accent-glow) !important;
  transform: translateY(-4px) scale(1.01) !important;
}

/* Grid Matrix Layout Framework allocations */
.stats-grid, .ai-grid, .skills-grid, .recommendation-grid, .credentials-section {
  display: grid;
  gap: 24px;
  width: 100%;
}

.stats-grid { grid-template-columns: repeat(4, 1fr); }
.ai-grid, .skills-grid, .recommendation-grid, .credentials-section { grid-template-columns: repeat(2, 1fr); }

.stats-grid article { padding: 32px 24px; }
.ai-grid article, .skills-grid article, .quote-card, .education-block, .cert-block { padding: 32px; }

.stat-number {
  font-size: 3.8rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--accent);
  margin-bottom: 8px;
}

.stat-caption {
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.5;
}

.skills-grid article h4 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--accent);
}

.tool-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.tool-meta span {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  background: rgba(45, 226, 206, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.tool-meta strong {
  font-size: 1.15rem;
  font-weight: 600;
}

.ai-grid article p, .skills-grid article p {
  font-size: 0.95rem;
  color: var(--muted);
  margin: 0;
  line-height: 1.55;
}

.ai-outcomes, .tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-top: 20px;
}

.outcome-pill, .tech-stack span {
  font-size: 0.8rem;
  padding: 6px 16px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-apple); /* Fluid capsule pills formatting */
  color: var(--ink);
}

/* --- CHRONOLOGY PROGRESSION LINE HOUSINGS --- */
.ai-section {
  background: var(--bg-canvas);
  border-bottom: 1px solid var(--line);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.role-card {
  display: flex;
  flex-direction: column;
  padding: 32px;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 18px;
}

.role-header .company {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--accent);
  letter-spacing: 0.05em;
  font-weight: 600;
}

.role-header h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
}

.role-header .date {
  font-size: 0.9rem;
  color: var(--muted);
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.04);
  padding: 4px 12px;
  border-radius: 12px;
}

[data-theme="dark"] .role-header .date {
  background: rgba(255, 255, 255, 0.04);
}

.role-card ul { margin: 16px 0 0; padding-left: 20px; color: var(--muted); }
.role-card li { margin-bottom: 10px; font-size: 1.1rem; }

/* --- OPEN SOURCE COMPACT SPEC DESCRIPTIONS --- */
.project-showcase {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.project-desc {
  font-size: 1.2rem;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

/* --- COLLABORATOR RECOMMENDATION SPECS --- */
.proof-section {
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--line);
}

.section-heading { margin-bottom: 40px; }
.quote-card p { font-size: 1.05rem; line-height: 1.6; margin: 0 0 28px; color: var(--ink); }

.quote-author {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--line);
  padding-top: 20px;
}

.quote-author strong { font-size: 1rem; font-weight: 600; }
.quote-author span { font-size: 0.8rem; color: var(--muted); }

.cert-list { margin: 0; padding-left: 20px; }
.cert-list li { font-size: 1.05rem; margin-bottom: 8px; }

/* --- USER SPECIFIED GRAPHIC LINK SHORTCUT GRID --- */
.contact-section { background: var(--bg-canvas); }

.contact-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 16px; 
  width: 100%;
}

.contact-grid a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-apple); /* Fluid rounded curves architecture */
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--card-shadow), inset 0 1px 0 var(--glass-specular);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.contact-grid a:hover {
  border-color: var(--accent-hover);
  color: #ffffff;
  background: var(--accent-hover);
  box-shadow: 0 8px 24px var(--accent-hover-glow);
  transform: translateY(-3px);
}

/* --- SYSTEM FOOTER --- */
.site-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1024px;
  margin: 0 auto;
  padding: 48px 24px;
  font-size: 0.75rem;
  color: var(--muted);
  border-top: 1px solid var(--line);
}

@keyframes drift {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* --- HARDWARE ACCELERATED DELAYED SCROLL REVEAL MATRICES --- */
.scroll-reveal {
  opacity: 1;
  transform: none;
  will-change: transform, opacity;
}

.js-enabled .scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
}

.js-enabled .scroll-reveal.reveal-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1), 
              transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* --- MOBILE RESPONSIVE MEDIA ADAPTATIONS --- */
@media (max-width: 860px) {
  .site-header { top: 0; }
  .header-inner { width: 100%; border-radius: 0; border-top: none; border-left: none; border-right: none; }
  .menu-toggle { display: flex; }
  .header-action { display: none; }

  .nav-links {
    position: absolute;
    top: 48px;
    left: 0;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    padding: 8px 0;
    background: var(--bg-subtle);
    border-bottom: 1px solid var(--line);
    opacity: 0;
    transform: translateY(-4px);
    pointer-events: none;
    transition: all 0.25s ease;
  }

  .site-header.menu-is-open .nav-links {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .nav-links a { width: 100%; padding: 14px 24px; font-size: 0.85rem; }

  .editorial-row, .stats-grid, .ai-grid, .skills-grid, .recommendation-grid, .credentials-section {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .contact-grid { grid-template-columns: 1fr; }
  .role-header { flex-direction: column; gap: 6px; }
}

@media (max-width: 580px) {
  .hero-content, .section-shell, .site-footer { padding-left: 16px; padding-right: 16px; }
  .hero-meta { grid-template-columns: 1fr; gap: 16px; }
  .hero-actions-row { flex-direction: column; align-items: stretch; }
  .hero-actions-row .button { width: 100%; text-align: center; }
}
