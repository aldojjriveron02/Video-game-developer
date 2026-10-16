# Mecha Protocol — Build & Run (Bus-Factor Doc)

## Run locally
```bash
cd ~/workspace/mecha-strategy-game/build
python3 -m http.server 8901
# Open http://localhost:8901
```

## No build step
- Vanilla JS. No npm, no bundler, no transpiler.
- Edit js/*.js, refresh browser. That's it.

## File structure
```
build/
  index.html      # Entry point, loads all JS + CSS
  css/style.css   # All styles
  js/*.js         # 16 modules (see ARCHITECTURE.md)
  audio/          # (empty — Aldo picks 2 Pixabay tracks)
```

## Testing
- `node --check js/*.js` — syntax check all modules.
- Playtest: `~/workspace/mecha-strategy-game/playtest/` (puppeteer).
- Server: restart if connection refused (dies on VM restart).

## Deploy (itch.io)
1. Zip the `build/` folder.
2. Upload to itch.io as HTML project.
3. Set viewport: 1280×720. Mobile: enabled.

## Secrets map (no plaintext here)
- GameAnalytics keys: Aldo's item → `js/telemetry.js` (when provided).
- No other secrets. No API keys in code.
- Password manager: [Aldo's — emergency access configured?]

## Succession
- Inheritor: [Aldo's call — MoMA will pattern; VGHF as backup]
- Code license: [Aldo's call]
- Access: password-manager emergency + Google Inactive Account Manager.
