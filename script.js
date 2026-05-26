// Dynamic Year
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Theme Toggle
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");

    root.setAttribute(
      "data-theme",
      currentTheme === "dark" ? "light" : "dark"
    );
  });
}

// Mobile Menu
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    header.classList.toggle("menu-open");
  });
}

// Hero Canvas
const canvas = document.getElementById("antigravity-canvas");

if (canvas) {

  const ctx = canvas.getContext("2d");

  let width;
  let height;

  const particles = [];

  const resizeCanvas = () => {

    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    particles.length = 0;

    const total = width < 768 ? 18 : 34;

    for (let i = 0; i < total; i++) {

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 1
      });
    }
  };

  const animate = () => {

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {

      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      ctx.fillStyle = "rgba(41,151,255,0.9)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {

        const p2 = particles[j];

        const dx = p.x - p2.x;
        const dy = p.y - p2.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {

          ctx.beginPath();

          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle = "rgba(41,151,255,0.08)";
          ctx.lineWidth = 0.6;

          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  };

  resizeCanvas();
  animate();

  window.addEventListener("resize", resizeCanvas);
}
