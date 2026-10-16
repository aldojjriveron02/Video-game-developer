#!/usr/bin/env python3
"""Mecha Protocol — AI dialogue build-time generator.

Generates AI-written game content (VEX taunts, defeat/victory lines, M3
briefing alt, enemy pilot barks) via Aldo's Workers AI proxy.

AUTH: this script calls the `gemini` CLI, which POSTs to Aldo's proxy.
The gate password lives ONLY in the CLI/server side — it NEVER appears
in this script or in any file under build/ that ships to the browser.

Outputs (all in build/):
  ai-dialogue.json       canonical data artifact (reviewable)
  js/ai-dialogue.js      runtime loader — merges lines into I18N.en
  ai-dialogue-log.jsonl  every prompt + raw response, for review

Idempotent: skips regeneration if ai-dialogue.json exists.
Use --force to regenerate. Use --dry-run to print prompts without calling.
If the proxy is slow/down, fails with a clear message and NEVER corrupts
the existing JSON (writes go to temp + atomic rename).
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
GEMINI_CLI = os.path.expanduser(
    "~/workspace/custom-connectors/custom.legacy-google-gemini/bin/gemini")
JSON_PATH = os.path.join(HERE, "ai-dialogue.json")
JS_PATH = os.path.join(HERE, "js", "ai-dialogue.js")
LOG_PATH = os.path.join(HERE, "ai-dialogue-log.jsonl")
TIMEOUT_S = 120

# --- Voice bible (must match build/js/barks.js VOICE_BIBLE) ---
VEX_VOICE = (
    "VEX is a masked rival ace pilot: precise, curious, almost warm. "
    "The menace is in the attention, not the volume. VEX references the "
    "player's specific actions and asks questions it already knows the answer to. "
    "VEX NEVER shouts, NEVER threatens directly, NEVER says 'die'. "
    "VEX calls the player's mechs 'lance' or by callsign — never 'machine' or 'scrap'. "
    "Each line max 12 words."
)
VEX_EXAMPLES = (
    "Existing VEX lines for tone (match this voice, do not repeat): "
    "'Is that all, pilot?', 'I've read your file.', 'Third time. I'm counting.', "
    "'You fight like a manual.', 'So. The new lance. Show me what you learned.', "
    "'You cracked my armor. Now I stop holding back.', "
    "'You... actually did it. Impressive.'"
)

BATCHES = [
    {
        "key": "vex_taunts",
        "count": 10,
        "prompt": (
            "Write 10 combat taunts for VEX, a rival ace mech pilot in a turn-based "
            "tactics game. Context: VEX pilots a custom frame faster than anything the "
            "player fields, acts twice per round, overclocks its reactor (runs hot), "
            "and learns from every fight — a Yellow-13-style rival who studies you. "
            + VEX_VOICE + " " + VEX_EXAMPLES + " "
            "Output ONLY the 10 lines, one per line, numbered 1-10. No intro, no commentary."
        ),
    },
    {
        "key": "vex_defeat",
        "count": 5,
        "prompt": (
            "Write 5 final lines for VEX, a rival ace mech pilot, spoken as VEX's mech "
            "is destroyed and VEX loses the duel. VEX is graceful in defeat — curious "
            "to the end, never bitter, never begging. " + VEX_VOICE + " " + VEX_EXAMPLES + " "
            "Output ONLY the 5 lines, one per line, numbered 1-5. No intro, no commentary."
        ),
    },
    {
        "key": "vex_victory",
        "count": 5,
        "prompt": (
            "Write 5 lines for VEX, a rival ace mech pilot, spoken right after VEX "
            "destroys one of the player's mechs. VEX is observant and almost warm — "
            "it notes what it saw in the kill. Cruel about the fight, never cruel "
            "about the player. " + VEX_VOICE + " " + VEX_EXAMPLES + " "
            "Output ONLY the 5 lines, one per line, numbered 1-5. No intro, no commentary."
        ),
    },
    {
        "key": "m3_briefing",
        "count": 1,
        "prompt": (
            "Write a mission briefing (90-130 words) for 'M3: The Ace', the final mission "
            "of a 3-mission mecha tactics campaign. A commander briefs a 3-mech lance. "
            "Facts to include: one enemy mech did all the damage, callsign VEX, custom "
            "frame faster than anything the player fields; VEX acts twice every round but "
            "never the same strike twice; VEX overclocks — runs HOT, and hot mechs hit "
            "harder but take harder hits; VEX learns and remembers prior fights. Tone: "
            "plain-spoken commander who wants the lance alive. Output ONLY the briefing "
            "paragraph. No title, no intro."
        ),
    },
    {
        "key": "enemy_barks",
        "count": 15,
        "prompt": (
            "Write 15 short radio barks for generic enemy mech pilots (raiders, not aces) "
            "in a turn-based mecha tactics game. They are professional rank-and-file "
            "soldiers: terse military radio speech, flat, no personality quirks, no slang. "
            "Cover these moments: spotting the player lance (3), taking fire (3), losing "
            "an ally (3), missing a shot (3), pressing an attack (3). Each line max 12 words. "
            "Output ONLY the 15 lines, one per line, numbered 1-15. No intro, no commentary."
        ),
    },
]


def log_event(record):
    record["ts"] = datetime.datetime.now(
        datetime.timezone.utc).isoformat()
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def call_proxy(prompt, attempts=4):
    """Call the proxy via the gemini CLI. Returns raw text or raises.

    The proxy is intermittently flaky ("remote end closed connection"),
    so retry with backoff before giving up.
    """
    if not os.path.isfile(GEMINI_CLI):
        raise RuntimeError("gemini CLI not found at %s" % GEMINI_CLI)
    last_err = None
    for attempt in range(1, attempts + 1):
        try:
            proc = subprocess.run(
                [GEMINI_CLI, "generate", "--text", prompt],
                capture_output=True, text=True, timeout=TIMEOUT_S)
        except subprocess.TimeoutExpired:
            last_err = ("proxy call timed out after %ds — proxy may be down"
                        % TIMEOUT_S)
        except OSError as e:
            last_err = "failed to run gemini CLI: %s" % e
        else:
            if proc.returncode == 0:
                out = (proc.stdout or "").strip()
                if out:
                    return out
                last_err = "proxy returned empty response"
            else:
                last_err = ("gemini CLI failed (exit %d): %s"
                            % (proc.returncode,
                               (proc.stderr or proc.stdout).strip()[:200]))
        if attempt < attempts:
            wait = 5 * attempt
            print("  proxy attempt %d/%d failed (%s) — retrying in %ds..."
                  % (attempt, attempts, last_err, wait), file=sys.stderr)
            import time
            time.sleep(wait)
    raise RuntimeError("proxy failed after %d attempts: %s"
                       % (attempts, last_err))


def parse_lines(raw, count):
    """Parse numbered/bulleted lines into a clean list."""
    lines = []
    for ln in raw.splitlines():
        ln = ln.strip()
        if not ln:
            continue
        # strip leading numbering: "1.", "1)", "-", "*", '"'
        ln = re.sub(r"^[\d]+[.\)]\s*", "", ln)
        ln = re.sub(r"^[-*\u2022]\s*", "", ln)
        ln = ln.strip().strip("\"'").strip()
        if ln and not re.match(r"^(here|below|note:)", ln, re.I):
            lines.append(ln)
    return lines


def generate_batch(batch, dry_run=False):
    key, count, prompt = batch["key"], batch["count"], batch["prompt"]
    if dry_run:
        print("--- PROMPT [%s] ---\n%s\n" % (key, prompt))
        return ["<dry-run>"] * count
    raw = call_proxy(prompt)
    log_event({"batch": key, "prompt": prompt, "raw_response": raw})
    lines = parse_lines(raw, count)
    if len(lines) < count:
        # one retry before giving up
        print("  batch '%s' returned %d/%d lines — retrying once..."
              % (key, len(lines), count), file=sys.stderr)
        raw = call_proxy(prompt)
        log_event({"batch": key, "prompt": prompt,
                   "raw_response": raw, "retry": True})
        lines = parse_lines(raw, count)
    if len(lines) < count:
        raise RuntimeError(
            "batch '%s': got %d lines, need %d after retry — aborting, "
            "existing JSON untouched" % (key, len(lines), count))
    if len(lines) > count:
        lines = lines[:count]
    # basic hygiene: drop lines that violate the 12-word density rule badly
    for ln in lines:
        if len(ln.split()) > 18:
            print("  warning: line exceeds word budget, kept anyway: %r"
                  % ln[:60], file=sys.stderr)
    return lines


JS_TEMPLATE = """/* Mecha Protocol — AI-generated dialogue (BUILD-TIME artifact).
 * Generated by build/generate-ai-content.py via Aldo's Workers AI proxy.
 * DO NOT EDIT BY HAND — regenerate with: python3 generate-ai-content.py --force
 * No secrets in this file: content only. Auth stayed server-side at build time.
 * Generated: %(generated)s
 */
