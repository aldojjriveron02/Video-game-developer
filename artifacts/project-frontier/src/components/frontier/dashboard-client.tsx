"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type { ActivityDefinitionView, ActivityResponse, ClaimResponse, Dashboard, Reward } from "@/game/contracts";
import { Brand } from "./brand";
import Link from "next/link";
import { PlayerNav } from "./player-nav";
import { ProgressionPanel } from "./progression-panel";

type ApiError = { error: string; code: string };
const MAX_POLLS = 20;
const POLL_MS = 15000;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/frontier-api${path}`, { credentials: "include", cache: "no-store", ...init });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const e = body as Partial<ApiError> | null;
    throw new Error(e?.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

const fmtTime = (s: number) => {
  const t = Math.max(0, Math.ceil(s));
  const m = Math.floor(t / 60);
  return `${String(m).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};
const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—");
const rewardText = (r: Reward) => {
  const skill = r.skillId && r.skillXp
    ? `, ${r.skillXp} ${r.skillId.replaceAll("-", " ")} xp`
    : "";
  return `${r.quantity} x ${r.itemId}, ${r.gold} gold, ${r.xp} xp${skill}`;
};

export function DashboardClient({ userId }: { userId: string }) {
  const [data, setData] = useState<Dashboard | null>(null);
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
      const d = await api<Dashboard>("/dashboard");
      if (!alive.current || mine !== seq.current) return;
      offset.current = Date.parse(d.serverTime) - Date.now();
      if (d.activeActivity) requestId.current = null;
      setSelectedActivityId((current) =>
        d.gatheringActivities.some((activity) => activity.id === current)
          ? current
          : (d.gatheringActivities[0]?.id ?? d.gathering.id),
      );
      setSelectedDurationId((current) =>
        d.gatheringActivities.some((activity) =>
          activity.durationOptions.some((duration) => duration.id === current),
        )
          ? current
          : "1m",
      );
      setData(d);
      setLoadError(null);
    } catch (e) {
      if (!alive.current || mine !== seq.current) return;
      setLoadError(e instanceof Error ? e.message : "Could not reach the station.");
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    setData(null);
    setClaimNotice(null);
    setActivityNotice(null);
    requestId.current = null;
    load();
    const onFocus = () => { polls.current = 0; load(); };
    const onVis = () => { if (document.visibilityState === "visible") onFocus(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    const poll = setInterval(() => {
      if (polls.current < MAX_POLLS && document.visibilityState === "visible") { polls.current++; load(); }
    }, POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive.current = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(poll); clearInterval(tick);
    };
  }, [load, userId]);

  const active = data?.activeActivity ?? null;
  const selectedActivity: ActivityDefinitionView | null = data
    ? data.gatheringActivities.find((activity) => activity.id === selectedActivityId) ?? data.gathering
    : null;
  const activeDefinition: ActivityDefinitionView | null = active && data
    ? data.gatheringActivities.find((activity) => activity.id === active.definitionId) ?? selectedActivity
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

  // one refresh when the display countdown reaches zero
  const readyFor = useRef<string | null>(null);
  useEffect(() => {
    if (ready && active && readyFor.current !== active.id) { readyFor.current = active.id; load(); }
  }, [ready, active, load]);

  async function start() {
    if (!data || !selectedActivity || !selectedDuration) return;
    setClaimNotice(null);
    setActivityNotice(null);
    setBusy("start"); setActionError(null);
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
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not start. Try again.");
      await load();
    } finally { setBusy(null); }
  }

  async function claim() {
    if (!active) return;
    setActivityNotice(null);
    setBusy("claim"); setActionError(null);
    try {
      const result = await api<ClaimResponse>(`/activities/${encodeURIComponent(active.id)}/claim`, { method: "POST" });
      if (result.rewardGranted) setClaimNotice(result);
      polls.current = 0;
      await load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Claim failed. Try again.");
      await load();
    } finally { setBusy(null); }
  }

  async function cancel() {
    if (!active) return;
    const confirmed = window.confirm(
      "Cancel this activity? Progress will be discarded and no reward will be granted.",
    );
    if (!confirmed) return;

    setBusy("cancel"); setActionError(null); setClaimNotice(null); setActivityNotice(null);
    try {
      await api<ActivityResponse>(`/activities/${encodeURIComponent(active.id)}/cancel`, {
        method: "POST",
      });
      requestId.current = null;
      polls.current = 0;
      setActivityNotice("Activity cancelled. No rewards were granted. You can start another job now.");
      await load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Cancel failed. Try again.");
      await load();
    } finally { setBusy(null); }
  }

  return (
    <>
      <header className="bar">
        <div className="wrap">
          <Brand />
          <UserButton />
        </div>
      </header>
      <PlayerNav current="dashboard" />
      <main className="wrap" style={{ padding: "1.5rem 1.25rem 4rem" }} aria-busy={!data && !loadError}>
        {loadError && (
          <div className="alert" role="alert" style={{ marginBottom: "1rem" }}>
            <span>{data ? "Showing last known state. " : ""}{loadError}</span>
            <button className="btn ghost" onClick={() => { polls.current = 0; load(); }}>Retry</button>
          </div>
        )}
        {!data && !loadError && <Skeleton />}
        {!data && loadError && <p className="empty">Station data unavailable.</p>}
        {data && (
          <div className="grid">
            <div>
              <p className="label" style={{ marginBottom: ".25rem" }}>Operator</p>
              <h1 className="mono" style={{ margin: 0, fontSize: "1.5rem" }}>{data.player.displayName}</h1>
            </div>

            <div className="grid two">
              <section className="panel" aria-label="Gold">
                <h2>Gold</h2><div className="stat">{data.player.gold.toLocaleString()}</div>
                <p className="muted" style={{ fontSize: ".8rem", marginBottom: 0 }}>Saved to your character</p>
              </section>
              <ProgressionPanel progression={data.progression} />
            </div>

            {activityNotice && (
              <div className="reward-notice" role="status">
                <span><strong>{activityNotice}</strong></span>
                <button className="btn ghost" onClick={() => setActivityNotice(null)} aria-label="Dismiss activity notification">Dismiss</button>
              </div>
            )}

            {claimNotice && (
              <div className="reward-notice" role="status">
                <div>
                  <strong>{claimNotice.levelsGained > 0
                    ? `Level up! You reached level ${claimNotice.progression.level}.`
                    : "Rewards stored."}</strong>
                  <div className="mono" style={{ fontSize: ".85rem" }}>
                    +{claimNotice.activity.reward.quantity} {claimNotice.activity.reward.itemId}
                    {" · "}+{claimNotice.activity.reward.gold} gold
                    {" · "}+{claimNotice.activity.reward.xp} XP
                    {claimNotice.activity.reward.skillId && claimNotice.activity.reward.skillXp
                      ? ` · +${claimNotice.activity.reward.skillXp} ${claimNotice.activity.reward.skillId.replaceAll("-", " ")} XP`
                      : ""}
                    {claimNotice.skillLevelsGained > 0 && claimNotice.skillProgression
                      ? ` · ${claimNotice.skillProgression.skillId.replaceAll("-", " ")} level ${claimNotice.skillProgression.progression.level}`
                      : ""}
                  </div>
                </div>
                <button className="btn ghost" onClick={() => setClaimNotice(null)} aria-label="Dismiss reward notification">Dismiss</button>
              </div>
            )}

            <section className="panel" aria-labelledby="job">
              <h2 id="job">Gathering assignment</h2>
              {!active && selectedActivity && (
                <div className="grid" style={{ gap: ".75rem" }}>
                  <label>
                    <span className="label" style={{ display: "block", marginBottom: ".35rem" }}>Choose activity</span>
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
                    <span className="label" style={{ display: "block", marginBottom: ".35rem" }}>Work time</span>
                    <select
                      className="activity-select"
                      value={selectedDuration?.id ?? "1m"}
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
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div>
                      <div className="mono" style={{ fontWeight: 600 }}>{selectedActivity.name}</div>
                      <p className="muted" style={{ margin: ".25rem 0" }}>{selectedActivity.description}</p>
                      {selectedDuration && (
                        <p className="mono muted" style={{ margin: 0, fontSize: ".8rem" }}>
                          {selectedDuration.label} &middot; {rewardText(selectedDuration.reward)}
                        </p>
                      )}
                    </div>
                    <button className="btn" onClick={start} disabled={busy !== null}>
                      {busy === "start" ? "Starting..." : actionError && requestId.current ? "Retry start" : "Start activity"}
                    </button>
                  </div>
                </div>
              )}
              {active && activeDefinition && (
                <div style={{ marginTop: "1rem" }}>
                  <div className="bartrack" role="progressbar" aria-label="Gathering progress"
                    aria-valuemin={0} aria-valuemax={100}
                    aria-valuenow={Math.round(Math.min(1, Math.max(0, 1 - remainingMs / total)) * 100)}>
                    <div className="barfill" style={{ transform: `scaleX(${Math.min(1, Math.max(0, 1 - remainingMs / total))})` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".75rem", gap: "1rem", flexWrap: "wrap" }}>
                    <span className="mono" aria-live="off">
                      <strong>{activeDefinition.name}</strong>{" · "}
                      {ready ? "Ready to claim" : `${fmtTime(remainingMs / 1000)} remaining`}
                    </span>
                    <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                      <button className="btn ghost" onClick={cancel} disabled={busy !== null}>
                        {busy === "cancel" ? "Cancelling..." : "Cancel"}
                      </button>
                      <button className="btn" onClick={claim} disabled={busy !== null || !ready}>
                        {busy === "claim" ? "Claiming..." : "Claim reward"}
                      </button>
                    </div>
                  </div>
                  <p className="muted" style={{ fontSize: ".78rem", margin: ".5rem 0 0" }}>
                    {rewardText(active.reward)}. Timer is display-only; the server decides when a claim is accepted.
                  </p>
                </div>
              )}
              {actionError && <p role="alert" style={{ color: "var(--bad)", margin: ".75rem 0 0" }}>{actionError}</p>}
            </section>

            <div className="grid two">
              <section className="panel" aria-labelledby="inv">
                <h2 id="inv">Resources · Inventory</h2>
                <p className="muted" style={{ fontSize: ".8rem", margin: "0 0 .5rem" }}>Stored on your character, including after signing out.</p>
                <p style={{ margin: "0 0 .5rem" }}><Link href="/inventory" className="mono" style={{ color: "var(--signal)" }}>Open full inventory &amp; equipment</Link></p>
                {data.inventory.length === 0 ? <p className="empty">No resources yet. Complete gathering and claim your first reward.</p> :
                  data.inventory.map((i) => (
                    <div className="row" key={i.itemId}><span style={{ textTransform: "capitalize" }}>{i.itemId.replaceAll("-", " ")}</span><span className="mono">{i.quantity.toLocaleString()}</span></div>
                  ))}
              </section>
              <section className="panel" aria-labelledby="rec">
                <h2 id="rec">Recent activities</h2>
                {data.recentActivities.length === 0 ? <p className="empty">No completed work yet.</p> :
                  data.recentActivities.map((a) => (
                    <div className="row" key={a.id}>
                      <span>{a.definitionId}<br /><span className="muted mono" style={{ fontSize: ".75rem" }}>{fmtDate(a.claimedAt ?? a.cancelledAt)}</span></span>
                      <span className="mono" style={{ textAlign: "right", fontSize: ".8rem" }}>
                        {a.status === "cancelled" ? "Cancelled · no reward" : rewardText(a.reward)}
                      </span>
                    </div>
                  ))}
              </section>
            </div>

            <section className="panel" aria-labelledby="led">
              <h2 id="led">Ledger</h2>
              {data.ledger.length === 0 ? <p className="empty">No ledger entries yet.</p> :
                data.ledger.map((l) => (
                  <div className="row" key={l.id}>
                    <span>{l.kind}<br /><span className="muted mono" style={{ fontSize: ".75rem" }}>{fmtDate(l.createdAt)}</span></span>
                    <span className="mono" style={{ textAlign: "right", fontSize: ".8rem" }}>{rewardText(l.reward)}</span>
                  </div>
                ))}
            </section>
          </div>
        )}
      </main>
    </>
  );
}

function Skeleton() {
  return (
    <div className="grid" role="status" aria-label="Loading station data">
      <div className="skel" style={{ height: 40, width: 220 }} />
      <div className="grid two">
        <div className="skel" style={{ height: 88 }} /><div className="skel" style={{ height: 88 }} />
      </div>
      <div className="skel" style={{ height: 150 }} />
      <div className="skel" style={{ height: 120 }} />
    </div>
  );
}
