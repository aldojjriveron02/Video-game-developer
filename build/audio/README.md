# Music tracks — drop zone (Round 27; format fallback Round 46)

No audio files ship with the prototype yet. The engine (`js/music.js`)
plays whatever lands here — until then it's a silent no-op and the game
runs SFX-only.

## Naming convention (engine picks extension per browser)
- `hangar.*` — calm ambient/menu loop (hangar, briefing, victory screens)
- `battle.*` — energetic battle loop (starts on first combat of a mission)
- Ship BOTH `hangar.ogg` + `hangar.m4a` (and `battle.ogg` + `battle.m4a`).
  **Safari cannot decode Vorbis** (MDN codec guide) — the engine auto-picks
  `.m4a` (AAC) on iPhone/Safari, `.ogg` elsewhere. OGG-only = silent on iPhone.

## Track briefs (Round 46)
- **hangar** (the garage theme — heard longest, optimize for non-fatigue):
  90–110 BPM, downtempo electronic / lo-fi-industrial, warm mechanical groove,
  loop 2–4 min, optimistic-industrious tint, sparse arrangement.
- **battle**: 120–140 BPM, strong percussion + one clear hook/motif,
  2–4 min, intro section that plays once before the loop body.
  Keep the upper-mid range open for pilot barks and weapon SFX.
- Preview the first AND last 5 seconds of every candidate; audition as a LOOP
  for 5 minutes — if the seam annoys you at minute 2, reject it.

## Where to get them ($0)
1. **Pixabay Music** (pixabay.com/music/) — no attribution required.
   Battle: Genre Rock/Metal/Trailer/Cinematic + Mood Aggressive/Dark/Epic.
   Hangar: Genre Electronic/Lo-fi + Mood Calm/Inspiring.
   Sort by plays/downloads, Editor's Choice only, preview FULL tracks,
   skip any track with a "Content ID Registered" badge.
2. **OpenGameArt** (opengameart.org) — CC0 collection (no attribution).
3. **Incompetech** (incompetech.com) — CC-BY 4.0: credit REQUIRED on a
   visible credits screen. Only use if we add that screen.

## Rules
- **OGG Vorbis + M4A/AAC, not MP3** — MP3 encoders add start-silence, breaking gapless loops.
- Normalize all tracks to the same loudness: ~-18 LUFS integrated, true peak -1 dBTP (portable-game guidance).
- Keep each file ~2–4 MB.
- Prefer no-attribution licenses (Pixabay / CC0). CC-BY needs a credits
  screen — that's a separate build task.

## License checklist (before shipping — Round 46)
- [ ] Dated copy of pixabay.com/service/license-summary/ saved
- [ ] Per-track "License Certificate" txt downloaded for every shipped track
- [ ] No "Content ID Registered" badge on shipped tracks (or VOD-claim risk accepted)
- [ ] Artist has a real profile + upload history (stolen-upload risk)
- [ ] Credits line added (not required by Pixabay, cheap insurance)
- [ ] Tracks game-embedded only — never shipped as standalone downloads
- [ ] Placeholders replaced BEFORE the first public trailer (Content ID fingerprints trailers)

## Wiring
`Music.load('hangar', 'audio/hangar')` is called in `Game.init()` (no extension —
the engine picks `.m4a`/`.ogg` per browser); add files here and they start
working with zero code changes. Prunty silence trick is built in: hangar music
fades at deploy, silence during placement, battle drops on first combat.
