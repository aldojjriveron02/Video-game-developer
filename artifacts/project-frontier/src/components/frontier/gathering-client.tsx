"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Fish,
  Leaf,
  Pickaxe,
  Sprout,
  Target,
  TimerReset,
  Trees,
} from "lucide-react";
import type {
  ActivityDefinitionView,
  ActivityResponse,
  ClaimResponse,
  Dashboard,
  Reward,
} from "@/game/contracts";
import { PlayerNav } from "./player-nav";
import { GameHeader, ItemGlyph, ScreenHeading, SkillGlyph } from "./frontier-ui";

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
  const parts = [];
  if (reward.quantity > 0) parts.push(`${reward.quantity.toLocaleString()} ${pretty(reward.itemId)}`);
  if (reward.xp > 0) parts.push(`${reward.xp.toLocaleString()} XP`);
  if (reward.skillId && reward.skillXp) {
    parts.push(`${reward.skillXp.toLocaleString()} ${pretty(reward.skillId)} XP`);
  }
  if (reward.gold > 0) parts.push(`${reward.gold.toLocaleString()} gold`);
  return parts.join(" · ");
}

function fmtTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function activeDestination(definitionId: string) {
  if (definitionId.startsWith("fight-") || definitionId.startsWith("train-")) return "/combat";
  if (/^(craft|smelt|cook|tan|weave|brew)-/.test(definitionId)) return "/crafting";
  if (definitionId.startsWith("quest-")) return "/quests";
  return "/gathering";
}

function activityIcon(skillId?: string) {
  if (skillId === "mining") return Pickaxe;
  if (skillId === "woodcutting") return Trees;
  if (skillId === "fishing") return Fish;
  if (skillId === "hunting") return Target;
  if (skillId === "herbalism") return Leaf;
  return Sprout;
}

