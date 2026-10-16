# PWA Packaging for iPhone — Findings (Round 19)
**Date:** Tue 2026-10-13 ~21:40 EDT · **Source:** live web research 2026-10-13 (MDN, web.dev, Apple docs, WebKit blogs, itch/GitHub/Cloudflare docs)
**Project:** Mecha Protocol — installable like a native app, no App Store ($0, no $99/yr dev account)

## A. Manifest deep-dive
- All members technically optional; Chrome installability needs: name/short_name, **192px + 512px icons**, start_url, display standalone+, no prefer_related_applications, HTTPS, engagement (1 tap + 30s on page).
- Recommended: short_name ≤12 chars ("Mecha"), maskable icon (Android masks shapes; without it = letterboxed), theme_color, background_color, start_url `/?source=pwa` (distinguish launches), scope `/`, description, id (iOS 16.4+, prevents dup installs). Orientation: `any` for us (responsive layout handles both).
- **#1 installability failure: missing 512px icon.** Others: icons not actual pixel size, missing `<link rel="manifest">`, start_url 404/off-scope, scope narrower than start_url.

## B. Service worker recipe (~30 lines)
- install: `caches.open('mecha-v1')` → `addAll([...])` → `skipWaiting()`; activate: delete non-current caches → `clients.claim()`; fetch: cache-first `caches.match || fetch`.
- Version by bumping cache name per deploy; skipWaiting+claim = immediate update (iOS home-screen users never "close tabs").
- HTTPS mandatory; scope = SW's directory (put sw.js at root).
- **Gotchas:** `addAll` is ALL-OR-NOTHING (one 404 = nothing caches — test the list!); keep cached set lean (quota eviction); cross-origin CDN = opaque responses; update the file list when filenames change.

## C. iOS quirks (verified vs folklore)
- **Standalone:** `<meta name="apple-mobile-web-app-capable" content="yes">` AND manifest `display: standalone` (iOS 16.4+ = true home-screen app, separate process). Do both — covers old + new iOS.
- **Icon:** `<link rel="apple-touch-icon" sizes="180x180">`; manifest icons take precedence since iOS 15.4 — ship both.
- **Splash:** `apple-touch-startup-image` per-device media queries — iOS will NOT scale one image; ~12 links for full coverage. Cheapest robust: solid-color PNG + centered logo per size (1170×2532, 1290×2796 cover modern iPhones).
- **Status bar:** `black` / `default` / `black-translucent`. Title: `apple-mobile-web-app-title`.
- **7-day eviction = mostly folklore for home-screen apps:** WebKit gives installed web apps their OWN usage counter resetting on every open — "We do not expect... website data deleted... we would consider it a serious bug." Only truly abandoned installs at risk. localStorage persists normally in standalone.
- **Audio:** needs user gesture; standalone changes nothing — our `SFX.ensure()` on first tap ✅ already correct.
- iOS 16.4+: third-party-browser A2HS, web push, wake lock, orientation API.

## D. Installability detection
- `beforeinstallprompt` NOT on iOS — manual Share → Add to Home Screen + custom hint required.
- `isStandalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true`.
- Show iOS hint only when: not standalone + iOS device + not previously dismissed (localStorage).

## E. itch.io + PWA = NO
- itch embeds in an IFRAME on its HTML CDN; manifest/SW evaluated against the TOP-LEVEL doc (the itch page) — never discovered. No header control, scope capped.
- **Practical:** itch.io = discoverable free demo; own free hosting = installable PWA; prominent "Installable iPhone version →" link on the itch page and in-game.

## F. Free hosting comparison
- **Cloudflare Pages (recommended primary):** free HTTPS + `_headers` file for custom headers (manifest Content-Type, cache rules: never cache sw.js/index.html, long-cache assets, Service-Worker-Allowed if needed). Git deploys.
- GitHub Pages: free HTTPS, zero custom headers — fine fallback for basic PWA.
- itch.io: distribution/demo only. All $0.

## G. Testing checklist
- Lighthouse PWA category DEPRECATED → manual checks. Chrome DevTools Application panel: manifest parses clean, icons 192+512 listed, SW activated + controlling, offline checkbox → reload → game loads. Update flow: bump cache version → reload twice → new SW active, old cache deleted.
- **iOS acceptance:** Safari → Share → A2HS → icon appears → launch (no address bar, splash flashes) → Airplane Mode → kill + relaunch → fully playable offline → saves persist → status bar/orientation correct.
- Done = fullscreen standalone + offline + persistent saves + updates work + zero console errors.

## Applied to Mecha Protocol (implement-immediately, this round)
- manifest.json: full (name, short_name "Mecha", 192+512+maskable icons, theme/background colors, start_url with ?source=pwa, scope, orientation any, id, description).
- Generated icon set (PIL, paper-doll style): icon-192, icon-512, maskable-512 (safe-zone padding), apple-touch-icon 180.
- Splash screens: 1170×2532 + 1290×2796 (solid bg + centered logo).
- sw.js: ~30-line cache-first recipe (versioned cache, skipWaiting+claim, lean file list).
- index.html: SW registration, apple meta/link tags, startup images.
- iOS A2HS hint: shows only when iOS + not standalone + not dismissed (persisted dismissal).
- Hosting note: Cloudflare Pages recommended for the installable build; itch.io hosts the demo linking to it.

## H. Sources
MDN (manifest, installability, service workers, display-mode, autoplay) · web.dev/articles/install-criteria · Apple Configuring Web Applications (archived) · WebKit blogs (Mar 2020 storage, Feb 2023 iOS 16.4) · favicontools.com (startup-image mechanics) · itch.io/docs/creators/html5 · docs.github.com (Pages HTTPS) · developers.cloudflare.com/pages/configuration/headers/ · developer.chrome.com/docs/lighthouse/pwa (deprecation)
Research-only; nothing changed/signed/purchased.
