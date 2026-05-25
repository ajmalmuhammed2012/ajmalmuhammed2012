const year = document.querySelector("#year");
const header = document.querySelector(".site-header");
const canvas = document.querySelector("#antigravity-canvas");

if (year) {
  year.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  if (!header) return;

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (canvas) {
  const ctx = canvas.getContext("2d");

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    gradient.addColorStop(0, "#030507");
    gradient.addColorStop(1, "#07131c");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);
}
