// 1. SCROLL RESTORATION BASELINES (Only force to top if no deep-link hash exists)
if (window.history && history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});

// 2. THEME MATRIX SYSTEM CONFIGS (With Local Storage Persistence)
const themeToggle = document.querySelector("#theme-toggle");
const rootElement = document.documentElement;

// Load theme preference early to prevent theme flash
const savedTheme = localStorage.getItem("portfolio-theme") || 
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
rootElement.setAttribute("data-theme", savedTheme);

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
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    rootElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
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

  // Scroll velocity tracking variables
  let lastScrollY = window.scrollY;
  let targetVelocity = 0;
  let smoothedVelocity = 0;

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

    // Calculate scroll velocity per frame
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    // Smooth the velocity input to create a fluid momentum decay
    targetVelocity = Math.min(scrollDelta, 100); // Clamp to avoid huge spikes
    smoothedVelocity += (targetVelocity - smoothedVelocity) * 0.08;

    // Lerp display pointer toward the raw target — creates a soft spring feel
    if (pointer.active) {
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
    }

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = canvasColors.line;

    // Float + upward velocity drift + repulsion pass
    particles.forEach(p => {
      const speedMult = 1 + smoothedVelocity * 0.06;
      const driftY = -smoothedVelocity * 0.20; // Float upwards on scroll down

      p.x += p.vx * speedMult;
      p.y += p.vy * speedMult + driftY;

      // Bounce horizontally
      if (p.x < 0 || p.x > width) p.vx *= -1;

      // Infinite vertical wrap-around for fluid upward flow
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      } else if (p.y > height) {
        p.y = 0;
        p.x = Math.random() * width;
      }

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
          ctx.beginPath(); 
          ctx.moveTo(Math.round(particles[i].x), Math.round(particles[i].y));
          ctx.lineTo(Math.round(particles[j].x), Math.round(particles[j].y)); 
          ctx.stroke();
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
      ctx.beginPath(); 
      ctx.arc(Math.round(p.x), Math.round(p.y), p.size * sizeMult, 0, Math.PI * 2);
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

  // Cache track height and viewport height to avoid layout thrashing in scroll loop
  let trackHeight = 0;
  let viewportHeight = 0;

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

    // Force layout reflow so the browser calculates accurate client coordinates
    const _reflow = document.body.offsetHeight;

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

    // Cache track and viewport measurements
    trackHeight = track.offsetHeight;
    viewportHeight = window.innerHeight;
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
    showWrapper();

    // 1. Name Animation: Fades out and slides up gently in range [0.0, 0.30]
    const t_name = easeInOut(clamp((progress - 0.0) / 0.30, 0, 1));
    const tx_name = nameOffset.x;
    const ty_name = nameOffset.y - 40 * t_name;
    nameEl.style.opacity = 1 - t_name;
    nameEl.style.transform = `translate3d(${tx_name}px, ${ty_name}px, 0) scale(1.15)`;

    // 2. Role Animation: Fades/rises in range [0.10, 0.40], then docks in range [0.45, 0.85]
    const t_role_in = easeInOut(clamp((progress - 0.10) / 0.30, 0, 1));
    let tx_role, ty_role, scale_role;

    if (progress < 0.45) {
      tx_role = roleOffset.x;
      ty_role = roleOffset.y + 40 * (1 - t_role_in);
      scale_role = 1.15;
    } else {
      const t_dock = easeInOut(clamp((progress - 0.45) / 0.40, 0, 1));
      tx_role = roleOffset.x * (1 - t_dock);
      ty_role = roleOffset.y * (1 - t_dock);
      scale_role = parseFloat(lerp(1.15, 1.0, t_dock).toFixed(3));
    }

    roleEl.style.opacity = t_role_in;
    roleEl.style.transform = `translate3d(${tx_role}px, ${ty_role}px, 0) scale(${scale_role})`;

    // 3. Brief Animation: Fades in and slides up in range [0.55, 0.90]
    const t_reveal = easeInOut(clamp((progress - 0.55) / 0.35, 0, 1));
    const ty_reveal = 28 * (1 - t_reveal);
    reveal.style.opacity = t_reveal;
    reveal.style.transform = `translate3d(0, ${ty_reveal}px, 0)`;
    reveal.style.pointerEvents = t_reveal > 0.15 ? 'auto' : 'none';
    reveal.style.visibility = t_reveal > 0 ? 'visible' : 'hidden';

    // 4. Auxiliary Stages & Header triggers
    if (progress > 0.55) {
      hero.classList.add('stage-3');
      document.documentElement.classList.add('header-visible');
    } else {
      hero.classList.remove('stage-3');
      document.documentElement.classList.remove('header-visible');
    }
  };

  const triggerUpdate = () => {
    const scrollable = trackHeight - viewportHeight;
    targetProgress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
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

  // Load and deep link handler
  const handleDeepLinkAndInit = () => {
    calculateOffsets();
    
    // Force progress to apply synchronously for the first render to avoid layout snap
    const scrollable = trackHeight - viewportHeight;
    targetProgress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
    currentProgress = targetProgress;
    update();
    
    document.documentElement.classList.add('timeline-initialized');

    // If a hash exists in URL, scroll to it smoothly after initialization
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  window.addEventListener('load', handleDeepLinkAndInit);

  if (document.fonts) {
    document.fonts.ready.then(() => {
      calculateOffsets();
      triggerUpdate();
    });
  }

  // Run initial sync
  calculateOffsets();
  const initScrollable = trackHeight - viewportHeight;
  targetProgress = initScrollable > 0 ? clamp(window.scrollY / initScrollable, 0, 1) : 0;
  currentProgress = targetProgress;
  update();
  document.documentElement.classList.add('timeline-initialized');
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
