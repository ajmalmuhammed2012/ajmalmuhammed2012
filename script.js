/**
 * --- AJMAL MUHAMMED PORTFOLIO ENGINE ---
 * Core client-side script managing scroll transitions, interactive components,
 * hardware-accelerated cursor effects, and the high-performance constellation background.
 */

// ==========================================
// 1. THEME MANAGEMENT SYSTEM (EARLY INIT)
// ==========================================
// This runs immediately (before DOMContentLoaded) to fetch the cached theme setting
// and apply the corresponding attribute to the root document. This avoids the "FOUC"
// (Flash of Unstyled Content) where the page starts light and flashes dark or vice versa.
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme) return savedTheme;
  // If no user preference is cached, query the operating system's light/dark mode preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Instantly apply the theme to the <html> tag so that CSS variables are set before rendering starts.
const initialTheme = getInitialTheme();
document.documentElement.setAttribute("data-theme", initialTheme);

// ==========================================
// 2. DOMContentLoaded EVENT HANDLER
// ==========================================
// Everything below initializes only after the DOM structure is fully loaded.
document.addEventListener("DOMContentLoaded", () => {
  // Store a global reference to the constellation background canvas.
  const canvas = document.querySelector("#antigravity-canvas");

  // --- SET CURRENT COPYRIGHT YEAR ---
  // Programmatically update the copyright footer year to ensure maintenance-free operations.
  const yearEl = document.querySelector("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 3. THEME TOGGLER LOGIC
  // ==========================================
  const themeToggle = document.querySelector("#theme-toggle");
  
  // Holds the dynamic colors for the background constellation nodes and lines.
  // These are updated whenever the user toggles light/dark modes.
  let canvasColors = { nodeRest: "", nodeHover: "", line: "" };
  
  // Return the appropriate color mapping based on the active theme.
  // Using custom translucent colors that blend with the backdrop.
  const getCanvasColors = () => {
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    return {
      // Resting nodes: Vibrant mint teal (dark mode) / Soft dark teal (light mode)
      nodeRest:  isDarkMode ? "rgba(45, 226, 206, 0.95)"  : "rgba(15, 118, 110, 0.9)",
      // Hover nodes: High-contrast orange-red to create a premium glow effect on interaction
      nodeHover: isDarkMode ? "rgba(255, 110, 0, 1)"       : "rgba(184, 68, 0, 1)",
      // Connection lines: Matching translucent hues to remain clean and non-distracting
      line:      isDarkMode ? "rgba(45, 226, 206, 0.75)"   : "rgba(15, 118, 110, 0.65)"
    };
  };

  // Run the initial canvas colors mapping
  canvasColors = getCanvasColors();

  // Listen for clicks on the header theme toggle button.
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      
      // Update HTML attribute (triggers CSS transition) and cache the preference in local storage
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio-theme", nextTheme);
      
      // Force reload canvas colors to match the new theme instantly
      canvasColors = getCanvasColors();
    });
  }

  // ==========================================
  // 4. MOBILE NAVIGATION BAR
  // ==========================================
  // Controls the slide-down menu overlay on mobile and small-tablet screens (< 860px).
  const menuToggle = document.querySelector(".menu-toggle");
  const siteHeader = document.querySelector(".site-header");
  const navLinks   = document.querySelectorAll(".nav-links a");

  if (menuToggle && siteHeader) {
    // Open/Close menu toggle
    menuToggle.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("menu-is-open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking any link inside (auto-scroll behavior)
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        siteHeader.classList.remove("menu-is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside the site header area
    document.addEventListener("click", (e) => {
      if (!siteHeader.contains(e.target) && siteHeader.classList.contains("menu-is-open")) {
        siteHeader.classList.remove("menu-is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ==========================================
  // 5. HARDWARE-ACCELERATED CURSOR SPOTLIGHT
  // ==========================================
  // Captures pointer movement to update CSS custom coordinates variables.
  // Uses requestAnimationFrame to prevent layout thrashing and keep cursor calculations at 60+ FPS.
  let clientX = -9999;
  let clientY = -9999;
  let mouseX = -9999;
  let mouseY = -9999;
  let currentX = -9999;
  let currentY = -9999;
  let isMoving = false;

  const updateSpotlight = () => {
    // Implement simple spring damping to make the spotlight lag behind the mouse pointer smoothly
    if (currentX === -9999) {
      currentX = mouseX;
      currentY = mouseY;
    } else {
      currentX += (mouseX - currentX) * 0.15; // 15% interpolation speed
      currentY += (mouseY - currentY) * 0.15;
    }

    // Set document root variables which CSS radial-gradient reads to position the spotlight
    document.documentElement.style.setProperty("--mouse-x", `${currentX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${currentY}px`);

    // Continue drawing frames if the target coordinates haven't converged yet
    if (Math.abs(currentX - mouseX) > 0.2 || Math.abs(currentY - mouseY) > 0.2) {
      requestAnimationFrame(updateSpotlight);
    } else {
      isMoving = false;
    }
  };

  // Pointer move updates the client target coordinates
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

  // Scroll updates absolute coordinate variables relative to the page height
  window.addEventListener("scroll", () => {
    if (clientX !== -9999) {
      mouseX = clientX + window.scrollX;
      mouseY = clientY + window.scrollY;
      
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateSpotlight);
      }
    }
  }, { passive: true }); // passive: true improves scroll responsiveness by telling browser not to block scrolling on this event

  // ==========================================
  // 6. RESPONSIVE SCROLL-DRIVEN TRANSITIONS
  // ==========================================
  // Tracks scroll progress down the sticky Hero track to orchestrate:
  // - Centered Title fading out
  // - Centered Role fading in and sliding (docking) into its left-aligned column spot
  // - Sub-description (bio) and stats fading in
  // - Background constellation fading out when entering the Profile section
  const nameEl = document.querySelector("#headline-name");
  const roleEl = document.querySelector("#headline-role");
  const revealEl = document.querySelector("#hero-reveal");
  const heroTrack = document.querySelector("#hero-track");
  
  // Holds the static translation offsets (in pixels) required to center the name and role.
  // Calculated dynamically on page load/resize.
  let nameOffset = { x: 0, y: 0 };
  let roleOffset = { x: 0, y: 0 };

  const calculateOffsets = () => {
    if (!nameEl || !roleEl) return;
    
    // Reset transforms to measure the elements' natural layout bounds
    nameEl.style.transform = "none";
    roleEl.style.transform = "none";
    
    const heroEl = document.querySelector("#hero");
    if (!heroEl) return;

    // Viewport coordinates of hero container and titles
    const nameRect = nameEl.getBoundingClientRect();
    const roleRect = roleEl.getBoundingClientRect();
    const heroRect = heroEl.getBoundingClientRect();

    // Center coordinates of the hero container viewport box
    const heroCenterX = heroRect.left + heroRect.width / 2;
    const heroCenterY = heroRect.top + heroRect.height / 2;

    // Center coordinates of the text elements
    const nameCenterX = nameRect.left + nameRect.width / 2;
    const nameCenterY = nameRect.top + nameRect.height / 2;

    const roleCenterX = roleRect.left + roleRect.width / 2;
    const roleCenterY = roleRect.top + roleRect.height / 2;

    // Calculate translation vectors required to align element centers with hero center
    nameOffset.x = heroCenterX - nameCenterX;
    nameOffset.y = heroCenterY - nameCenterY;

    roleOffset.x = heroCenterX - roleCenterX;
    roleOffset.y = heroCenterY - roleCenterY;

    // Execute transitions immediately to snap elements to correct initial positions
    updateScrollTransitions();
  };

  const updateScrollTransitions = () => {
    if (!heroTrack || !nameEl || !roleEl) return;
    
    const trackHeight = heroTrack.offsetHeight;
    const scrollRange = trackHeight - window.innerHeight;
    if (scrollRange <= 0) return;

    // Normalized progress variable p mapped between 0 (top) and 1 (bottom of sticky track)
    const p = Math.max(0, Math.min(1, window.scrollY / scrollRange));

    const isMobile = window.innerWidth < 860;

    // --- PHASE 1 (p: 0 -> 0.20): Name centered and fades out ---
    const pName = Math.max(0, Math.min(1, p / 0.20));
    const nameOpacity = 1 - pName;
    const nameScale = 1.15 - pName * 0.15;
    nameEl.style.opacity = nameOpacity;
    
    // Mobile stays centered horizontally (rx = 0) and only slides vertically
    if (isMobile) {
      nameEl.style.transform = `translate3d(0, ${nameOffset.y}px, 0) scale(${nameScale})`;
    } else {
      nameEl.style.transform = `translate3d(${nameOffset.x}px, ${nameOffset.y}px, 0) scale(${nameScale})`;
    }
    // Toggle pointer events to allow clicking behind text when invisible
    nameEl.style.pointerEvents = nameOpacity > 0.15 ? "auto" : "none";

    // --- PHASE 2 (p: 0.05 -> 0.20) & PHASE 3 (p: 0.20 -> 0.55): Role centered, then docks ---
    const pRoleIn = Math.max(0, Math.min(1, (p - 0.05) / 0.15));
    const roleOpacity = pRoleIn;
    
    let rx, ry, rs;
    if (p < 0.20) {
      // Role remains fully centered inside the viewport
      rx = isMobile ? 0 : roleOffset.x;
      ry = roleOffset.y;
      rs = 1.15;
    } else {
      // Role slides from center position to natural docked position at the top of the bio section
      const pDock = Math.max(0, Math.min(1, (p - 0.20) / 0.35));
      rx = isMobile ? 0 : roleOffset.x * (1 - pDock);
      ry = roleOffset.y * (1 - pDock);
      rs = 1.15 - pDock * 0.15;
    }
    roleEl.style.opacity = roleOpacity;
    roleEl.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${rs})`;

    // --- PHASE 4 (p: 0.65 -> 0.80): Bio details slide/fade in ---
    // At p = 0.55 -> 0.65, we have a scroll runway buffer where nothing transitions,
    // keeping "Software Engineer" locked in place before the bio reveals.
    if (revealEl) {
      const pReveal = Math.max(0, Math.min(1, (p - 0.65) / 0.15));
      revealEl.style.opacity = pReveal;
      revealEl.style.transform = `translate3d(0, ${20 * (1 - pReveal)}px, 0)`;
      revealEl.style.pointerEvents = pReveal > 0.15 ? "auto" : "none";
    }

    // --- STICKY HEADER VISIBILITY LATCH ---
    // Dynamically show the main navigation header after scroll reaches 50% or scrollY > 150px
    if (p > 0.50 || window.scrollY > 150) {
      document.documentElement.classList.add("header-visible");
    } else if (window.scrollY < 20) {
      document.documentElement.classList.remove("header-visible");
    }

    // --- CONSTELLATION SCROLL FADE-OUT ---
    // Fades out the canvas background smoothly as the user scrolls into the Profile section.
    const profileEl = document.querySelector("#profile");
    if (profileEl && canvas) {
      const profileRect = profileEl.getBoundingClientRect();
      // Start fading when top of Profile reaches middle of screen.
      const startFade = window.innerHeight / 2;
      // Complete fade-out to 0 when top of Profile reaches top of screen.
      const endFade = 0;
      
      let canvasOpacity = 1;
      if (profileRect.top <= startFade) {
        if (profileRect.top <= endFade) {
          canvasOpacity = 0;
        } else {
          // Linearly interpolate between 1 and 0
          canvasOpacity = Math.max(0, Math.min(1, profileRect.top / startFade));
        }
      }
      canvas.style.opacity = canvasOpacity;
    }
  };

  // Scroll listener throttled inside requestAnimationFrame to prevent lagging
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

  // Calculate layout offsets after fonts load to guarantee correct element boundaries
  if (document.fonts) {
    document.fonts.ready.then(calculateOffsets);
  }
  window.addEventListener("load", calculateOffsets);
  calculateOffsets();

  // ==========================================
  // 7. OPTIMIZED CONSTELLATION ENGINE
  // ==========================================
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

    // Rescale canvas buffer on screen resize and configure particle count
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particles.length = 0;
      // Small particle count to stay ultra-lightweight and run smoothly on low-end systems
      const total = width < 860 ? 8 : 18;
      
      for (let i = 0; i < total; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35, // slow drift velocities
          vy: (Math.random() - 0.5) * 0.35,
          size: 5.5
        });
      }
    };

    const draw = () => {
      // Loop halts completely if the Canvas element is scrolled out of view, reducing CPU load to 0
      if (!canvasActive) return;

      ctx.clearRect(0, 0, width, height);

      // Track scroll velocity momentum to flow the particles upwards dynamically on scroll
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
        const driftY = -smoothedVelocity * 0.18; // upwards wind drift on scroll

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

        // --- OPTIMIZATION (SQUARED DISTANCE MOUSE REPULSION) ---
        // Avoid computing square roots (Math.hypot / Math.sqrt) unless coordinates are in range.
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < 25600) { // 160 * 160 (distance squared check)
            const d = Math.sqrt(dSq); // compute square root only when close
            if (d > 0) {
              p.x -= (dx / d) * 0.8;
              p.y -= (dy / d) * 0.8;
            }
          }
        }
      });

      // --- OPTIMIZATION (SQUARED DISTANCE CONSTELLATION LINES) ---
      // We skip expensive distance checking calculations by doing a simple squared math check.
      const pCount = particles.length;
      for (let i = 0; i < pCount; i++) {
        for (let j = i + 1; j < pCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) { // 120 * 120 (squared draw range)
            const dist = Math.sqrt(distSq); // only run square root when connection line is drawn
            ctx.globalAlpha = 1 - dist / 120;
            ctx.beginPath();
            // Draw floating point coordinates directly to enable browser subpixel rendering.
            // This stops moving nodes from "jittering" or vibrating across pixel bounds.
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw particle circles
      particles.forEach(p => {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dSq = dx * dx + dy * dy;
        const near = pointer.active && dSq < 25600; // 160 * 160
        const sizeMult = near ? 1 + 0.5 * (1 - Math.sqrt(dSq) / 160) : 1;

        ctx.beginPath();
        // Use exact floating point coordinates for subpixel rendering
        ctx.arc(p.x, p.y, p.size * sizeMult, 0, Math.PI * 2);
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

    // --- INTERSECTION OBSERVER TO PAUSE CANVAS ---
    // Automatically halts animation draw loop when we have scrolled completely past the Profile section.
    // This saves CPU cycles, GPU resources, and battery on low-end systems.
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

    // Observe all sections where the canvas should be visible and actively drawing
    document.querySelectorAll("#hero, #track-record, #profile").forEach(sec => {
      if (sec) canvasObserver.observe(sec);
    });
    
    resizeCanvas();
    draw();
  }

  // ==========================================
  // 8. ELEMENT SCROLL REVEALS
  // ==========================================
  // Adds entrance transitions to cards and title blocks as they enter the screen.
  const revealElements = document.querySelectorAll(".scroll-reveal");
  if (revealElements.length > 0) {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: "0px 0px -60px 0px" // Trigger slightly before the element rises on screen
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          revealObserver.unobserve(entry.target); // Trigger only once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  }
});
