- 👋 Hi, I’m @ajmalmuhammed2012
- 👀 I’m interested in Tech- AIModel, DotNET, FullStack, Stocks, NFT, BlockChain
- 🌱 I’m learning.....
- 📫 Website: https://ajmalmuhammed2012.github.io/ajmalmuhammed2012/

<!---
ajmalmuhammed2012/ajmalmuhammed2012 is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->

---

## 🛠️ How this Website was Built

This website is a premium, high-performance developer portfolio built with clean vanilla HTML, CSS, and modular JavaScript.

### 📐 Architecture & Key Features

* **Scroll-Driven Cinematic Hero Transitions**: 
  Calculates viewport centering offsets dynamically on DOM load/resize. As you scroll down the `300vh` runway, the elements transition sequentially:
  * **Name Fades Out**: `p ∈ [0, 0.20]`
  * **Role Fades In Centered**: `p ∈ [0.05, 0.20]`
  * **Role Docks**: `p ∈ [0.20, 0.55]` (slides horizontally and vertically from center to its final aligned position).
  * **Visual Runway Buffer**: `p ∈ [0.55, 0.65]` (pause in changes).
  * **Bio details reveal**: `p ∈ [0.65, 0.80]` (slides up and fades in).
  * **Opaque Hold**: `p ∈ [0.80, 1.00]` (stays statically open for reading).

* **Optimized Constellation Background Engine**:
  * **Squared Distance Math**: Replaces computationally heavy square root checks (`Math.hypot`) with fast multiplication checks (`dx * dx + dy * dy < thresholdSq`). Over **90%** of square root operations are avoided per frame.
  * **Zero Jitter Subpixel Coordinates**: Removes integer rounding coordinate updates to allow native browser float coordinates subpixel rendering, resulting in smooth drifting movement.
  * **IntersectionObserver Loop Pause**: Tracks scrolling down to the `#profile` section, fading out the canvas smoothly (reaches `0` opacity by the middle of the Profile section) and pausing the `requestAnimationFrame` render thread to save CPU/GPU cycles.

* **Clean Design & Navigation**:
  * Frosted glass sticky navigation bar with light/dark mode state caching in `localStorage`.
  * Inline responsive vector SVGs inside contact links.
  * Custom cache-busting link versions to bypass aggressive browser caching.
