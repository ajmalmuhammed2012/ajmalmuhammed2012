const year = document.querySelector("#year");
const header = document.querySelector(".site-header");
const canvas = document.querySelector("#antigravity-canvas");

if (year) {
  year.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = {
    active: false,
    x: 0,
    y: 0,
  };
  const particles = [];
  const links = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const colors = {
    node: "rgba(139, 233, 223, 0.86)",
    nodeSoft: "rgba(216, 180, 95, 0.58)",
    line: "rgba(139, 233, 223, 0.2)",
    lineHot: "rgba(216, 180, 95, 0.34)",
  };

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles.length = 0;
    links.length = 0;

    const spacing = width < 680 ? 58 : 76;
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const offset = row % 2 ? spacing * 0.45 : 0;
        const homeX = col * spacing - spacing * 0.5 + offset;
        const homeY = row * spacing - spacing * 0.5;
        const jitter = Math.sin(row * 13 + col * 7) * 9;

        particles.push({
          homeX: homeX + jitter,
          homeY: homeY - jitter,
          x: homeX + jitter,
          y: homeY - jitter,
          vx: 0,
          vy: 0,
          size: 1.4 + ((row + col) % 4) * 0.45,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    for (let index = 0; index < particles.length; index += 1) {
      const next = index + 1;
      const below = index + cols;

      if (next < particles.length && next % cols !== 0) {
        links.push([index, next]);
      }

      if (below < particles.length) {
        links.push([index, below]);
      }
    }
  };

  const draw = (time = 0) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(3, 5, 7, 0.22)";
    ctx.fillRect(0, 0, width, height);

    const pointerRadius = Math.min(260, Math.max(150, width * 0.2));

    particles.forEach((particle) => {
      const driftX = Math.cos(time * 0.00035 + particle.phase) * 12;
      const driftY = Math.sin(time * 0.00042 + particle.phase) * 10;
      const targetX = particle.homeX + driftX;
      const targetY = particle.homeY + driftY;
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const dist = Math.hypot(dx, dy) || 1;

      if (pointer.active && dist < pointerRadius) {
        const force = (1 - dist / pointerRadius) * 1.45;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 1.9;
        particle.vy -= Math.sin(angle) * force * 1.9;
        particle.vx += -Math.sin(angle) * force * 0.55;
        particle.vy += Math.cos(angle) * force * 0.55;
      }

      particle.vx += (targetX - particle.x) * 0.018;
      particle.vy += (targetY - particle.y) * 0.018;
      particle.vx *= 0.88;
      particle.vy *= 0.88;
      particle.x += particle.vx;
      particle.y += particle.vy;
    });

    links.forEach(([start, end]) => {
      const a = particles[start];
      const b = particles[end];
      const cx = (a.x + b.x) * 0.5;
      const cy = (a.y + b.y) * 0.5;
      const distToPointer = pointer.active ? Math.hypot(pointer.x - cx, pointer.y - cy) : 9999;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = distToPointer < pointerRadius ? colors.lineHot : colors.line;
      ctx.lineWidth = distToPointer < pointerRadius ? 1.15 : 0.7;
      ctx.stroke();
    });

    particles.forEach((particle) => {
      const distToPointer = pointer.active ? Math.hypot(pointer.x - particle.x, pointer.y - particle.y) : 9999;
      const hot = distToPointer < pointerRadius;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, hot ? particle.size + 1.3 : particle.size, 0, Math.PI * 2);
      ctx.fillStyle = hot ? colors.nodeSoft : colors.node;
      ctx.fill();
    });

    if (pointer.active) {
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, pointerRadius);
      glow.addColorStop(0, "rgba(39, 198, 184, 0.16)");
      glow.addColorStop(0.45, "rgba(216, 180, 95, 0.08)");
      glow.addColorStop(1, "rgba(39, 198, 184, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, pointerRadius, 0, Math.PI * 2);
      ctx.fill();
    }

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
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  reduceMotion.addEventListener("change", () => {
    window.cancelAnimationFrame(animationFrame);
    draw();
  });
}
