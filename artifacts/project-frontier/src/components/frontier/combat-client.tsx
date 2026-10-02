"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type {
  ActivityResponse,
  ClaimResponse,
  CombatResolutionView,
  CombatResponse,
  Reward,
} from "@/game/contracts";
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

function bonusText(bonuses: object) {
  const parts = Object.entries(bonuses)
    .filter(([, value]) => typeof value === "number" && value > 0)
    .map(([key, value]) => `+${value} ${pretty(key)}`);
  return parts.length > 0 ? parts.join(" · ") : "No gear bonuses";
}

function rewardText(reward: Reward) {
  const parts = [`+${reward.xp.toLocaleString()} character XP`];
  if (reward.gold > 0) parts.push(`+${reward.gold.toLocaleString()} gold`);
  if (reward.quantity > 0) parts.push(`+${reward.quantity.toLocaleString()} ${pretty(reward.itemId)}`);
  if (reward.skillId && reward.skillXp) {
    parts.push(`+${reward.skillXp.toLocaleString()} ${pretty(reward.skillId)} XP`);
  }
  return parts.join(" · ");
}

function fmtTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function BattleReport({ battle }: { battle: CombatResolutionView }) {
  const won = battle.result === "victory";
  return (
    <section className="panel" aria-labelledby="battle-report">
      <h2 id="battle-report">Battle report · {won ? "Victory" : "Defeat"}</h2>
      <div className="grid two">
        <div>
          <div className="mono" style={{ fontWeight: 600 }}>Operator</div>
          <p className="muted" style={{ margin: ".25rem 0 .5rem" }}>
            HP {battle.playerHp} / {battle.playerMaxHp}
          </p>
          <div className="bartrack" aria-label="Player health">
            <div className="barfill" style={{ transform: `scaleX(${battle.playerMaxHp > 0 ? battle.playerHp / battle.playerMaxHp : 0})` }} />
          </div>
        </div>
        <div>
          <div className="mono" style={{ fontWeight: 600 }}>{battle.enemyName}</div>
          <p className="muted" style={{ margin: ".25rem 0 .5rem" }}>
            HP {battle.enemyHp} / {battle.enemyMaxHp}
          </p>
          <div className="bartrack" aria-label="Enemy health">
            <div className="barfill" style={{ transform: `scaleX(${battle.enemyMaxHp > 0 ? battle.enemyHp / battle.enemyMaxHp : 0})` }} />
          </div>
        </div>
      </div>
      <p className="mono muted" style={{ fontSize: ".78rem", margin: ".75rem 0 .25rem" }}>
        Combat rating {battle.combatRating} · {battle.rounds.length} rounds
      </p>
      <p className="mono muted" style={{ fontSize: ".75rem", margin: "0 0 .5rem" }}>
        Equipped bonuses: {bonusText(battle.gearBonuses)}
      </p>
      <div style={{ maxHeight: 260, overflow: "auto" }}>
        {battle.rounds.map((round) => (
          <div className="row" key={round.round}>
            <span>Round {round.round}</span>
            <span className="mono" style={{ textAlign: "right", fontSize: ".78rem" }}>
              You dealt {round.playerDamage} · Took {round.enemyDamage}
              <br />
              <span className="muted">HP {round.playerHpAfter} · Enemy {round.enemyHpAfter}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CombatClient({ userId }: { userId: string }) {
  const [data, setData] = useState<CombatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastBattle, setLastBattle] = useState<CombatResolutionView | null>(null);
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
      setError(err instanceof Error ? err.message : "Could not load the combat station.");
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
  const activeIsBattle = !!active && active.definitionId.startsWith("fight-");
  const serverNow = now + offset.current;
  const remaining = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remaining <= 0;
  const progress = active ? Math.min(1, Math.max(0, 1 - remaining / total)) : 0;

  async function startActivity(definitionId: string, durationId: string, success: string) {
    setBusy("start");
    setError(null);
    setNotice(null);
    setLastBattle(null);
    requestId.current ??= crypto.randomUUID();
    try {
      await api<ActivityResponse>("/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definitionId, durationId, requestId: requestId.current }),
      });
      requestId.current = null;
      setNotice(success);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the activity.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function startTraining() {
    if (!drill || !duration) return;
    await startActivity(
      drill.id,
      duration.id,
      "Training started. The server is tracking the session while you are away.",
    );
  }

  async function startBattle(encounterId: string, enemyName: string) {
    await startActivity(
      encounterId,
      "1m",
      `Encounter started against ${enemyName}. The server has locked in the combat simulation.`,
    );
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
        const battle = result.activity.reward.combat ?? null;
        setLastBattle(battle);
        if (battle) {
          const gearDrop = result.activity.reward.equipmentDropId
            ? ` Gear drop: ${pretty(result.activity.reward.equipmentDropId)}.`
            : "";
          setNotice(
            battle.result === "victory"
              ? `Victory over ${battle.enemyName}. ${rewardText(result.activity.reward)}.${gearDrop}`
              : `Defeat against ${battle.enemyName}. You earned ${result.activity.reward.xp} character XP from the attempt.`,
          );
        } else {
          const skillLevel = result.skillProgression
            ? ` · ${pretty(result.skillProgression.skillId)} level ${result.skillProgression.progression.level}`
            : "";
          setNotice(`Training complete: ${rewardText(result.activity.reward)}${skillLevel}.`);
        }
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
        <h1 className="mono" style={{ margin: "0 0 .4rem", fontSize: "1.5rem" }}>Combat & Training</h1>
        <p className="muted" style={{ margin: "0 0 1rem" }}>
          Build six combat skills, then use them in server-resolved encounters for gold, XP and loot.
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
          <div className="grid" role="status" aria-label="Loading combat station">
            <div className="skel" style={{ height: 180 }} />
            <div className="skel" style={{ height: 160 }} />
          </div>
        )}

        {data && (
          <div className="grid">
            <p className="mono muted" style={{ margin: 0, fontSize: ".85rem" }}>
              {data.player.displayName} · {data.player.gold.toLocaleString()} gold · Combat rating {data.combatRating}
              <br />
              Equipped bonuses: {bonusText(data.gearBonuses)}
            </p>

            {active && (
              <section className="panel" aria-labelledby="active-combat">
                <h2 id="active-combat">{activeIsBattle ? "Active encounter" : "Active training"}</h2>
                <div className="mono" style={{ fontWeight: 600 }}>
                  {data.activeActivityName ?? pretty(active.definitionId)}
                </div>
                <p className="mono muted" style={{ margin: ".35rem 0 .75rem", fontSize: ".8rem" }}>
                  {activeIsBattle
                    ? "Battle outcome is sealed on the server. Claim when the timer finishes."
                    : rewardText(active.reward)}
                </p>
                <div
                  className="bartrack"
                  role="progressbar"
                  aria-label="Activity progress"
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
                      {busy === "claim" ? "Claiming..." : activeIsBattle ? "Reveal battle" : "Claim training"}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {lastBattle && <BattleReport battle={lastBattle} />}

            {!active && (
              <section className="panel" aria-labelledby="encounters">
                <h2 id="encounters">Frontier encounters</h2>
                <p className="muted" style={{ margin: "0 0 1rem", fontSize: ".84rem" }}>
                  Push into new regions by raising your combat rating through training and equipment.
                </p>
                <div className="grid" style={{ gap: "1.25rem" }}>
                  {Array.from(new Set(data.enemies.map((enemy) => enemy.regionName))).map((regionName) => (
                    <div key={regionName}>
                      <div className="label" style={{ marginBottom: ".5rem" }}>{regionName}</div>
                      <div className="grid three">
                        {data.enemies
                          .filter((enemy) => enemy.regionName === regionName)
                          .map((enemy) => {
                            const locked = data.combatRating < enemy.requiredCombatRating;
                            return (
                              <div className="item" key={enemy.id}>
                                <div className="item-head">
                                  <strong>{enemy.name}</strong>
                                  <div className="item-actions">
                                    <span className="tag">HP {enemy.maxHp}</span>
                                    <span className={locked ? "tag" : "tag on"}>
                                      {locked ? `Rating ${enemy.requiredCombatRating}` : "Unlocked"}
                                    </span>
                                  </div>
                                </div>
                                <p className="muted" style={{ margin: ".4rem 0 .6rem", fontSize: ".82rem" }}>
                                  {enemy.description}
                                </p>
                                <div className="row"><span>Attack</span><strong className="mono">{enemy.attack}</strong></div>
                                <div className="row"><span>Defense</span><strong className="mono">{enemy.defense}</strong></div>
                                <div className="row">
                                  <span>Required rating</span>
                                  <strong className="mono">{enemy.requiredCombatRating}</strong>
                                </div>
                                <div className="row">
                                  <span>Victory loot</span>
                                  <strong className="mono" style={{ textAlign: "right", fontSize: ".76rem" }}>{rewardText(enemy.reward)}</strong>
                                </div>
                                {enemy.equipmentDrop && (
                                  <div className="row">
                                    <span>Gear chance</span>
                                    <strong className="mono" style={{ textAlign: "right", fontSize: ".76rem" }}>
                                      {Math.round(enemy.equipmentDrop.chance * 100)}% · {pretty(enemy.equipmentDrop.itemId)}
                                    </strong>
                                  </div>
                                )}
                                <button
                                  className="btn"
                                  style={{ width: "100%", marginTop: ".75rem" }}
                                  onClick={() => startBattle(enemy.encounterId, enemy.name)}
                                  disabled={busy !== null || locked}
                                >
                                  {locked
                                    ? `Locked · rating ${enemy.requiredCombatRating}`
                                    : busy === "start"
                                      ? "Starting..."
                                      : "Start encounter"}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!active && drill && duration && (
              <section className="panel" aria-labelledby="training-drill">
                <h2 id="training-drill">Combat training</h2>
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
                    <div className="row"><span>Trains</span><strong>{pretty(drill.skillId)}</strong></div>
                    <div className="row">
                      <span>Rewards</span>
                      <strong className="mono" style={{ textAlign: "right" }}>{rewardText(duration.reward)}</strong>
                    </div>
                  </div>

                  <button className="btn" onClick={startTraining} disabled={busy !== null}>
                    {busy === "start" ? "Starting..." : "Start training"}
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}
