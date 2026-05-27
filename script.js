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

// 4. FLOATING SCREEN RATIO DYNAMIC INTERCEPTOR (The True Fix)
const runCinematicTimeline = () => {
  const hero = document.getElementById('timeline-hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Calculates states based on strict pixel milestones relative to viewport heights
    if (scrollY <= 120) {
      if (hero.className !== "hero stage-1") hero.className = "hero stage-1";
      document.documentElement.classList.remove('header-visible');
    } 
    else if (scrollY > 120 && scrollY <= 320) {
      if (hero.className !== "hero stage-2") hero.className = "hero stage-2";
      document.documentElement.classList.remove('header-visible');
    } 
    else if (scrollY > 320) {
      if (hero.className !== "hero stage-3") hero.className = "hero stage-3";
      document.documentElement.classList.add('header-visible');
    }
  }, { passive: true });
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
