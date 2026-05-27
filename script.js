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
    nodeRest:  isDarkMode ? "rgba(45, 226, 206, 0.95)"  : "rgba(20, 165, 150, 0.85)",
    nodeHover: isDarkMode ? "rgba(255, 110, 0, 1)"       : "rgba(230, 85, 0, 1)",
    line:      isDarkMode ? "rgba(45, 226, 206, 0.25)"   : "rgba(20, 165, 150, 0.18)"
  };
};

let canvasColors = getCanvasColors();
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = rootElement.getAttribute("data-theme");
    rootElement.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
    canvasColors = getCanvasColors();
  });
}

// Mobile Slide Menu Channel
const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");
const navLinks   = document.querySelectorAll(".nav-links a");

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-is-open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
  navLinks.forEach(link => link.addEventListener("click", () => {
    siteHeader.classList.remove("menu-is-open");
  }));
}

// 3. HIGH-DENSITY INTERACTIVE CANVAS CONSTELLATION ENGINE
const canvas = document.querySelector("#antigravity-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  // Pointer has BOTH a raw target (tx/ty updated instantly) and a lerped
  // display position (x/y) so the repulsion field trails the cursor smoothly.
  const pointer = { active: false, x: 0, y: 0, tx: 0, ty: 0 };
  const particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resizeCanvas = () => {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width; canvas.height = height;
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

    // Lerp display pointer toward the raw target — creates a soft spring feel
    if (pointer.active) {
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
    }

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = canvasColors.line;

    // Float + repulsion pass
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width)  p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (pointer.active) {
        const dx = pointer.x - p.x, dy = pointer.y - p.y;
        const d  = Math.hypot(dx, dy);
        if (d < 180) { p.x -= (dx / d) * 0.9; p.y -= (dy / d) * 0.9; }
      }
    });

    // Link pass
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.globalAlpha = 1 - dist / 120;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Render pass — orange glow for nodes near the lerped cursor
    particles.forEach(p => {
      const dx = pointer.x - p.x, dy = pointer.y - p.y;
      const d  = Math.hypot(dx, dy);
      const near = pointer.active && d < 180;
      // Smooth size using distance ratio rather than binary
      const sizeMult = near ? 1 + 0.5 * (1 - d / 180) : 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * sizeMult, 0, Math.PI * 2);
      ctx.fillStyle = near ? canvasColors.nodeHover : canvasColors.nodeRest;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", e => {
    pointer.active = true;
    pointer.tx = e.clientX; pointer.ty = e.clientY;
  });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
  resizeCanvas(); draw();
}

