# Rogue vs Mage

The duel now boots through a small React + Vite shell so that the HUD markup can live in JSX while the original Three.js gameplay stays untouched in `public/main.js`.

## Project Structure

- `index.html` – Vite entry document that loads React and the legacy Three.js scripts from CDNs.
- `src/App.tsx` – Renders the HUD, control panels, and canvas that the legacy engine expects.
- `src/styles.css` – Consolidated styling for both the legacy layout and the modern HUD treatment.
- `public/main.js` – The original game logic wrapped in a `startGame()` bootstrap so it can wait for React to finish rendering.
- `wow-pvp-duel-game.html` – Previous static prototype kept around for reference.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start a dev server with hot reload:
   ```bash
   npm run dev
   ```
3. Open the printed local URL. The legacy duel will start once the page is ready.

To produce a static build run `npm run build`, then serve the `dist/` folder (`npm run preview` spins up a local preview server automatically).

## Notes

- The Three.js libraries are still loaded from CDNs. Swap them for npm dependencies when you are ready to own the render pipeline inside the bundler.
- Because `public/main.js` manipulates the DOM directly, avoid re-rendering or conditionally unmounting the HUD nodes from React until the legacy logic is migrated.
