<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>Built with AI Studio</h1>

  <p>The fastest path from prompt to production with Gemini.</p>

  <a href="https://aistudio.google.com/apps">Start building</a>

</div>

## Project Structure

This project now keeps presentation, styling, and game logic in dedicated files so it is easier to maintain as new features land:

- `wow-pvp-duel-game.html` – HTML shell that wires together the UI and loads the assets.
- `styles.css` – Standalone stylesheet for every HUD component and overlay.
- `main.js` – The complete Three.js powered duel simulation and UI controller.

## Local Development

Open `wow-pvp-duel-game.html` in any modern browser to play the duel locally. Changes to `styles.css` or `main.js` are picked up on refresh. For an even smoother workflow, run a lightweight static server such as `python -m http.server` from the project root and visit `http://localhost:8000`.

## Next Steps

With the code split into logical layers, you can now:

- Add build tooling or linting targeted to JavaScript or CSS specifically.
- Expand the game logic in `main.js` without wrestling with embedded markup.
- Introduce additional pages that share the same styles or scripts.

This structure should make future iterations and contributions significantly easier.