// 4. CINEMATIC SCROLL-DRIVEN HERO TIMELINE
// 4 phases across a 680vh scroll track:
//   Phase 1 (0→20%):  "Ajmal Muhammed" centered and held
//   Phase 2 (20→40%): Cross-dissolve → "Software Engineer" (easeInOut)
//   HOLD   (40→60%):  "Software Engineer" alone, centered — reader breathes
//   Phase 4 (60→100%): Dock role to static position, bio + buttons fade in
const runCinematicTimeline = () => {
  const track       = document.querySelector('.hero-scroll-track');
  const hero        = document.getElementById('timeline-hero');
  const heroContent = document.querySelector('.hero-content');
  const nameEl      = document.getElementById('headline-name');
  const roleEl      = document.getElementById('headline-role');
  const reveal      = document.querySelector('.hero-reveal-block');
  const wrapper     = document.querySelector('.cinematic-headline-wrapper');

  if (!track || !hero || !nameEl || !roleEl || !reveal) return;

  // Easing functions
  const easeOut   = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp  = (a, b, t)   => a + (b - a) * t;

  // Phase boundaries — synced with 680vh track in styles.css
  const P1   = 0.20;
  const P2   = 0.40;
  const HOLD = 0.60;

  // Visual centering offsets (measured relative to final layout positions)
  const nameOffset = { x: 0, y: 0 };
  const roleOffset = { x: 0, y: 0 };

  const calculateOffsets = () => {
    // Clear styles temporarily to get clean, un-transformed bounding boxes
    const namePrev = nameEl.style.transform;
    const rolePrev = roleEl.style.transform;
    const revealPrev = reveal.style.transform;
    const revealOpacityPrev = reveal.style.opacity;
    const revealVisibilityPrev = reveal.style.visibility;

    nameEl.style.transform = 'none';
    roleEl.style.transform = 'none';
    reveal.style.transform = 'none';
    reveal.style.opacity   = '1';
    reveal.style.visibility = 'visible';

    const nameRect = nameEl.getBoundingClientRect();
    const roleRect = roleEl.getBoundingClientRect();
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    // Centering offsets
    nameOffset.x = viewportCenterX - (nameRect.left + nameRect.width / 2);
    nameOffset.y = viewportCenterY - (nameRect.top + nameRect.height / 2);

    roleOffset.x = viewportCenterX - (roleRect.left + roleRect.width / 2);
    roleOffset.y = viewportCenterY - (roleRect.top + roleRect.height / 2);

    // Restore active states
    nameEl.style.transform = namePrev;
    roleEl.style.transform = rolePrev;
    reveal.style.transform = revealPrev;
    reveal.style.opacity   = revealOpacityPrev;
    reveal.style.visibility = revealVisibilityPrev;
  };

  let ticking = false;
  let currentProgress = 0;
  let targetProgress  = 0;

  const showWrapper = () => { if (wrapper) wrapper.style.display = ''; };

  const update = () => {
    // Smooth progress toward target using high-performance lerp
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) < 0.0001) {
      currentProgress = targetProgress;
      ticking = false;
    } else {
      currentProgress += diff * 0.22; // highly responsive, jitter-filtering lerp
      requestAnimationFrame(update);
    }

    const progress = currentProgress;

    if (progress < P1) {
      // ── PHASE 1: Name held, centered ─────────────────────────────────
      showWrapper();
      nameEl.style.opacity   = 1;
      nameEl.style.transform = `translate3d(${nameOffset.x}px, ${nameOffset.y}px, 0) scale(1.15)`;
      
      roleEl.style.opacity   = 0;
      roleEl.style.transform = `translate3d(${roleOffset.x}px, ${roleOffset.y}px, 0) scale(1.15)`;
      
      reveal.style.opacity   = 0;
      reveal.style.transform = 'translate3d(0, 28px, 0)';
      reveal.style.pointerEvents = 'none';
      reveal.style.visibility = 'hidden';
      
      hero.classList.remove('stage-3');
      document.documentElement.classList.remove('header-visible');

    } else if (progress < P2) {
      // ── PHASE 2: Cross-dissolve name → Software Engineer (easeInOut for zero pops) ──
      const t = easeInOut((progress - P1) / (P2 - P1));
      showWrapper();
      nameEl.style.opacity   = 1 - t;
      nameEl.style.transform = `translate3d(${nameOffset.x}px, ${nameOffset.y}px, 0) scale(1.15)`;
      
      roleEl.style.opacity   = t;
      roleEl.style.transform = `translate3d(${roleOffset.x}px, ${roleOffset.y}px, 0) scale(1.15)`;
      
      reveal.style.opacity   = 0;
      reveal.style.transform = 'translate3d(0, 28px, 0)';
      reveal.style.pointerEvents = 'none';
      reveal.style.visibility = 'hidden';
      
      hero.classList.remove('stage-3');
      document.documentElement.classList.remove('header-visible');

    } else if (progress < HOLD) {
      // ── HOLD: Software Engineer alone, centered ─────────────────────────
      showWrapper();
      nameEl.style.opacity   = 0;
      nameEl.style.transform = `translate3d(${nameOffset.x}px, ${nameOffset.y}px, 0) scale(1.15)`;
      
      roleEl.style.opacity   = 1;
      roleEl.style.transform = `translate3d(${roleOffset.x}px, ${roleOffset.y}px, 0) scale(1.15)`;
      
      reveal.style.opacity   = 0;
      reveal.style.transform = 'translate3d(0, 28px, 0)';
      reveal.style.pointerEvents = 'none';
      reveal.style.visibility = 'hidden';
      
      hero.classList.remove('stage-3');
      document.documentElement.classList.remove('header-visible');

    } else {
      // ── PHASE 4: Transition to final layout + bio fades in ──────────────────
      const t = easeOut((progress - HOLD) / (1 - HOLD));
      showWrapper();
      nameEl.style.opacity   = 0;
      nameEl.style.transform = `translate3d(${nameOffset.x}px, ${nameOffset.y}px, 0) scale(1.15)`;
      
      roleEl.style.opacity   = 1;
      // Interpolate position and scale back to layout defaults (0, 0) and 1.0
      const tx = roleOffset.x * (1 - t);
      const ty = roleOffset.y * (1 - t);
      const scale = lerp(1.15, 1.0, t);
      roleEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
      
      // Bio fades in and slides up from 28px
      reveal.style.opacity   = t;
      reveal.style.transform = `translate3d(0, ${28 * (1 - t)}px, 0)`;
      reveal.style.pointerEvents = t > 0.15 ? 'auto' : 'none';
      reveal.style.visibility = t > 0 ? 'visible' : 'hidden';
      
      hero.classList.add('stage-3');
      if (t > 0.3) document.documentElement.classList.add('header-visible');
    }
  };

  const triggerUpdate = () => {
    const scrollable = track.offsetHeight - window.innerHeight;
    targetProgress = scrollable > 0 ? clamp(-track.getBoundingClientRect().top / scrollable, 0, 1) : 0;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', triggerUpdate, { passive: true });

  window.addEventListener('resize', () => {
    calculateOffsets();
    triggerUpdate();
  });

  window.addEventListener('load', () => {
    calculateOffsets();
    triggerUpdate();
  });

  // Run initial pass
  calculateOffsets();
  triggerUpdate();
};
runCinematicTimeline();

// 5. SECTIONS REVEAL OBSERVER — staggered child animation
const revealElements = document.querySelectorAll(".scroll-reveal");
if (revealElements.length > 0) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("reveal-active");
        // Stagger direct card children for a cascade effect
        el.querySelectorAll('.glass-card, .quote-card').forEach((card, i) => {
          card.style.transitionDelay = `${i * 80}ms`;
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  document.documentElement.classList.add("js-enabled");
  revealElements.forEach(el => obs.observe(el));
}
