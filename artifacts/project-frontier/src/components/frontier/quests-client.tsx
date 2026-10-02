"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type { ActivityResponse, ClaimResponse, QuestsResponse, QuestView, Reward } from "@/game/contracts";
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
  const parts = [`+${reward.xp.toLocaleString()} XP`, `+${reward.gold.toLocaleString()} gold`];
  if (reward.quantity > 0) parts.push(`+${reward.quantity.toLocaleString()} ${pretty(reward.itemId)}`);
  if (reward.equipmentDropId) parts.push(`Gear: ${pretty(reward.equipmentDropId)}`);
  return parts.join(" · ");
}

function costsText(quest: QuestView) {
  return quest.inputs
    .map((input) => `${input.quantity.toLocaleString()} ${pretty(input.itemId)}`)
    .join(" + ");
}

function fmtTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function activeDestination(definitionId: string) {
  if (definitionId.startsWith("fight-") || definitionId.startsWith("train-")) return "/combat";
  if (definitionId.startsWith("craft-") || definitionId.startsWith("smelt-") || definitionId.startsWith("cook-") || definitionId.startsWith("tan-") || definitionId.startsWith("weave-") || definitionId.startsWith("brew-")) return "/crafting";
  if (definitionId.startsWith("quest-")) return "/quests";
  return "/dashboard";
}

