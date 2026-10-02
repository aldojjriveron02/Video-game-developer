"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  Backpack,
  BarChart3,
  Coins,
  Hammer,
  Map,
  ScrollText,
  Shield,
  Swords,
  Trees,
} from "lucide-react";
import type {
  ActivityDefinitionView,
  ActivityResponse,
  ClaimResponse,
  CombatResponse,
  Dashboard,
  QuestView,
  QuestsResponse,
  Reward,
} from "@/game/contracts";
import { Brand } from "./brand";
import { PlayerNav } from "./player-nav";

type ApiError = { error: string; code: string };
const MAX_POLLS = 20;
const POLL_MS = 15000;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/frontier-api${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const e = body as Partial<ApiError> | null;
    throw new Error(e?.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

const fmtTime = (seconds: number) => {
  const total = Math.max(0, Math.ceil(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const pretty = (id: string) =>
  id.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());

const rewardText = (reward: Reward) => {
  const pieces = [];
  if (reward.gold > 0) pieces.push(`${reward.gold.toLocaleString()} gold`);
  if (reward.xp > 0) pieces.push(`${reward.xp.toLocaleString()} XP`);
  if (reward.quantity > 0) pieces.push(`${reward.quantity.toLocaleString()} ${pretty(reward.itemId)}`);
  return pieces.join(" · ");
};

function StatChip({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="hero-stat">
      <span className="hero-stat-icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: typeof Backpack;
}) {
  return (
    <Link href={href} className="quick-card">
      <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
      <span>{label}</span>
      <span className="quick-arrow" aria-hidden="true">›</span>
    </Link>
  );
}

export function DashboardClient({ userId }: { userId: string }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [quests, setQuests] = useState<QuestsResponse | null>(null);
  const [combat, setCombat] = useState<CombatResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [claimNotice, setClaimNotice] = useState<ClaimResponse | null>(null);
  const [activityNotice, setActivityNotice] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState("gather-wood");
  const [selectedDurationId, setSelectedDurationId] = useState("1m");
  const [busy, setBusy] = useState<null | "start" | "claim" | "cancel">(null);
  const [now, setNow] = useState(() => Date.now());
  const offset = useRef(0);
  const polls = useRef(0);
  const requestId = useRef<string | null>(null);
  const alive = useRef(true);
  const seq = useRef(0);

  const load = useCallback(async () => {
    const mine = ++seq.current;
    try {
      const [dashboardData, questData, combatData] = await Promise.all([
        api<Dashboard>("/dashboard"),
        api<QuestsResponse>("/quests"),
        api<CombatResponse>("/combat"),
      ]);
      if (!alive.current || mine !== seq.current) return;

      offset.current = Date.parse(dashboardData.serverTime) - Date.now();
      if (dashboardData.activeActivity) requestId.current = null;

      setSelectedActivityId((current) =>
        dashboardData.gatheringActivities.some((activity) => activity.id === current)
          ? current
          : (dashboardData.gatheringActivities[0]?.id ?? dashboardData.gathering.id),
      );
      setSelectedDurationId((current) =>
        dashboardData.gatheringActivities.some((activity) =>
          activity.durationOptions.some((duration) => duration.id === current),
        )
          ? current
          : "1m",
      );

      setData(dashboardData);
      setQuests(questData);
      setCombat(combatData);
      setLoadError(null);
    } catch (error) {
      if (!alive.current || mine !== seq.current) return;
      setLoadError(error instanceof Error ? error.message : "Could not reach the station.");
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    setData(null);
    setQuests(null);
    setCombat(null);
    setClaimNotice(null);
    setActivityNotice(null);
    requestId.current = null;
    load();

    const onFocus = () => {
      polls.current = 0;
      load();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") onFocus();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    const poll = setInterval(() => {
      if (polls.current < MAX_POLLS && document.visibilityState === "visible") {
        polls.current++;
        load();
      }
    }, POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      alive.current = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [load, userId]);

  const active = data?.activeActivity ?? null;
  const selectedActivity: ActivityDefinitionView | null = data
    ? data.gatheringActivities.find((activity) => activity.id === selectedActivityId) ?? data.gathering
    : null;
  const activeDefinition: ActivityDefinitionView | null = active && data
    ? data.gatheringActivities.find((activity) => activity.id === active.definitionId) ?? null
    : selectedActivity;
  const selectedDuration = selectedActivity
    ? selectedActivity.durationOptions.find((duration) => duration.id === selectedDurationId)
      ?? selectedActivity.durationOptions[0]
      ?? null
    : null;

  const serverNow = now + offset.current;
  const remainingMs = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remainingMs <= 0;
  const progress = active ? Math.min(1, Math.max(0, 1 - remainingMs / total)) : 0;

  const readyFor = useRef<string | null>(null);
  useEffect(() => {
    if (ready && active && readyFor.current !== active.id) {
      readyFor.current = active.id;
      load();
    }
  }, [ready, active, load]);

  const featuredQuest: QuestView | null = quests
    ? quests.quests.find((quest) => quest.status === "active")
      ?? quests.quests.find((quest) => quest.status === "available")
      ?? quests.quests.find((quest) => quest.status === "locked")
      ?? null
    : null;

  const combatSkills = data?.skills.filter((skill) => skill.category === "combat") ?? [];
  const vitality = combatSkills.find((skill) => skill.id === "vitality")?.level ?? 1;
  const defense = combatSkills.find((skill) => skill.id === "defense")?.level ?? 1;
  const strength = combatSkills.find((skill) => skill.id === "strength")?.level ?? 1;
  const dexterity = combatSkills.find((skill) => skill.id === "dexterity")?.level ?? 1;

  async function start() {
    if (!data || !selectedActivity || !selectedDuration) return;
    setClaimNotice(null);
    setActivityNotice(null);
    setBusy("start");
    setActionError(null);
    requestId.current ??= crypto.randomUUID();

    try {
      await api<ActivityResponse>("/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          definitionId: selectedActivity.id,
          durationId: selectedDuration.id,
          requestId: requestId.current,
        }),
      });
      requestId.current = null;
      polls.current = 0;
      await load();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not start. Try again.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function claim() {
    if (!active) return;
    setActivityNotice(null);
    setBusy("claim");
    setActionError(null);

    try {
      const result = await api<ClaimResponse>(
        `/activities/${encodeURIComponent(active.id)}/claim`,
        { method: "POST" },
      );
      if (result.rewardGranted) setClaimNotice(result);
      polls.current = 0;
      await load();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Claim failed. Try again.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function cancel() {
    if (!active) return;
    const confirmed = window.confirm(
      active.inputs.length > 0
        ? "Cancel this activity? Reserved materials will be returned and no reward will be granted."
        : "Cancel this activity? Progress will be discarded and no reward will be granted.",
    );
    if (!confirmed) return;

    setBusy("cancel");
    setActionError(null);
    setClaimNotice(null);
    setActivityNotice(null);

    try {
      await api<ActivityResponse>(
        `/activities/${encodeURIComponent(active.id)}/cancel`,
        { method: "POST" },
      );
      requestId.current = null;
      polls.current = 0;
      setActivityNotice(
        active.inputs.length > 0
          ? "Activity cancelled. Reserved materials were returned."
          : "Activity cancelled. No rewards were granted.",
      );
      await load();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Cancel failed. Try again.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <header className="bar game-header">
        <div className="wrap">
          <Brand />
          <div className="header-resources">
            {data && (
              <span className="resource-chip">
                <Coins size={16} aria-hidden="true" />
                {data.player.gold.toLocaleString()}
              </span>
            )}
          </div>
          <UserButton />
        </div>
      </header>

      <PlayerNav current="dashboard" />

      <main className="wrap home-shell" aria-busy={!data && !loadError}>
        {loadError && (
          <div className="alert" role="alert">
            <span>{data ? "Showing last known state. " : ""}{loadError}</span>
            <button className="btn ghost sm" onClick={() => { polls.current = 0; load(); }}>Retry</button>
          </div>
        )}

        {!data && !loadError && <Skeleton />}
        {!data && loadError && <p className="empty">Station data unavailable.</p>}

        {data && (
          <div className="home-grid">
            <section className="character-hero game-card">
              <div className="character-art" aria-hidden="true">
                <div className="character-emblem">
                  {data.player.displayName.slice(0, 1).toUpperCase()}
                </div>
                <div className="character-ridge" />
              </div>

              <div className="character-info">
                <div className="eyebrow">Frontier operator</div>
                <div className="character-title-row">
                  <div>
                    <h1>{data.player.displayName}</h1>
                    <p className="level-line">Level {data.progression.level}</p>
                  </div>
                  <span className="level-medallion">{data.progression.level}</span>
                </div>

                <div className="xp-row">
                  <span>{data.progression.xpIntoLevel.toLocaleString()} / {data.progression.xpForNextLevel.toLocaleString()} XP</span>
                  <span>{data.progression.xpRemaining.toLocaleString()} to next level</span>
                </div>
                <div className="bartrack hero-xp">
                  <div
                    className="barfill"
                    style={{
                      transform: `scaleX(${
                        data.progression.xpForNextLevel > 0
                          ? data.progression.xpIntoLevel / data.progression.xpForNextLevel
                          : 1
                      })`,
                    }}
                  />
                </div>

                <div className="combat-rating">
                  <Swords size={26} aria-hidden="true" />
                  <span>Combat Rating</span>
                  <strong>{combat?.combatRating.toLocaleString() ?? "—"}</strong>
                </div>

                <div className="hero-stats">
                  <StatChip label="Vitality" value={vitality} icon={<span>♥</span>} />
                  <StatChip label="Defense" value={defense} icon={<Shield size={18} />} />
                  <StatChip label="Strength" value={strength} icon={<span>◆</span>} />
                  <StatChip label="Dexterity" value={dexterity} icon={<span>✦</span>} />
                </div>
              </div>
            </section>

            {activityNotice && (
              <div className="reward-notice" role="status">
                <strong>{activityNotice}</strong>
                <button className="btn ghost sm" onClick={() => setActivityNotice(null)}>Dismiss</button>
              </div>
            )}

            {claimNotice && (
              <div className="reward-notice" role="status">
                <div>
                  <strong>
                    {claimNotice.levelsGained > 0
                      ? `Level up — Level ${claimNotice.progression.level}`
                      : "Rewards stored"}
                  </strong>
                  <div className="mono notice-detail">{rewardText(claimNotice.activity.reward)}</div>
                </div>
                <button className="btn ghost sm" onClick={() => setClaimNotice(null)}>Dismiss</button>
              </div>
            )}

            <section className="game-card quest-preview">
              <div className="section-banner quest-banner">
                <ScrollText size={20} aria-hidden="true" />
                <span>{featuredQuest?.status === "active" ? "Active Quest" : "Next Quest"}</span>
                <small>Main Story</small>
              </div>

              {featuredQuest ? (
                <div className="quest-preview-body">
                  <div>
                    <h2>{featuredQuest.name}</h2>
                    <p>{featuredQuest.description}</p>
                    <div className="quest-objective">
                      <span className={featuredQuest.status === "completed" ? "check on" : "check"} />
                      <strong>{featuredQuest.objective}</strong>
                    </div>
                    <div className="quest-reward-line">
                      <span>Rewards</span>
                      <strong>{rewardText(featuredQuest.reward)}</strong>
                    </div>
                  </div>

                  <Link href="/quests" className="btn gold-btn">
                    Open Quest
                    <span aria-hidden="true">›</span>
                  </Link>
                </div>
              ) : (
                <p className="empty">No campaign assignment is available.</p>
              )}
            </section>

            <section className="game-card activity-card">
              <div className="section-banner activity-banner">
                <Trees size={20} aria-hidden="true" />
                <span>Current Activity</span>
              </div>

              {active ? (
                <div className="activity-body">
                  <div className="activity-illustration" aria-hidden="true">
                    <Trees size={44} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-heading">
                      <div>
                        <h2>{activeDefinition?.name ?? pretty(active.definitionId)}</h2>
                        <p>{activeDefinition?.description ?? "Frontier work in progress."}</p>
                      </div>
                      <span className="tag on">{ready ? "Ready" : "Active"}</span>
                    </div>

                    <div
                      className="bartrack"
                      role="progressbar"
                      aria-label="Activity progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress * 100)}
                    >
                      <div className="barfill activity-progress" style={{ transform: `scaleX(${progress})` }} />
                    </div>

                    <div className="activity-time">
                      <strong>{ready ? "Ready to claim" : `${fmtTime(remainingMs / 1000)} remaining`}</strong>
                      <span>{rewardText(active.reward)}</span>
                    </div>

                    <div className="activity-actions">
                      <button className="btn ghost" onClick={cancel} disabled={busy !== null}>
                        {busy === "cancel" ? "Cancelling..." : "Cancel"}
                      </button>
                      <button className="btn gold-btn" onClick={claim} disabled={busy !== null || !ready}>
                        {busy === "claim" ? "Claiming..." : "Claim Reward"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedActivity && selectedDuration ? (
                <div className="activity-body activity-start">
                  <div className="activity-illustration" aria-hidden="true">
                    <Trees size={44} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-heading">
                      <div>
                        <h2>Choose Gathering Work</h2>
                        <p>Start an idle activity and let the server track it while you are away.</p>
                      </div>
                    </div>

                    <div className="activity-controls">
                      <label>
                        <span>Activity</span>
                        <select
                          className="activity-select"
                          value={selectedActivityId}
                          onChange={(event) => {
                            setSelectedActivityId(event.target.value);
                            setActionError(null);
                            requestId.current = null;
                          }}
                          disabled={busy !== null}
                        >
                          {data.gatheringActivities.map((activity) => (
                            <option value={activity.id} key={activity.id}>{activity.name}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Duration</span>
                        <select
                          className="activity-select"
                          value={selectedDuration.id}
                          onChange={(event) => {
                            setSelectedDurationId(event.target.value);
                            setActionError(null);
                            requestId.current = null;
                          }}
                          disabled={busy !== null}
                        >
                          {selectedActivity.durationOptions.map((duration) => (
                            <option value={duration.id} key={duration.id}>{duration.label}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="activity-time">
                      <strong>{selectedActivity.name}</strong>
                      <span>{rewardText(selectedDuration.reward)}</span>
                    </div>

                    <button className="btn gold-btn activity-start-button" onClick={start} disabled={busy !== null}>
                      {busy === "start" ? "Starting..." : "Start Activity"}
                    </button>
                  </div>
                </div>
              ) : null}

              {actionError && <p className="action-error" role="alert">{actionError}</p>}
            </section>

            <section className="quick-section">
              <div className="quick-section-title">Quick Access</div>
              <div className="quick-grid">
                <QuickLink href="/inventory" label="Inventory" Icon={Backpack} />
                <QuickLink href="/inventory" label="Equipment" Icon={Shield} />
                <QuickLink href="/skills" label="Skills" Icon={BarChart3} />
                <QuickLink href="/crafting" label="Workshop" Icon={Hammer} />
                <QuickLink href="/combat" label="Combat" Icon={Swords} />
                <QuickLink href="/world" label="World Map" Icon={Map} />
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

function Skeleton() {
  return (
    <div className="home-grid" role="status" aria-label="Loading station data">
      <div className="skel" style={{ height: 300 }} />
      <div className="skel" style={{ height: 220 }} />
      <div className="skel" style={{ height: 220 }} />
    </div>
  );
}