export function GatheringClient({ userId }: { userId: string }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState("gather-wood");
  const [selectedDurationId, setSelectedDurationId] = useState("1m");
  const [busy, setBusy] = useState<null | "start" | "claim" | "cancel">(null);
  const [now, setNow] = useState(() => Date.now());
  const requestId = useRef<string | null>(null);
  const offset = useRef(0);
  const alive = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await api<Dashboard>("/dashboard");
      if (!alive.current) return;
      offset.current = Date.parse(next.serverTime) - Date.now();
      setData(next);
      setSelectedActivityId((current) =>
        next.gatheringActivities.some((activity) => activity.id === current)
          ? current
          : (next.gatheringActivities[0]?.id ?? ""),
      );
      setError(null);
      if (next.activeActivity) requestId.current = null;
    } catch (err) {
      if (!alive.current) return;
      setError(err instanceof Error ? err.message : "Could not load gathering.");
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    setData(null);
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

  const activity: ActivityDefinitionView | null =
    data?.gatheringActivities.find((entry) => entry.id === selectedActivityId)
    ?? data?.gatheringActivities[0]
    ?? null;
  const duration =
    activity?.durationOptions.find((entry) => entry.id === selectedDurationId)
    ?? activity?.durationOptions[0]
    ?? null;
  const active = data?.activeActivity ?? null;
  const activeIsGathering = !!active && !!data?.gatheringActivities.some((entry) => entry.id === active.definitionId);
  const activeDefinition =
    active && data
      ? data.gatheringActivities.find((entry) => entry.id === active.definitionId) ?? null
      : null;

  const serverNow = now + offset.current;
  const remaining = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remaining <= 0;
  const progress = active ? Math.min(1, Math.max(0, 1 - remaining / total)) : 0;

  const skillId = activity?.reward.skillId;
  const ActivityIcon = activityIcon(skillId);

  const inventory = useMemo(
    () => new Map((data?.inventory ?? []).map((entry) => [entry.itemId, entry.quantity])),
    [data],
  );

  async function start() {
    if (!activity || !duration) return;
    setBusy("start");
    setError(null);
    setNotice(null);
    requestId.current ??= crypto.randomUUID();
    try {
      await api<ActivityResponse>("/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          definitionId: activity.id,
          durationId: duration.id,
          requestId: requestId.current,
        }),
      });
      requestId.current = null;
      setNotice(`${activity.name} started. The server will track it while you are away.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start gathering.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function cancel() {
    if (!active || !activeIsGathering) return;
    if (!window.confirm("Cancel this gathering activity? No reward will be granted.")) return;
    setBusy("cancel");
    setError(null);
    setNotice(null);
    try {
      await api<ActivityResponse>(`/activities/${encodeURIComponent(active.id)}/cancel`, { method: "POST" });
      setNotice("Gathering activity cancelled.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel gathering.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function claim() {
    if (!active || !activeIsGathering) return;
    setBusy("claim");
    setError(null);
    setNotice(null);
    try {
      const result = await api<ClaimResponse>(
        `/activities/${encodeURIComponent(active.id)}/claim`,
        { method: "POST" },
      );
      if (result.rewardGranted) {
        setNotice(`Gathering complete: ${rewardText(result.activity.reward)}.`);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim gathering.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <GameHeader gold={data?.player.gold} />
      <PlayerNav current="gathering" />
      <main className="wrap game-screen">
        <ScreenHeading
          eyebrow="Frontier professions"
          title="Gathering"
          description="Choose a resource discipline and send your operator into the field for an idle work session."
          metric={data && <><span>Activities</span><strong>{data.gatheringActivities.length}</strong></>}
        />

        {error && <div className="alert" role="alert"><span>{error}</span><button className="btn ghost sm" onClick={load}>Retry</button></div>}
        {notice && <div className="reward-notice" role="status"><span>{notice}</span><button className="btn ghost sm" onClick={() => setNotice(null)}>Dismiss</button></div>}
        {!data && !error && <div className="grid"><div className="skel" style={{ height: 420 }} /><div className="skel" style={{ height: 220 }} /></div>}

        {data && active && !activeIsGathering && (
          <section className="game-card blocking-activity">
            <div className="section-banner"><TimerReset size={19} /><span>Another Activity Is Active</span></div>
            <div className="blocking-activity-body">
              <h2>{active.definitionId.replaceAll("-", " ")}</h2>
              <p>Only one server activity can run at a time right now.</p>
              <Link href={activeDestination(active.definitionId)} className="btn gold-btn">Open Active Activity</Link>
            </div>
          </section>
        )}

        {data && active && activeIsGathering && (
          <section className="gather-active game-card">
            <div className="section-banner activity-banner">
              <ActivityIcon size={20} />
              <span>Current Activity</span>
              <small>{ready ? "Ready" : "In progress"}</small>
            </div>
            <div className="gather-active-body">
              <div className="gather-scene">
                <ActivityIcon size={62} />
                <div className="gather-scene-name">{activeDefinition?.name ?? pretty(active.definitionId)}</div>
              </div>
              <div className="gather-active-copy">
                <h2>{activeDefinition?.name ?? pretty(active.definitionId)}</h2>
                <p>{activeDefinition?.description ?? "Frontier work in progress."}</p>
                <div className="bartrack"><div className="barfill" style={{ transform: `scaleX(${progress})` }} /></div>
                <div className="activity-time">
                  <strong>{ready ? "Ready to claim" : `${fmtTime(remaining)} remaining`}</strong>
                  <span>{rewardText(active.reward)}</span>
                </div>
                <div className="activity-actions">
                  <button className="btn ghost" onClick={cancel} disabled={busy !== null}>{busy === "cancel" ? "Cancelling..." : "Cancel"}</button>
                  <button className="btn gold-btn" onClick={claim} disabled={busy !== null || !ready}>{busy === "claim" ? "Claiming..." : "Claim Resources"}</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {data && !active && activity && duration && (
          <div className="game-screen-stack">
            <section className="gather-layout game-card">
              <div className="gather-discipline-list">
                {data.gatheringActivities.map((entry) => {
                  const EntryIcon = activityIcon(entry.reward.skillId);
                  return (
                    <button
                      key={entry.id}
                      className={entry.id === activity.id ? "gather-discipline selected" : "gather-discipline"}
                      onClick={() => { setSelectedActivityId(entry.id); setSelectedDurationId("1m"); }}
                    >
                      <EntryIcon size={21} />
                      <span>{pretty(entry.reward.skillId ?? entry.name)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="gather-detail">
                <div className="gather-hero-art">
                  <ActivityIcon size={74} />
                  <div className="gather-hero-art-label">{activity.name}</div>
                </div>

                <div className="gather-detail-copy">
                  <div className="eyebrow">{pretty(skillId ?? "gathering")} discipline</div>
                  <h2>{activity.name}</h2>
                  <p>{activity.description}</p>

                  <div className="gather-skill-row">
                    <SkillGlyph id={skillId ?? "foraging"} />
                    <span>Trains <strong>{pretty(skillId ?? "Gathering")}</strong></span>
                  </div>

                  <div className="gather-reward-preview">
                    <ItemGlyph id={duration.reward.itemId} size={28} />
                    <div>
                      <small>Possible output</small>
                      <strong>{rewardText(duration.reward)}</strong>
                    </div>
                  </div>

                  <div className="duration-buttons">
                    {activity.durationOptions.map((entry) => (
                      <button
                        key={entry.id}
                        className={entry.id === duration.id ? "duration-button selected" : "duration-button"}
                        onClick={() => setSelectedDurationId(entry.id)}
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>

                  <button className="btn gold-btn gather-start-btn" onClick={start} disabled={busy !== null}>
                    {busy === "start" ? "Starting..." : "Start Gathering"}
                  </button>
                </div>
              </div>
            </section>

            <section className="game-card">
              <div className="section-banner">
                <ItemGlyph id={duration.reward.itemId} size={20} />
                <span>Current Stores</span>
                <small>Resource inventory</small>
              </div>
              <div className="material-store-grid">
                {data.inventory.length === 0 ? (
                  <p className="empty padded-empty">No resources yet.</p>
                ) : data.inventory.slice(0, 12).map((entry) => (
                  <div className="material-store-item" key={entry.itemId}>
                    <ItemGlyph id={entry.itemId} size={24} />
                    <span>{pretty(entry.itemId)}</span>
                    <strong>{(inventory.get(entry.itemId) ?? 0).toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