export function QuestsClient({ userId }: { userId: string }) {
  const [data, setData] = useState<QuestsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "start" | "claim" | "cancel">(null);
  const [now, setNow] = useState(() => Date.now());
  const requestId = useRef<string | null>(null);
  const offset = useRef(0);
  const alive = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await api<QuestsResponse>("/quests");
      if (!alive.current) return;
      offset.current = Date.parse(next.serverTime) - Date.now();
      setData(next);
      setError(null);
      if (next.activeActivity) requestId.current = null;
    } catch (err) {
      if (!alive.current) return;
      setError(err instanceof Error ? err.message : "Could not load assignments.");
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    setData(null);
    setError(null);
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

  const active = data?.activeActivity ?? null;
  const activeQuest = active
    ? data?.quests.find((quest) => quest.id === active.definitionId) ?? null
    : null;
  const serverNow = now + offset.current;
  const remaining = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remaining <= 0;
  const progress = active ? Math.min(1, Math.max(0, 1 - remaining / total)) : 0;

  async function startQuest(quest: QuestView) {
    setBusy("start");
    setError(null);
    setNotice(null);
    requestId.current ??= crypto.randomUUID();
    try {
      await api<ActivityResponse>("/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          definitionId: quest.id,
          durationId: "1m",
          requestId: requestId.current,
        }),
      });
      requestId.current = null;
      setNotice(`${quest.name} started. Required supplies are reserved until the handoff finishes.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the quest.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function cancelQuest() {
    if (!activeQuest || !active) return;
    if (!window.confirm("Cancel this quest handoff? Reserved supplies will be returned.")) return;
    setBusy("cancel");
    setError(null);
    setNotice(null);
    try {
      await api<ActivityResponse>(`/activities/${encodeURIComponent(active.id)}/cancel`, { method: "POST" });
      setNotice("Quest handoff cancelled. Reserved supplies were returned.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel the quest.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function claimQuest() {
    if (!activeQuest || !active) return;
    setBusy("claim");
    setError(null);
    setNotice(null);
    try {
      const result = await api<ClaimResponse>(
        `/activities/${encodeURIComponent(active.id)}/claim`,
        { method: "POST" },
      );
      if (result.rewardGranted) {
        setNotice(`Quest complete: ${activeQuest.name}. ${rewardText(result.activity.reward)}.`);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim the quest.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  const completed = data?.quests.filter((quest) => quest.status === "completed").length ?? 0;

  return (
    <>
      <header className="bar">
        <div className="wrap"><Brand /><UserButton /></div>
      </header>
      <PlayerNav current="quests" />
      <main className="wrap" style={{ padding: "1.5rem 1.25rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "end", marginBottom: "1rem" }}>
          <div>
            <p className="label" style={{ marginBottom: ".3rem" }}>Station command</p>
            <h1 className="mono" style={{ margin: 0, fontSize: "1.65rem" }}>Quests</h1>
          </div>
          {data && (
            <div className="mono muted" style={{ fontSize: ".82rem", textAlign: "right" }}>
              {data.player.displayName}
              <br />
              Chain progress {completed} / {data.quests.length}
            </div>
          )}
        </div>

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
          <div className="grid" role="status" aria-label="Loading quests">
            <div className="skel" style={{ height: 150 }} />
            <div className="skel" style={{ height: 190 }} />
          </div>
        )}

        {data && (
          <div className="grid">
            {activeQuest && (
              <section className="panel" aria-labelledby="active-quest">
                <h2 id="active-quest">Active quest handoff</h2>
                <div className="mono" style={{ fontWeight: 600 }}>{activeQuest.name}</div>
                <p className="muted" style={{ margin: ".3rem 0 .75rem" }}>{activeQuest.objective}</p>
                <div
                  className="bartrack"
                  role="progressbar"
                  aria-label="Quest handoff progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                >
                  <div className="barfill" style={{ transform: `scaleX(${progress})` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: ".75rem", flexWrap: "wrap", alignItems: "center", marginTop: ".75rem" }}>
                  <span className="mono">{ready ? "Ready to complete" : `${fmtTime(remaining)} remaining`}</span>
                  <div className="item-actions">
                    <button className="btn ghost" onClick={cancelQuest} disabled={busy !== null}>
                      {busy === "cancel" ? "Cancelling..." : "Cancel"}
                    </button>
                    <button className="btn" onClick={claimQuest} disabled={busy !== null || !ready}>
                      {busy === "claim" ? "Completing..." : "Complete quest"}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {active && !activeQuest && (
              <section className="panel">
                <h2>Another assignment is active</h2>
                <div className="mono" style={{ fontWeight: 600 }}>
                  {data.activeActivityName ?? pretty(active.definitionId)}
                </div>
                <p className="muted">
                  Finish or cancel the current activity before beginning a quest.
                </p>
                <Link href={activeDestination(active.definitionId)} className="btn">Open active activity</Link>
              </section>
            )}

            <section className="panel">
              <h2>Frontier campaign</h2>
              <p className="muted" style={{ margin: "0 0 1rem" }}>
                One-time station assignments connect gathering, crafting and exploration into a campaign.
                Supplies are removed when a quest starts and returned if you cancel before completion.
              </p>

              <div className="quest-chain">
                {data.quests.map((quest, index) => {
                  const locked = quest.status === "locked";
                  const completedQuest = quest.status === "completed";
                  const questActive = quest.status === "active";
                  const canStart = quest.status === "available" && quest.hasInputs && !active;
                  return (
                    <div className="quest-step" key={quest.id}>
                      {index > 0 && <div className={locked ? "quest-line" : "quest-line open"} aria-hidden="true" />}
                      <article className={completedQuest ? "quest-card completed" : locked ? "quest-card locked" : "quest-card"}>
                        <div className="item-head">
                          <div>
                            <span className="tag">{quest.regionName}</span>{" "}
                            <span className={completedQuest || questActive ? "tag on" : "tag"}>
                              {completedQuest ? "Completed" : questActive ? "Active" : locked ? "Locked" : "Available"}
                            </span>
                          </div>
                          <span className="mono muted" style={{ fontSize: ".74rem" }}>Q-{String(index + 1).padStart(2, "0")}</span>
                        </div>

                        <h3 className="mono" style={{ margin: ".7rem 0 .25rem", fontSize: "1.05rem" }}>{quest.name}</h3>
                        <p className="muted" style={{ margin: "0 0 .6rem", fontSize: ".86rem" }}>{quest.description}</p>
                        <p style={{ margin: "0 0 .7rem" }}><strong>{quest.objective}</strong></p>

                        <div className="row">
                          <span>Requires</span>
                          <strong className="mono" style={{ textAlign: "right", fontSize: ".76rem" }}>{costsText(quest)}</strong>
                        </div>
                        <div className="row">
                          <span>Reward</span>
                          <strong className="mono" style={{ textAlign: "right", fontSize: ".76rem" }}>{rewardText(quest.reward)}</strong>
                        </div>

                        {!completedQuest && !locked && !questActive && !quest.hasInputs && (
                          <p className="muted" style={{ margin: ".7rem 0 0", fontSize: ".8rem" }}>
                            Gather or craft the required supplies first.
                          </p>
                        )}

                        {!completedQuest && !locked && !questActive && (
                          <button
                            className="btn"
                            style={{ marginTop: ".75rem", width: "100%" }}
                            disabled={!canStart || busy !== null}
                            onClick={() => startQuest(quest)}
                          >
                            {busy === "start" ? "Starting..." : quest.hasInputs ? "Begin handoff" : "Missing supplies"}
                          </button>
                        )}
                      </article>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
