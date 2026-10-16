# itch.io Launch Execution — Findings (Round 16)
**Date:** Tue 2026-10-13 ~21:19 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Protocol prototype → free itch.io HTML5 launch → playtester recruiting

## A. Page craft (what converts views → plays)
- **Cover:** 630×500 (63:50 ratio); communicate GAMEPLAY not logo; keep elements from edges (aggressive cropping); no cover = itch auto-generates from screenshots (worse). Covers show in browse, not on the page.
- **Screenshots/GIFs:** first screenshot = fallback cover → must read as core gameplay at thumbnail size. itch: "An animated GIF is a great way to make your page pop" — GIFs go in screenshot slots. **Banner = "the most important graphic" on the page** (wide/horizontal, replaces title).
- **Short description:** 1–2 sentences, "like a movie tagline or a tweet" — appears in browse/search/embeds, must sell alone. Formula: genre + hook + differentiator. (Hex Die: "time-freezing tactics game where your only weapon is a very special die.")
- **Body:** credits, contact, specs, controls/input, story summary, feature list, dev status/plans, links. For a prototype: state FREE prototype, list 3 missions, controls (touch + mouse), feedback CTA + survey link.
- **Tags:** 10+ for discoverability. Ours: Tactics, Turn-Based, Strategy, Strategy RPG, Mecha, Sci-fi, Anime, Singleplayer, Free, Play in browser.
- **Trailer:** paste URL → "Watch trailer" button on grid pop-overs (even a 30s GIF-cut helps).
- **Examples:** Hex Die (free browser tactics; one-line hook + emoji bullets); Project Landsword (solo mecha tactics; concrete numbers "7 missions, 14 weapons"; 8 devlogs; 766 comments with dev replying; Steam wishlist CTA). Lessons: free removes friction; concrete feature numbers build trust; active devlogs + dev replies signal a living project.

## B. HTML5 setup gotchas (itch docs, verified)
- **Two embed modes:** "Embed in page" (iframe, you set viewport) vs "Click to launch in fullscreen." **Mobile ALWAYS uses click-to-launch** regardless of setting → test that page carefully.
- **Keep Click to Play ON:** auto-start "may cause your game to start with audio muted" — plus click-to-play guarantees the first audio interaction is user-gestured (iOS-safe). ✅ matches our SFX.ensure() design.
- Check **"mobile friendly"** flag or mobile visitors see a warning. Fullscreen button needs allowFullScreen implemented.
- **ZIP limits:** ≤1000 files, 240-char paths, 500MB extracted, 200MB single file, UTF-8 names, **index.html at archive root.**
- **Pitfalls:** raw files instead of ZIP; absolute paths (use relative); case-sensitive filenames; external resources must be HTTPS; 403 = bad paths, 404 = missing files. **Draft mode** to verify privately before going live.

## C. Screenshots and GIFs that sell tactics
- **GIFs in screenshot slots** — motion sells tactics. "A five second gif of the feature in motion stops the scroll... nothing gets posted without a moving image at the top."
- **Specs:** ~5s clips; 15fps sweet spot (10–12 UI, 20–25 fast motion); never <20ms frame delays (browsers clamp to 100ms); 10s@480px ≈ 3–8MB; shrink order: dimensions → trim loop → lossy. Need 30fps+? Use MP4/WebM.
- **Capture list for us:** (1) mid-battle with enemy intent lines (signature tactics read); (2) limb-destruction moment (USP, 3–5s GIF); (3) hangar part-swapping (customization depth); (4) heat spike/overheat UI; (5) victory screen.
- **Free tools:** ScreenToGif (capture as GIF/video), OBS Studio, ezgif.com (crop/resize/optimize/fps).

