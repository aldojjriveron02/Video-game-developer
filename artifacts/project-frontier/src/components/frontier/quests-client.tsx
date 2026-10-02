"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Lock, ScrollText, TimerReset } from "lucide-react";
import type { ActivityResponse, ClaimResponse, QuestsResponse, QuestView, Reward } from "@/game/contracts";
import { PlayerNav } from "./player-nav";
import { GameHeader, ItemGlyph, RegionArt, ScreenHeading } from "./frontier-ui";

type ApiError = { error?: string };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/frontier-api${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const body = await response.json().catch(() => null) as ApiError | T | null;
  if (!response.ok) throw new Error((body as ApiError | null)?.error ?? `Request failed (${response.status})`);
  return body as T;
}

function pretty(id: string) {
  return id.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function rewardText(reward: Reward) {
  const parts = [`${reward.xp.toLocaleString()} XP`, `${reward.gold.toLocaleString()} gold`];
  if (reward.quantity > 0) parts.push(`${reward.quantity.toLocaleString()} ${pretty(reward.itemId)}`);
  if (reward.equipmentDropId) parts.push(`Gear: ${pretty(reward.equipmentDropId)}`);
  return parts.join(" · ");
}

function fmtTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function activeDestination(definitionId: string) {
  if (definitionId.startsWith("fight-") || definitionId.startsWith("train-")) return "/combat";
  if (/^(craft|smelt|cook|tan|weave|brew)-/.test(definitionId)) return "/crafting";
  if (definitionId.startsWith("quest-")) return "/quests";
  return "/dashboard";
}

function regionId(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("rust")) return "rust-trail";
  if (normalized.includes("quarry")) return "old-quarry";
  if (normalized.includes("outpost")) return "ruined-outpost";
  return "pine-verge";
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
    const refresh = () => { if (document.visibilityState === "visible") load(); };
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
  const activeQuest = active ? data?.quests.find((quest) => quest.id === active.definitionId) ?? null : null;
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
        body: JSON.stringify({ definitionId: quest.id, durationId: "1m", requestId: requestId.current }),
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
      const result = await api<ClaimResponse>(`/activities/${encodeURIComponent(active.id)}/claim`, { method: "POST" });
      if (result.rewardGranted) setNotice(`Quest complete: ${activeQuest.name}. ${rewardText(result.activity.reward)}.`);
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
      <GameHeader gold={data?.player.gold} />
      <PlayerNav current="quests" />
      <main className="wrap game-screen">
        <ScreenHeading
          eyebrow="Station command"
          title="Quests"
          description="Campaign assignments turn gathering, crafting and combat into a single frontier story."
          metric={data && <><span>Campaign</span><strong>{completed}/{data.quests.length}</strong></>}
        />

        {error && <div className="alert" role="alert"><span>{error}</span><button className="btn ghost sm" onClick={load}>Retry</button></div>}
        {notice && <div className="reward-notice" role="status"><span>{notice}</span><button className="btn ghost sm" onClick={() => setNotice(null)}>Dismiss</button></div>}
        {!data && !error && <div className="grid"><div className="skel" style={{ height: 280 }} /><div className="skel" style={{ height: 360 }} /></div>}

        {data && (
          <div className="game-screen-stack">
            {activeQuest && (
              <section className="game-card active-quest-card">
                <RegionArt regionId={regionId(activeQuest.regionName)} name={activeQuest.regionName} compact />
                <div className="active-quest-content">
                  <div className="section-banner quest-banner">
                    <ScrollText size={20} />
                    <span>Active Quest</span>
                    <small>{activeQuest.regionName}</small>
                  </div>
                  <div className="active-quest-inner">
                    <h2>{activeQuest.name}</h2>
                    <p>{activeQuest.objective}</p>
                    <div className="bartrack"><div className="barfill" style={{ transform: `scaleX(${progress})` }} /></div>
                    <div className="activity-time">
                      <strong>{ready ? "Ready to complete" : `${fmtTime(remaining)} remaining`}</strong>
                      <span><TimerReset size={14} /> Server handoff</span>
                    </div>
                    <div className="activity-actions">
                      <button className="btn ghost" onClick={cancelQuest} disabled={busy !== null}>{busy === "cancel" ? "Cancelling..." : "Cancel"}</button>
                      <button className="btn gold-btn" onClick={claimQuest} disabled={busy !== null || !ready}>{busy === "claim" ? "Completing..." : "Complete Quest"}</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {active && !activeQuest && (
              <section className="game-card blocking-activity">
                <div className="section-banner"><Lock size={19} /><span>Another Activity Is Active</span></div>
                <div className="blocking-activity-body">
                  <h2>{data.activeActivityName ?? pretty(active.definitionId)}</h2>
                  <p>Finish or cancel the current activity before beginning a campaign handoff.</p>
                  <Link href={activeDestination(active.definitionId)} className="btn gold-btn">Open Active Activity</Link>
                </div>
              </section>
            )}

            <section className="quest-campaign">
              {data.quests.map((quest, index) => {
                const locked = quest.status === "locked";
                const completedQuest = quest.status === "completed";
                const questActive = quest.status === "active";
                const canStart = quest.status === "available" && quest.hasInputs && !active;
                return (
                  <article
                    className={completedQuest ? "campaign-card completed" : locked ? "campaign-card locked" : questActive ? "campaign-card active" : "campaign-card"}
                    key={quest.id}
                  >
                    <RegionArt regionId={regionId(quest.regionName)} name={quest.regionName} compact />
                    <div className="campaign-card-content">
                      <div className="campaign-card-head">
                        <span className="chapter-number">Chapter {index + 1}</span>
                        <span className={completedQuest ? "campaign-state complete" : questActive ? "campaign-state active" : locked ? "campaign-state locked" : "campaign-state"}>
                          {completedQuest ? <><Check size={13} /> Completed</> : questActive ? "Active" : locked ? <><Lock size={13} /> Locked</> : "Available"}
                        </span>
                      </div>
                      <h2>{quest.name}</h2>
                      <p>{quest.description}</p>

                      <div className="quest-objective-list">
                        {quest.inputs.map((input) => (
                          <div className="quest-objective-row" key={input.itemId}>
                            <span className={completedQuest ? "check on" : "check"} />
                            <ItemGlyph id={input.itemId} size={18} />
                            <span>{input.quantity.toLocaleString()} {pretty(input.itemId)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="quest-reward-box">
                        <span>Rewards</span>
                        <strong>{rewardText(quest.reward)}</strong>
                      </div>

                      {!completedQuest && !locked && !questActive && (
                        <button className="btn gold-btn quest-start-btn" disabled={!canStart || busy !== null} onClick={() => startQuest(quest)}>
                          {busy === "start" ? "Starting..." : quest.hasInputs ? "Begin Quest Handoff" : "Missing Supplies"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
