// 1. SCROLL RESTORATION BASELINES
if (window.history && history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});

// 2. THEME MATRIX SYSTEM CONFIGS
const themeToggle = document.querySelector("#theme-toggle");
const rootElement = document.documentElement;

const getCanvasColors = () => {
  const isDarkMode = rootElement.getAttribute("data-theme") === "dark";
  return {
    nodeRest: isDarkMode ? "rgba(45, 226, 206, 0.95)" : "rgba(20, 165, 150, 0.85)",
    nodeHover: isDarkMode ? "rgba(255, 110, 0, 1)" : "rgba(230, 85, 0, 1)",
    line: isDarkMode ? "rgba(45, 226, 206, 0.25)" : "rgba(20, 165, 150, 0.18)"
  };
};

let canvasColors = getCanvasColors();
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = rootElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    rootElement.setAttribute("data-theme", nextTheme);
    canvasColors = getCanvasColors();
  });
}

// Mobile Slide Menu Channel
const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-is-open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      siteHeader.classList.remove("menu-is-open");
    });
  });
}

// 3. HIGH-DENSITY INTERACTIVE CANVAS CONSTELLATION ENGINE
const canvas = document.querySelector("#antigravity-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const pointer = { active: false, x: 0, y: 0 };
  const particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resizeCanvas = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    particles.length = 0;
    const total = width < 680 ? 35 : 70;
    for (let i = 0; i < total; i++) {
      particles.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        size: 3.5, phase: Math.random() * Math.PI * 2
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = canvasColors.line;

    // Fluid background float pass
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 180) {
          p.x -= (dx / d) * 0.8;
          p.y -= (dy / d) * 0.8;
        }
      }
    });

    // Node link mapping pass
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    }

    // Render pass
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = canvasColors.nodeRest; ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", e => { pointer.active = true; pointer.x = e.clientX; pointer.y = e.clientY; });
  window.addEventListener("pointerleave", () => pointer.active = false);
  resizeCanvas(); draw();
}

// 4. CINEMATIC SCROLL-DRIVEN HERO TIMELINE
// Drives the 3-phase hero reveal via scroll progress (0→1) across the 300vh scroll track.
// All opacity/transform are set via JS+rAF so they're perfectly tied to scroll position.
const runCinematicTimeline = () => {
  const track    = document.querySelector('.hero-scroll-track');
  const hero     = document.getElementById('timeline-hero');
  const nameEl   = document.getElementById('headline-name');
  const roleEl   = document.getElementById('headline-role');
  const reveal   = document.querySelector('.hero-reveal-block');

  if (!track || !hero || !nameEl || !roleEl || !reveal) return;

  // Ease-out cubic: motion decelerates into each phase boundary
  const easeOut  = t => 1 - Math.pow(1 - t, 3);
  const clamp    = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp     = (a, b, t) => a + (b - a) * t;

  // Phase boundaries (fraction of total scroll progress 0→1)
  const P1 = 0.33; // name starts fading out
  const P2 = 0.66; // role is fully visible; content reveal begins

  let ticking = false;

  const update = () => {
    // Progress within the sticky scroll track
    const scrollable = track.offsetHeight - window.innerHeight;
    const raw = -track.getBoundingClientRect().top;
    const progress = clamp(raw / scrollable, 0, 1);

    if (progress < P1) {
      // ── PHASE 1: Name fully visible, centered ──────────────────────────
      nameEl.style.display  = '';
      nameEl.style.opacity  = 1;
      nameEl.style.transform = 'translateY(0)';
      roleEl.style.opacity  = 0;
      roleEl.style.transform = 'translateY(32px)';
      reveal.style.display  = 'none';
      reveal.style.opacity  = 0;
      hero.classList.remove('stage-3');
      document.documentElement.classList.remove('header-visible');

    } else if (progress < P2) {
      // ── PHASE 2: Cross-dissolve name → role ───────────────────────────
      const t = easeOut((progress - P1) / (P2 - P1)); // 0→1 within phase
      nameEl.style.display  = '';
      nameEl.style.opacity  = 1 - t;
      nameEl.style.transform = `translateY(${lerp(0, -28, t)}px)`;
      roleEl.style.opacity  = t;
      roleEl.style.transform = `translateY(${lerp(32, 0, t)}px)`;
      reveal.style.display  = 'none';
      reveal.style.opacity  = 0;
      hero.classList.remove('stage-3');
      document.documentElement.classList.remove('header-visible');

    } else {
      // ── PHASE 3: Role stays; content block fades in ───────────────────
      const t = easeOut((progress - P2) / (1 - P2)); // 0→1 within phase
      nameEl.style.opacity  = 0;
      nameEl.style.display  = 'none';
      roleEl.style.opacity  = 1;
      roleEl.style.transform = 'translateY(0)';
      reveal.style.display  = 'block';
      reveal.style.opacity  = clamp(t * 1.6, 0, 1);
      reveal.style.transform = `translateY(${lerp(24, 0, t)}px)`;
      // Stage-3 class only handles layout shift (text-align/font-size), not animation
      hero.classList.add('stage-3');
      if (t > 0.35) document.documentElement.classList.add('header-visible');
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load to set initial state
  update();
};
runCinematicTimeline();

// 5. SECTIONS REVEAL OBSERVER
const revealElements = document.querySelectorAll(".scroll-reveal");
if (revealElements.length > 0) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("reveal-active"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  document.documentElement.classList.add("js-enabled");
  revealElements.forEach(el => obs.observe(el));
}