'use strict';
const AI_DIALOGUE = %(json)s;

// Merge AI lines into the English string table so t('taunt.ai.0') etc. resolve.
// Runs after i18n.js (needs I18N) and before game.js uses the keys.
// t() reads I18N.dicts[locale] with fallback to I18N.dicts.en.
(function () {
  try {
    if (typeof I18N === 'undefined' || !I18N.dicts || !I18N.dicts.en) return;
    var en = I18N.dicts.en, d = AI_DIALOGUE, i;
    for (i = 0; i < d.vex_taunts.length; i++) en['taunt.ai.' + i] = d.vex_taunts[i];
    for (i = 0; i < d.vex_defeat.length; i++) en['taunt.ai_defeat.' + i] = d.vex_defeat[i];
    for (i = 0; i < d.vex_victory.length; i++) en['taunt.ai_victory.' + i] = d.vex_victory[i];
    if (d.m3_briefing) en['mission.3.briefing_ai'] = d.m3_briefing;
    for (i = 0; i < d.enemy_barks.length; i++) en['bark.enemy.' + i] = d.enemy_barks[i];
  } catch (e) { /* AI dialogue is optional — the game runs fine without it */ }
})();
"""


def atomic_write_json(path, data):
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        os.replace(tmp, path)  # atomic on same filesystem
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def main():
    ap = argparse.ArgumentParser(description="Generate AI dialogue via proxy")
    ap.add_argument("--force", action="store_true",
                    help="regenerate even if ai-dialogue.json exists")
    ap.add_argument("--dry-run", action="store_true",
                    help="print prompts without calling the proxy")
    args = ap.parse_args()

    if os.path.isfile(JSON_PATH) and not args.force and not args.dry_run:
        print("ai-dialogue.json exists — skipping (use --force to regenerate)")
        return 0

    print("Generating AI dialogue via Aldo's proxy (%d batches)..."
          % len(BATCHES))
    data = {}
    try:
        for b in BATCHES:
            print("  [%s] ..." % b["key"])
            lines = generate_batch(b, dry_run=args.dry_run)
            if b["key"] == "m3_briefing":
                data[b["key"]] = lines[0]
            else:
                data[b["key"]] = lines
            print("  [%s] OK (%d)" % (b["key"], len(lines)))
    except RuntimeError as e:
        print("FAILED: %s" % e, file=sys.stderr)
        print("Existing ai-dialogue.json was NOT modified.", file=sys.stderr)
        return 1

    if args.dry_run:
        print("(dry run — nothing written)")
        return 0

    data["_meta"] = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "source": "Aldo's Workers AI proxy (Llama) via gemini CLI",
        "batches": {b["key"]: b["count"] for b in BATCHES},
    }
    atomic_write_json(JSON_PATH, data)
    print("wrote %s" % JSON_PATH)

    js = JS_TEMPLATE % {
        "generated": data["_meta"]["generated"],
        "json": json.dumps(
            {k: v for k, v in data.items() if not k.startswith("_")},
            ensure_ascii=False, indent=2),
    }
    js_tmp_fd, js_tmp = tempfile.mkstemp(
        dir=os.path.dirname(JS_PATH), suffix=".tmp")
    try:
        with os.fdopen(js_tmp_fd, "w", encoding="utf-8") as f:
            f.write(js)
        os.replace(js_tmp, JS_PATH)
    except BaseException:
        try:
            os.unlink(js_tmp)
        except OSError:
            pass
        raise
    print("wrote %s" % JS_PATH)
    print("Done. Review: %s | log: %s" % (JSON_PATH, LOG_PATH))
    return 0


if __name__ == "__main__":
    sys.exit(main())
