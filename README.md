# Ajmal Muhammed | Senior Software Engineer Portfolio

An enterprise-grade, high-performance, single-page developer portfolio built with clean vanilla HTML, CSS, and modular JavaScript. Features cinematic, scroll-synchronized layout animations and high-performance, hardware-friendly vector backgrounds.

## 🚀 Live Site
* **Live Deployment**: [ajmalmuhammed2012.github.io/ajmalmuhammed2012](https://ajmalmuhammed2012.github.io/ajmalmuhammed2012/)

---

## 🛠️ Technology Stack
1. **Core Layout & Semantics**: Semantic HTML5 markup, ARIA accessibility attributes, and inline responsive vector SVGs.
2. **Styling & Presentation**: Responsive CSS3 styling utilizing variables (tokens) for color themes (Dark/Light), Flexbox/Grid layouts, and CSS transitions.
3. **Behavioral Engine**: Vanilla ES6 JavaScript handling theme synchronization, scroll transitions, spotlight effects, and the constellation background.

---

## 📐 Architecture & Features

### 1. Scroll-Driven Cinematic Hero Transitions
The landing page relies on an extended sticky timeline model (`hero-scroll-track` height of `300vh` on desktop / `255vh` on mobile). As the user scrolls, a sticky hero container remains relative to the screen while JavaScript tracks scroll position depth ($p \in [0, 1]$) to perform sequential transitions:
* **Name Fades Out** ($p \in [0, 0.20]$)
* **Role Fades In Centered** ($p \in [0.05, 0.20]$)
* **Role Slides & Docks** ($p \in [0.20, 0.55]$): Slides horizontally and vertically from viewport center to its final column placement at the top of the bio section.
* **Role Hold Runway** ($p \in [0.55, 0.65]$): A scroll transition buffer where elements remain static.
* **Bio Reveal & Fade In** ($p \in [0.65, 0.80]$): The introduction paragraph and metrics card group slides up into place.
* **Opaque Hold (Read Section)** ($p \in [0.80, 1.00]$): Statically holds all visual states fully opaque for a comfortable reading period before pulling away to the next section.

### 2. High-Performance Constellation background
The canvas animation represents a floating nodes network. It is optimized to run smoothly on any device:
* **No Node Jitter (Subpixel Rendering)**: Removed coordinate rounding (`Math.round`) from coordinates updates, allowing the browser's rendering engine to perform float subpixel transitions without visual coordinate snapping.
* **Squared Distance checks**: Standard canvas collision checks use `Math.hypot` or `Math.sqrt` which are mathematically expensive. This engine performs a preliminary squared distance check ($dx^2 + dy^2 < threshold^2$) to verify proximity, only executing `Math.sqrt` when drawing connections. This bypasses over **90%** of square root operations per frame.
* **Scroll-Synchronized Fade-out**: An `IntersectionObserver` tracks the `#profile` section top bounds. The canvas starts fading out as the Profile heading enters the viewport ($profileRect.top \le window.innerHeight / 2$) and reaches $0$ opacity when the heading reaches the top of the viewport ($profileRect.top = 0$).
* **Automatic Thread Pausing**: When the canvas is fully faded out ($opacity = 0$), the requestAnimationFrame loop is automatically paused to reduce CPU/GPU load to 0. It resumes animating when the user scrolls back up.

### 3. Glassmorphic Sticky Navigation
* Frosted glass sticky header bar utilizing CSS `backdrop-filter: blur(20px)` and `-webkit-backdrop-filter`.
* Persistent theme state synchronization matching client system defaults or caching manual overrides in `localStorage`.
* Fluid mobile navigation overlay triggering on screen widths $< 860\text{px}$.

---

## 💻 Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/ajmalmuhammed2012/ajmalmuhammed2012.git
   ```
2. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open in your browser:
   [http://localhost:8000](http://localhost:8000)
