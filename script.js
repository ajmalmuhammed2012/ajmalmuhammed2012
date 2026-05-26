// Year Sync
const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Light & Dark Mode System Controller
const themeToggle = document.querySelector("#theme-toggle");
const rootElement = document.documentElement;

// Function to get current canvas colors based on active theme
const getCanvasColors = () => {
  const isDarkMode = rootElement.getAttribute("data-theme") === "dark";
  return {
    // Resting Nodes: Futuristic Cyber Teal
    nodeRest: isDarkMode ? "rgba(45, 226, 206, 0.9)" : "rgba(20, 165, 150, 0.85)",
    // Interactive Proximity Nodes: High-Voltage Futuristic Electric Orange
    nodeHover: isDarkMode ? "rgba(255, 110, 0, 0.95)" : "rgba(230, 85, 0, 0.95)",
    // Tracing Matrix Lines: Soft ambient teal lanes
    line: isDarkMode ? "rgba(45, 226, 206, 0.12)" : "rgba(20, 165, 150, 0.08)"
  };
};

let canvasColors = getCanvasColors();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = rootElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    rootElement.setAttribute("data-theme", nextTheme);
    
    // Update canvas colors immediately on toggle
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

    // Density modifier based on screen size to keep it perfectly balanced and non-congested
    const totalParticles = width < 680 ? 45 : 85;

    // Generate non-grid organic constellation coordinates
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
        // Large bold futuristic nodes that highlight clearly across the viewport
        size: 7.5, 
        phase: Math.random() * Math.PI * 2,
        isHovered: false
      });
    }
  };

  const draw = (time = 0) => {
    ctx.clearRect(0, 0, width, height);
    
    // Magnetic action radius for proximity interactions
    const pointerRadius = Math.min(220, width * 0.3);

    // Update Particle Physics & Track Interactive Hover States
    particles.forEach((particle) => {
      const driftX = Math.cos(time * 0.00015 + particle.phase) * 12;
      const driftY = Math.sin(time * 0.00015 + particle.phase) * 12;
      const targetX = particle.homeX + driftX;
      const targetY = particle.homeY + driftY;

      particle.isHovered = false;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const dist = Math.hypot(dx, dy) || 1;
        
        if (dist < pointerRadius) {
          // Change node state to active hover if inside magnetic bubble
          particle.isHovered = true; 
          
          const force = (1 - dist / pointerRadius) * 1.8;
          const angle = Math.atan2(dy, dx);
          // Pushes nodes away smoothly from the pointer cursor
          particle.vx -= Math.cos(angle) * force;
          particle.vy -= Math.sin(angle) * force;
        }
      }

      // Smooth elastic return to home anchor locations
      particle.vx += (targetX - particle.x) * 0.015;
      particle.vy += (targetY - particle.y) * 0.015;
      particle.vx *= 0.84;
      particle.vy *= 0.84;
      particle.x += particle.vx;
      particle.y += particle.vy;
    });

    // Draw Constellation Connection Web Threads
    // Connects nodes organically if they drift near each other rather than using static grid arrays
    const maxLinkDistance = width < 680 ? 90 : 130;
    ctx.lineWidth = 0.6;
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

    // Draw Highlight Constellation Nodes
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      // Swaps node hex values directly if under active mouse proximity
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

  resizeCanvas();
  draw();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
}
