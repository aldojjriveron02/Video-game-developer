# Hangar Part 15 (Loadout UX / Pre-Jam Verification) — Findings (Round 243)
**Date:** Wed 2026-10-14 ~23:45 EDT · **Source:** live web research (nielsen/nn-g, filament, deltaTime, subset, ui-patterns)
**Project:** Mecha Protocol — hangar (jam hangar = preset squad-select, frozen)

## A. Mechanics — the 5-point loadout canon (distilled from pro UX sources)
1. PREVIEW — see effect before committing (r/gamedev: "compare with what you have equipped" = #1 request).
2. DELTA — explicit ▲▼ with magnitudes, never mental math. Our format "HP ▼46 · Move ▲4 · Arms → rifle" = exactly what pros recommend.
3. SIGNATURE — role legible at a glance (weapon name, role label).
4. REVERSIBILITY — NN/g Heuristic #3: support undo. Every pick undoable without penalty.
5. SPEED — under-30s pick: 3 new players, hangar entry → deploy, <30s, zero tutorial questions.

## B. Validation
- 5-user gate (Nielsen/NN/g): 5 users catch ~85% of issues. Script: (1) pick preset + deploy, no instruction (30s test); (2) swap part, narrate change (delta readability); (3) undo; (4) "which is the tanky one?" (signature legibility). Pass: ≥4/5 <30s zero questions, ≥4/5 read delta aloud, 5/5 undo.
- Legal-squad gate: illegal states unselectable or blocked with reason — never discovered at deploy (XCOM model).
- Delta readability: player points and says what changed. If they do math ("120 minus 74..."), display failed — must read as prose.

## C. Techniques
- Paper-doll (Diablo origin): redraw immediate (<100ms, no flicker) or players stop trusting it.
- Instant recompute on select, not confirm; one rAF pass so preview/delta/signature agree.
- Presets = pro answer to 30s gate: open-ended build → 3-way recognition choice.
- Enter=deploy (XCOM one-key commit); Esc/Back = undo paired.
- Undo must restore ALL (part + stats + deltas + signature) — half-undo worse than none.
- Colorblind-safe deltas (Filament, Game Accessibility Guidelines): red-green confusion is most common — never color alone. Our ▲▼ + signed numbers + weapon label = shape + direction + magnitude (monochrome-readable).

## D. What to avoid
- Hidden stats (affects combat but not shown → trust collapse). Rule: if it matters in combat, it's in the delta line or signature.
- Irreversible without warning (NN/g top-tier violation). Jam LOCK = only irreversible gate, separate explicit action.
- Deltas requiring math ("120 → 74" forces subtraction; "▼46" doesn't).
- Non-viable presets: must (a) deploy legally, (b) be winnable, (c) match label. Unwinnable preset worse than two presets — cut it.
- Build paralysis (Kerr/Game Developer choice overload; NN/g; lawsofux): 3 presets frozen for exactly this reason. No unfreezing on jam day.

## E. Shipped
- XCOM 2: roster + gear slots, one-key deploy, illegal states prevented — answers who/what/is-it-legal, zero hidden stats.
- Into the Breach (Subset, Justin Ma): "sacrifice cool ideas for the sake of clarity every time" — prep screen as contract.
- Diablo (1996): paper-doll = visual identity + mechanical legibility merged — the exact two jobs our canvas mechs perform.

## Implemented this round
- **Verified (code read, no changes — frozen):** jam hangar = preset squad-select (one tap per preset, deltas on cards, Enter=deploy). REVERSIBILITY SATISFIED STRUCTURALLY: selection ≠ commit — tapping another preset changes selection freely; nothing commits until deploy. No part-swapping in jam build (full hangar = Phase 2), so no undo-scenario exists.
- **HANGAR-SPEC.md:** 5-user gate protocol (Sun Oct 18 6PM; script + pass criteria); grayscale delta audit (screenshot → desaturate → confirm legible); preset viability playthrough (each preset: legal, winnable, honestly labeled); freeze rule (no new parts/relabels/UI polish after gate passes).
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
nielsen/nn-g · filament · deltaTime · subset · ui-patterns · kerr · lawsofux