## D. Recruiting copy + survey design
- **r/playtesters:** text posts only; "Unpaid Playtest" flair; short description + feedback method required; max 2/week; ~4.9K weekly visitors. **Title format:** "[Unpaid] Browser tactics prototype — anime mecha, 3 missions (~30 min)".
- **Body covers 4 things:** what it is (2 sentences); requirements (browser, mobile-friendly, ~30 min, deadline); exactly what feedback (never "is it good?"); what testers get (credits, devlog shout-out, round-2 invite). Screen for behavior not enthusiasm (genre fluency, platform match, one open-ended effort question). Don't use friends/family (except launch check).
- **Survey (PlayProbe — best source):** avoid (1) verdicts ("did you enjoy combat?"), (2) "be the designer" ("what would you add?"), (3) asking too late, (4) >8 questions. Structure: pre-play (genre exp, device, expectations from title/screenshot) + post-play core 8 (rating, describe in one sentence, confusion point + when, difficulty, best moment, keep playing?, first change). Ratings only for trend lines vs own builds; yes/no + "tell me more"; max 2–3 open text; one question = one thing; every question must pass "so what would I change based on this answer?"; identical wording between builds; state survey length.
- **One hypothesis per session** ("does the player understand the heat system?") — not "is the game fun." Bug-report shape: title, setup, steps, expected vs actual, frequency, impact.

## E. Feedback triage
- **Framework (Sinfull):** "Every bug goes on a list. Not every bug gets fixed." Sort by: (1) blocks progress? (2) destroys trust? (3) time to fix? Buckets: progress blockers → trust-destroyers → rest weighed vs time. **Severity is relative to when hit** — heat/limb confusion in mission 1 = ship stopper; balance nit in mission 3 = patch note.
- **Ignore:** single-tester feature requests ("add multiplayer"); contradictory taste (trust patterns, not individuals); verdict-without-behavior (triangulate say vs did — "if someone says 'controls felt fine' but spent 90s remapping keys, the behavior is the truth"). Separate severity from frustration.
- **Process:** log immediately (repro, severity, date, build); rounds of 5–8, fix, re-test with FRESH testers ("onboarding testers are 'spent' forever"); reply to every tester; credits on itch page; devlog before/after → round-2 bench.

## F. Devlog strategy (PokeIndie)
- Post progress not perfection (rough funny-broken clip > silent polished trailer); 2–3 platforms on rhythm; **lead with a GIF every time**; show failure states + before/afters (most reshared format); **weekly cadence** beats daily burnout (post the miss rather than going silent); reply to everyone; put undecided design questions to the audience; end every post with CTA (play, survey, follow); track plays/follows per post, not likes.
- Mistakes: going dark after a strong week; only good news; "soon" (say what's left instead).
- itch devlogs live in the Development log section; community pages host playtest threads. **Devlog doubles as recruiting:** each update carries page link + survey link + one concrete question; round-2 posts show what round-1 feedback changed.

## G. Numbers reality (calibrated expectations)
- Small free itch game: **442 views → 63 downloads (14%) over 16 days**, ~27 views/day incl. launch burst, "died a few days later." Reddit #1 traffic; $10 FB ad = 0 downloads. Without promotion: single/low-double-digit views/day — browse traffic doesn't come on its own.
- Featuring (ceiling, not plan): ~500/day during, ~100/day for 3 months after, 5–10/day baseline.
- r/playtesters: strong posts get dozens of comments, but comments ≠ completions — **expect single-digit completed surveys per post.** PlayProbe: 5–8 testers/round; "6 thorough reads beat 24 skimmed."
- **Calibrated target: 5–8 quality survey responses per round = SUCCESS.** Recruit ~25% more than target.

## H. Sources
itch.io/docs/creators/quality-guidelines · itch.io/docs/creators/design · itch.io/docs/creators/html5 · itch.io/docs/creators/interact · morganquirk.itch.io/hexdie · mezzaninesoftware.itch.io/landsword · itch.io/games/tag-tactics · itch.io/games/tag-mecha · reddit.com/r/playtesters/ (+ posting guidelines) · playprobe.io/blog/playtest-survey-questions-that-get-real-answers · playprobe.io/blog/how-many-playtesters-do-you-need · gamexcel.gg/blog/recruiting-playtesters · playtestgames.net/guides/useful-playtest-feedback · sinfullstudios.com/playtesting-qa-indie-games/ · pokeindie.com/blog/devlog-habits-that-get-your-indie-game-wishlisted · gifden.com/guides/gif-frame-rate-guide/ · makeuseof.com (ScreenToGif) · reddit.com/r/gamedev (two postmortems)
Notes: research-only, nothing changed/signed/purchased. Two outdated itch docs URLs 404'd (current paths verified above). OBS/ezgif marked as common knowledge.
