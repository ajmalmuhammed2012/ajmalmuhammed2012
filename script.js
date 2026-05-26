// Year Sync
const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Light & Dark Mode System Controller
const themeToggle = document.querySelector("#theme-toggle");
const rootElement = document.documentElement;

const getCanvasColors = () => {
  const isDarkMode = rootElement.getAttribute("data-theme") === "dark";
  return {
    nodeRest: isDarkMode ? "rgba(45, 226, 206, 0.95)" : "rgba(20, 165, 150, 0.95)",
    nodeHover: isDarkMode ? "rgba(255, 110, 0, 1)" : "rgba(230, 85, 0, 1)",
    line: isDarkMode ? "rgba(45, 226, 206, 0.25)" : "rgba(20, 165, 150, 0.18)" // Increased alpha baseline for connectors
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

// Hamburger Navigation Setup
const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-is-open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteHeader.classList.remove("menu-is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Antigravity Constellation Canvas Animation Logic
const canvas = document.querySelector("#antigravity-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { active: false, x: 0, y: 0 };
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles.length = 0;
    const totalParticles = width < 680 ? 40 : 75; // Slightly reduced count to balance the larger node footprints

    for (let i = 0; i < totalParticles; i++) {
      const homeX = Math.random() * width;
      const homeY = Math.random() * height;
      particles.push({
        homeX: homeX,
        homeY: homeY,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        baseSize: 4.5, // Bold, upscaled resting nodes
        size: 4.5,
        phase: Math.random() * Math.PI * 2,
        isHovered: false
      });
    }
  };

  const draw = (time = 0) => {
    ctx.clearRect(0, 0, width, height);
    const pointerRadius = Math.min(240, width * 0.32);

    particles.forEach((particle) => {
      const driftX = Math.cos(time * 0.00015 + particle.phase) * 12;
      const driftY = Math.sin(time * 0.00015 + particle.phase) * 12;
      const targetX = particle.homeX + driftX;
      const targetY = particle.homeY + driftY;

      particle.isHovered = false;
      particle.size = particle.baseSize;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const dist = Math.hypot(dx, dy) || 1;
        
        if (dist < pointerRadius) {
          particle.isHovered = true;
          // Dynamically amplify node scale up to 6px under cursor proximity
          particle.size = particle.baseSize + (1 - dist / pointerRadius) * 1.5; 
          
          const force = (1 - dist / pointerRadius) * 2.0;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force;
          particle.vy -= Math.sin(angle) * force;
        }
      }

      particle.vx += (targetX - particle.x) * 0.015;
      particle.vy += (targetY - particle.y) * 0.015;
      particle.vx *= 0.84;
      particle.vy *= 0.84;
      particle.x += particle.vx;
      particle.y += particle.vy;
    });

    const maxLinkDistance = width < 680 ? 100 : 140;
    ctx.lineWidth = 1.5; // Upgraded connector line thickness for distinct grid definition
    ctx.strokeStyle = canvasColors.line;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        if (dist < maxLinkDistance) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.isHovered ? canvasColors.nodeHover : canvasColors.nodeRest;
      ctx.fill();
    });

    if (!reduceMotion.matches) {
      animationFrame = window.requestAnimationFrame(draw);
    }
  };

  const updatePointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.active = true;
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  };

  // Premium Scroll Reveal Intersection Observer Execution Pipeline
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".scroll-reveal");

  if (revealElements.length > 0) {
    const observerOptions = {
      root: null, // Scans native global screen viewport bounds
      rootMargin: "0px 0px -8% 0px", // Margins trigger animations slightly before element enters view
      threshold: 0.08 // Triggers when at least 8% of the target container is intersecting
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          // Unobserves the section once triggered to ensure smooth, performant rendering
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }
});

  resizeCanvas();
  draw();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
}
