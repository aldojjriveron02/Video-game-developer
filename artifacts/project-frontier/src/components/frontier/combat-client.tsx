"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type { ActivityResponse, ClaimResponse, CombatResponse, Reward } from "@/game/contracts";
import { Brand } from "./brand";
import { PlayerNav } from "./player-nav";

type ApiError = { error?: string };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/frontier-api${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const body = await response.json().catch(() => null) as ApiError | T | null;
  if (!response.ok) {
    throw new Error((body as ApiError | null)?.error ?? `Request failed (${response.status})`);
  }
  return body as T;
}

function pretty(id: string) {
  return id.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function rewardText(reward: Reward) {
  const skill = reward.skillId && reward.skillXp
    ? ` · +${reward.skillXp.toLocaleString()} ${pretty(reward.skillId)} XP`
    : "";
  return `+${reward.xp.toLocaleString()} character XP · +${reward.gold.toLocaleString()} gold · +${reward.quantity.toLocaleString()} ${pretty(reward.itemId)}${skill}`;
}

function fmtTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function CombatClient({ userId }: { userId: string }) {
  const [data, setData] = useState<CombatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedDrillId, setSelectedDrillId] = useState("train-strength");
  const [selectedDurationId, setSelectedDurationId] = useState("1m");
  const [busy, setBusy] = useState<null | "start" | "claim" | "cancel">(null);
  const [now, setNow] = useState(() => Date.now());
  const requestId = useRef<string | null>(null);
  const offset = useRef(0);
  const alive = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await api<CombatResponse>("/combat");
      if (!alive.current) return;
      offset.current = Date.parse(next.serverTime) - Date.now();
      setData(next);
      setSelectedDrillId((current) =>
        next.drills.some((drill) => drill.id === current) ? current : (next.drills[0]?.id ?? ""),
      );
      setError(null);
      if (next.activeActivity) requestId.current = null;
    } catch (err) {
      if (!alive.current) return;
      setError(err instanceof Error ? err.message : "Could not load training grounds.");
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    setData(null);
    load();
    const refresh = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const poll = setInterval(refresh, 15000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive.current = false;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [load, userId]);

  const drill = data?.drills.find((entry) => entry.id === selectedDrillId) ?? data?.drills[0] ?? null;
  const duration = drill?.durationOptions.find((entry) => entry.id === selectedDurationId)
    ?? drill?.durationOptions[0]
    ?? null;

  const active = data?.activeActivity ?? null;
  const serverNow = now + offset.current;
  const remaining = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remaining <= 0;
  const progress = active ? Math.min(1, Math.max(0, 1 - remaining / total)) : 0;

  async function start() {
    if (!drill || !duration) return;
    setBusy("start");
    setError(null);
    setNotice(null);
    requestId.current ??= crypto.randomUUID();
    try {
      await api<ActivityResponse>("/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          definitionId: drill.id,
          durationId: duration.id,
          requestId: requestId.current,
        }),
      });
      requestId.current = null;
      setNotice("Training started. The server is tracking the session while you are away.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start training.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function cancel() {
    if (!active) return;
    if (!window.confirm("Cancel this activity? Progress will be discarded and no reward will be granted.")) return;
    setBusy("cancel");
    setError(null);
    setNotice(null);
    try {
      await api<ActivityResponse>(`/activities/${encodeURIComponent(active.id)}/cancel`, { method: "POST" });
      setNotice("Activity cancelled. No rewards were granted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel the activity.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function claim() {
    if (!active) return;
    setBusy("claim");
    setError(null);
    setNotice(null);
    try {
      const result = await api<ClaimResponse>(
        `/activities/${encodeURIComponent(active.id)}/claim`,
        { method: "POST" },
      );
      if (result.rewardGranted) {
        const skillLevel = result.skillProgression
          ? ` · ${pretty(result.skillProgression.skillId)} level ${result.skillProgression.progression.level}`
          : "";
        setNotice(`Session complete: ${rewardText(result.activity.reward)}${skillLevel}.`);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim the activity.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <header className="bar">
        <div className="wrap"><Brand /><UserButton /></div>
      </header>
      <PlayerNav current="combat" />
      <main className="wrap" style={{ padding: "1.5rem 1.25rem 4rem" }}>
        <h1 className="mono" style={{ margin: "0 0 .4rem", fontSize: "1.5rem" }}>Training Grounds</h1>
        <p className="muted" style={{ margin: "0 0 1rem" }}>
          Train the six combat skills with server-timed sessions. Combat encounters will build on these stats.
        </p>

        {error && (
          <div className="alert" role="alert" style={{ marginBottom: "1rem" }}>
            <span>{error}</span>
            <button className="btn ghost sm" onClick={load}>Retry</button>
          </div>
        )}
        {notice && (
          <div className="reward-notice" role="status" style={{ marginBottom: "1rem" }}>
            <span>{notice}</span>
            <button className="btn ghost sm" onClick={() => setNotice(null)}>Dismiss</button>
          </div>
        )}

        {!data && !error && (
          <div className="grid" role="status" aria-label="Loading training grounds">
            <div className="skel" style={{ height: 180 }} />
            <div className="skel" style={{ height: 130 }} />
          </div>
        )}

        {data && (
          <div className="grid">
            <p className="mono muted" style={{ margin: 0, fontSize: ".85rem" }}>
              {data.player.displayName} · {data.player.gold.toLocaleString()} gold
            </p>

            {active ? (
              <section className="panel" aria-labelledby="active-training">
                <h2 id="active-training">Active session</h2>
                <div className="mono" style={{ fontWeight: 600 }}>
                  {data.activeActivityName ?? pretty(active.definitionId)}
                </div>
                <p className="mono muted" style={{ margin: ".35rem 0 .75rem", fontSize: ".8rem" }}>
                  {rewardText(active.reward)}
                </p>
                <div
                  className="bartrack"
                  role="progressbar"
                  aria-label="Training progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                >
                  <div className="barfill" style={{ transform: `scaleX(${progress})` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: ".75rem", flexWrap: "wrap", alignItems: "center", marginTop: ".75rem" }}>
                  <span className="mono">{ready ? "Ready to claim" : `${fmtTime(remaining)} remaining`}</span>
                  <div className="item-actions">
                    <button className="btn ghost" onClick={cancel} disabled={busy !== null}>
                      {busy === "cancel" ? "Cancelling..." : "Cancel"}
                    </button>
                    <button className="btn" onClick={claim} disabled={busy !== null || !ready}>
                      {busy === "claim" ? "Claiming..." : "Claim training"}
                    </button>
                  </div>
                </div>
              </section>
            ) : drill && duration ? (
              <section className="panel" aria-labelledby="training-drill">
                <h2 id="training-drill">Choose a combat drill</h2>
                <div className="grid" style={{ gap: ".75rem" }}>
                  <label>
                    <span className="label" style={{ display: "block", marginBottom: ".35rem" }}>Combat skill</span>
                    <select
                      className="activity-select"
                      value={drill.id}
                      onChange={(event) => {
                        setSelectedDrillId(event.target.value);
                        setSelectedDurationId("1m");
                        requestId.current = null;
                        setError(null);
                      }}
                      disabled={busy !== null}
                    >
                      {data.drills.map((entry) => (
                        <option value={entry.id} key={entry.id}>{pretty(entry.skillId)}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="label" style={{ display: "block", marginBottom: ".35rem" }}>Training time</span>
                    <select
                      className="activity-select"
                      value={duration.id}
                      onChange={(event) => {
                        setSelectedDurationId(event.target.value);
                        requestId.current = null;
                        setError(null);
                      }}
                      disabled={busy !== null}
                    >
                      {drill.durationOptions.map((entry) => (
                        <option value={entry.id} key={entry.id}>{entry.label}</option>
                      ))}
                    </select>
                  </label>

                  <div>
                    <div className="mono" style={{ fontWeight: 600 }}>{drill.name}</div>
                    <p className="muted" style={{ margin: ".25rem 0 .65rem" }}>{drill.description}</p>
                    <div className="row">
                      <span>Trains</span>
                      <strong>{pretty(drill.skillId)}</strong>
                    </div>
                    <div className="row">
                      <span>Rewards</span>
                      <strong className="mono" style={{ textAlign: "right" }}>{rewardText(duration.reward)}</strong>
                    </div>
                  </div>

                  <button className="btn" onClick={start} disabled={busy !== null}>
                    {busy === "start" ? "Starting..." : "Start training"}
                  </button>
                </div>
              </section>
            ) : (
              <p className="empty">No combat drills are available.</p>
            )}

            <section className="panel" aria-labelledby="training-info">
              <h2 id="training-info">Combat foundation</h2>
              <p className="muted" style={{ margin: 0 }}>
                Strength, Defense, Dexterity, Agility, Vitality and Tactics now have a playable progression loop.
                Training uses the same server-authoritative activity system as gathering and crafting, so progress
                continues while you are signed out.
              </p>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
