// --- THEME MANAGEMENT SYSTEM ---
// Initialize theme early to avoid style flash
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme) return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialTheme = getInitialTheme();
document.documentElement.setAttribute("data-theme", initialTheme);

document.addEventListener("DOMContentLoaded", () => {
  // --- SET CURRENT COPYRIGHT YEAR ---
  const yearEl = document.querySelector("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- THEME TOGGLER LOGIC ---
  const themeToggle = document.querySelector("#theme-toggle");
  let canvasColors = { nodeRest: "", nodeHover: "", line: "" };
  
  const getCanvasColors = () => {
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    return {
      nodeRest:  isDarkMode ? "rgba(45, 226, 206, 0.95)"  : "rgba(15, 118, 110, 0.9)",
      nodeHover: isDarkMode ? "rgba(255, 110, 0, 1)"       : "rgba(184, 68, 0, 1)",
      line:      isDarkMode ? "rgba(45, 226, 206, 0.75)"   : "rgba(15, 118, 110, 0.65)"
    };
  };

  canvasColors = getCanvasColors();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio-theme", nextTheme);
      canvasColors = getCanvasColors();
    });
  }

  // --- MOBILE NAVIGATION BAR ---
  const menuToggle = document.querySelector(".menu-toggle");
  const siteHeader = document.querySelector(".site-header");
  const navLinks   = document.querySelectorAll(".nav-links a");

  if (menuToggle && siteHeader) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("menu-is-open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        siteHeader.classList.remove("menu-is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!siteHeader.contains(e.target) && siteHeader.classList.contains("menu-is-open")) {
        siteHeader.classList.remove("menu-is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- HARDWARE-ACCELERATED CURSOR SPOTLIGHT ---
  let clientX = -9999;
  let clientY = -9999;
  let mouseX = -9999;
  let mouseY = -9999;
  let currentX = -9999;
  let currentY = -9999;
  let isMoving = false;

  const updateSpotlight = () => {
    if (currentX === -9999) {
      currentX = mouseX;
      currentY = mouseY;
    } else {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
    }

    document.documentElement.style.setProperty("--mouse-x", `${currentX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${currentY}px`);

    if (Math.abs(currentX - mouseX) > 0.2 || Math.abs(currentY - mouseY) > 0.2) {
      requestAnimationFrame(updateSpotlight);
    } else {
      isMoving = false;
    }
  };

  window.addEventListener("pointermove", (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
    mouseX = clientX + window.scrollX;
    mouseY = clientY + window.scrollY;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(updateSpotlight);
    }
  });

  window.addEventListener("scroll", () => {
    if (clientX !== -9999) {
      mouseX = clientX + window.scrollX;
      mouseY = clientY + window.scrollY;
      
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateSpotlight);
      }
    }
  }, { passive: true });

  // --- RESPONSIVE SCROLL-DRIVEN TRANSITIONS ---
  const nameEl = document.querySelector("#headline-name");
  const roleEl = document.querySelector("#headline-role");
  const revealEl = document.querySelector("#hero-reveal");
  const heroTrack = document.querySelector("#hero-track");
  
  let nameOffset = { x: 0, y: 0 };
  let roleOffset = { x: 0, y: 0 };

  const calculateOffsets = () => {
    if (!nameEl || !roleEl) return;
    
    // Reset transforms to get natural coordinate bounds
    nameEl.style.transform = "none";
    roleEl.style.transform = "none";
    
    const heroEl = document.querySelector("#hero");
    if (!heroEl) return;

    // Viewport coordinates of hero and titles
    const nameRect = nameEl.getBoundingClientRect();
    const roleRect = roleEl.getBoundingClientRect();
    const heroRect = heroEl.getBoundingClientRect();

    // Center coordinates of the hero container
    const heroCenterX = heroRect.left + heroRect.width / 2;
    const heroCenterY = heroRect.top + heroRect.height / 2;

    // Center coordinates of the text elements (when transform is none)
    const nameCenterX = nameRect.left + nameRect.width / 2;
    const nameCenterY = nameRect.top + nameRect.height / 2;

    const roleCenterX = roleRect.left + roleRect.width / 2;
    const roleCenterY = roleRect.top + roleRect.height / 2;

    // Translation required to align text centers with hero center
    nameOffset.x = heroCenterX - nameCenterX;
    nameOffset.y = heroCenterY - nameCenterY;

    roleOffset.x = heroCenterX - roleCenterX;
    roleOffset.y = heroCenterY - roleCenterY;

    updateScrollTransitions();
  };

  const updateScrollTransitions = () => {
    if (!heroTrack || !nameEl || !roleEl) return;
    
    const trackHeight = heroTrack.offsetHeight;
    const scrollRange = trackHeight - window.innerHeight;
    if (scrollRange <= 0) return;

    const p = Math.max(0, Math.min(1, window.scrollY / scrollRange));

    const isMobile = window.innerWidth < 860;

    // Phase 1 (0 -> 0.3): Name centered and fades out
    const pName = Math.max(0, Math.min(1, p / 0.3));
    const nameOpacity = 1 - pName;
    const nameScale = 1.15 - pName * 0.15;
    nameEl.style.opacity = nameOpacity;
    
    if (isMobile) {
      nameEl.style.transform = `translate3d(0, ${nameOffset.y}px, 0) scale(${nameScale})`;
    } else {
      nameEl.style.transform = `translate3d(${nameOffset.x}px, ${nameOffset.y}px, 0) scale(${nameScale})`;
    }
    nameEl.style.pointerEvents = nameOpacity > 0.15 ? "auto" : "none";

    // Phase 2 (0.1 -> 0.4) & 3 (0.45 -> 0.85): Role fades in centered, then docks
    const pRoleIn = Math.max(0, Math.min(1, (p - 0.1) / 0.3));
    const roleOpacity = pRoleIn;
    
    let rx, ry, rs;
    if (p < 0.45) {
      rx = isMobile ? 0 : roleOffset.x;
      ry = roleOffset.y;
      rs = 1.15;
    } else {
      const pDock = Math.max(0, Math.min(1, (p - 0.45) / 0.4));
      rx = isMobile ? 0 : roleOffset.x * (1 - pDock);
      ry = roleOffset.y * (1 - pDock);
      rs = 1.15 - pDock * 0.15;
    }
    roleEl.style.opacity = roleOpacity;
    roleEl.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${rs})`;

    // Phase 4 (0.55 -> 0.9): Bio details fade in
    if (revealEl) {
      const pReveal = Math.max(0, Math.min(1, (p - 0.55) / 0.35));
      revealEl.style.opacity = pReveal;
      revealEl.style.transform = `translate3d(0, ${20 * (1 - pReveal)}px, 0)`;
      revealEl.style.pointerEvents = pReveal > 0.15 ? "auto" : "none";
    }

    // Toggle Sticky Header visibility: latch once scrolled, hide only at top
    if (p > 0.55 || window.scrollY > 150) {
      document.documentElement.classList.add("header-visible");
    } else if (window.scrollY < 20) {
      document.documentElement.classList.remove("header-visible");
    }
  };

  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        updateScrollTransitions();
        scrollTicking = false;
      });
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    calculateOffsets();
  });

  // Calculate layout offsets after fonts and stylesheets load to guarantee pixel-perfect centering
  if (document.fonts) {
    document.fonts.ready.then(calculateOffsets);
  }
  window.addEventListener("load", calculateOffsets);
  calculateOffsets();

  // --- OPTIMIZED ANTIGRAVITY CONSTELLATION ENGINE ---
  const canvas = document.querySelector("#antigravity-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const pointer = { active: false, x: 0, y: 0, tx: 0, ty: 0 };
    const particles = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    let lastScrollY = window.scrollY;
    let targetVelocity = 0;
    let smoothedVelocity = 0;
    let canvasActive = true;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particles.length = 0;
      // Drastically reduced counts to save CPU/GPU fillrate
      const total = width < 860 ? 15 : 30;
      
      for (let i = 0; i < total; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: 5.5
        });
      }
    };

    const draw = () => {
      // Loop halts completely if the Canvas element scrolls out of view
      if (!canvasActive) return;

      ctx.clearRect(0, 0, width, height);

      // Track scroll speed momentum drift
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      targetVelocity = Math.min(scrollDelta, 100);
      smoothedVelocity += (targetVelocity - smoothedVelocity) * 0.08;

      // Soft spring follow effect for pointer coordinates
      if (pointer.active) {
        pointer.x += (pointer.tx - pointer.x) * 0.08;
        pointer.y += (pointer.ty - pointer.y) * 0.08;
      }

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = canvasColors.line;

      // Update positions
      particles.forEach(p => {
        const speedMult = 1 + smoothedVelocity * 0.05;
        const driftY = -smoothedVelocity * 0.18; // upward flow

        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult + driftY;

        // Bounce horizontal bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;

        // Wrap vertical bounds
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        } else if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }

        // Mouse repulsion
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 160) {
            p.x -= (dx / d) * 0.8;
            p.y -= (dy / d) * 0.8;
          }
        }
      });

      // Draw lines between nearby particles
      const pCount = particles.length;
      for (let i = 0; i < pCount; i++) {
        for (let j = i + 1; j < pCount; j++) {
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
      ctx.globalAlpha = 1.0;

      // Draw particle circles
      particles.forEach(p => {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d = Math.hypot(dx, dy);
        const near = pointer.active && d < 160;
        const sizeMult = near ? 1 + 0.5 * (1 - d / 160) : 1;

        ctx.beginPath();
        ctx.arc(Math.round(p.x), Math.round(p.y), p.size * sizeMult, 0, Math.PI * 2);
        ctx.fillStyle = near ? canvasColors.nodeHover : canvasColors.nodeRest;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", () => {
      resizeCanvas();
    });

    window.addEventListener("pointermove", (e) => {
      pointer.active = true;
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    });

    document.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    // IntersectionObserver to pause/resume the canvas draw loop and control visibility
    const activeSections = new Set();
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSections.add(entry.target.id);
        } else {
          activeSections.delete(entry.target.id);
        }
      });

      const shouldBeActive = activeSections.size > 0;
      if (shouldBeActive) {
        canvas.style.opacity = "1";
        const wasActive = canvasActive;
        canvasActive = true;
        if (!wasActive) {
          requestAnimationFrame(draw); // resume loop
        }
      } else {
        canvas.style.opacity = "0";
        canvasActive = false;
      }
    }, { threshold: 0.01 });

    // Observe all sections from the top down to the end of the AI Leverage section
    document.querySelectorAll("#hero, #track-record, #profile, #ai").forEach(sec => {
      if (sec) canvasObserver.observe(sec);
    });
    
    resizeCanvas();
    draw();
  }

  // --- INTERSECTION OBSERVER FOR OTHER SCROLL REVEALS ---
  const revealElements = document.querySelectorAll(".scroll-reveal");
  if (revealElements.length > 0) {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: "0px 0px -60px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  }
});
