"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shield, Sparkles, Swords, Target, TimerReset, Trophy } from "lucide-react";
import type {
  ActivityResponse,
  ClaimResponse,
  CombatEnemyView,
  CombatResolutionView,
  CombatResponse,
  Reward,
} from "@/game/contracts";
import { PlayerNav } from "./player-nav";
import {
  EnemyPortrait,
  GameHeader,
  ItemGlyph,
  RegionArt,
  ScreenHeading,
  SkillGlyph,
} from "./frontier-ui";

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

function bonusText(bonuses: object) {
  const parts = Object.entries(bonuses)
    .filter(([, value]) => typeof value === "number" && value > 0)
    .map(([key, value]) => `+${value} ${pretty(key)}`);
  return parts.length ? parts.join(" · ") : "No gear bonuses";
}

function rewardText(reward: Reward) {
  const parts = [];
  if (reward.gold > 0) parts.push(`${reward.gold.toLocaleString()} gold`);
  if (reward.xp > 0) parts.push(`${reward.xp.toLocaleString()} XP`);
  if (reward.quantity > 0) parts.push(`${reward.quantity.toLocaleString()} ${pretty(reward.itemId)}`);
  if (reward.skillId && reward.skillXp) parts.push(`${reward.skillXp.toLocaleString()} ${pretty(reward.skillId)} XP`);
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

function difficulty(enemy: CombatEnemyView, rating: number) {
  const delta = rating - enemy.requiredCombatRating;
  if (delta >= 18) return { label: "Easy", className: "easy" };
  if (delta >= 0) return { label: "Ready", className: "medium" };
  return { label: "Locked", className: "hard" };
}

function BattleReport({ battle }: { battle: CombatResolutionView }) {
  const won = battle.result === "victory";
  return (
    <section className={`game-card battle-result ${won ? "victory" : "defeat"}`}>
      <div className="battle-result-hero">
        <div className="battle-result-icon">{won ? <Trophy size={32} /> : <Shield size={32} />}</div>
        <div>
          <div className="eyebrow">Combat result</div>
          <h2>{won ? "Victory" : "Defeat"}</h2>
          <p>{won ? `You defeated the ${battle.enemyName}.` : `${battle.enemyName} forced a retreat.`}</p>
        </div>
      </div>

      <div className="battle-health-grid">
        <div>
          <span>Operator</span>
          <strong>{battle.playerHp} / {battle.playerMaxHp} HP</strong>
          <div className="bartrack"><div className="barfill" style={{ transform: `scaleX(${battle.playerMaxHp ? battle.playerHp / battle.playerMaxHp : 0})` }} /></div>
        </div>
        <div>
          <span>{battle.enemyName}</span>
          <strong>{battle.enemyHp} / {battle.enemyMaxHp} HP</strong>
          <div className="bartrack"><div className="barfill enemy-health" style={{ transform: `scaleX(${battle.enemyMaxHp ? battle.enemyHp / battle.enemyMaxHp : 0})` }} /></div>
        </div>
      </div>

      <div className="battle-summary-row">
        <span>Combat rating <strong>{battle.combatRating}</strong></span>
        <span>{battle.rounds.length} rounds</span>
        <span>{bonusText(battle.gearBonuses)}</span>
      </div>

      <details className="battle-log">
        <summary>View round-by-round report</summary>
        <div className="battle-log-list">
          {battle.rounds.map((round) => (
            <div className="battle-log-row" key={round.round}>
              <span>Round {round.round}</span>
              <span>You dealt {round.playerDamage}</span>
              <span>Took {round.enemyDamage}</span>
              <span>HP {round.playerHpAfter}</span>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

export function CombatClient({ userId }: { userId: string }) {
  const [data, setData] = useState<CombatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastBattle, setLastBattle] = useState<CombatResolutionView | null>(null);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
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
      setSelectedEnemyId((current) => current ?? next.enemies[0]?.id ?? null);
      setSelectedDrillId((current) => next.drills.some((drill) => drill.id === current) ? current : (next.drills[0]?.id ?? ""));
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

  const drill = data?.drills.find((entry) => entry.id === selectedDrillId) ?? data?.drills[0] ?? null;
  const duration = drill?.durationOptions.find((entry) => entry.id === selectedDurationId) ?? drill?.durationOptions[0] ?? null;
  const selectedEnemy = data?.enemies.find((entry) => entry.id === selectedEnemyId) ?? data?.enemies[0] ?? null;
  const active = data?.activeActivity ?? null;
  const activeIsBattle = !!active && active.definitionId.startsWith("fight-");
  const serverNow = now + offset.current;
  const remaining = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remaining <= 0;
  const progress = active ? Math.min(1, Math.max(0, 1 - remaining / total)) : 0;

  const regions = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.enemies.map((enemy) => enemy.regionName)));
  }, [data]);

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
    await startActivity(drill.id, duration.id, "Training started. The server is tracking the session.");
  }

  async function startBattle(enemy: CombatEnemyView) {
    await startActivity(enemy.encounterId, "1m", `Encounter started against ${enemy.name}.`);
  }

  async function cancel() {
    if (!active) return;
    if (!window.confirm("Cancel this activity? Progress will be discarded and no reward will be granted.")) return;
    setBusy("cancel");
    setError(null);
    setNotice(null);
    try {
      await api<ActivityResponse>(`/activities/${encodeURIComponent(active.id)}/cancel`, { method: "POST" });
      setNotice("Activity cancelled.");
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
      const result = await api<ClaimResponse>(`/activities/${encodeURIComponent(active.id)}/claim`, { method: "POST" });
      if (result.rewardGranted) {
        const battle = result.activity.reward.combat ?? null;
        setLastBattle(battle);
        if (battle) {
          const gearDrop = result.activity.reward.equipmentDropId
            ? ` · Gear: ${pretty(result.activity.reward.equipmentDropId)}`
            : "";
          setNotice(
            battle.result === "victory"
              ? `Victory. ${rewardText(result.activity.reward)}${gearDrop}`
              : `Defeat. ${result.activity.reward.xp} XP earned from the attempt.`,
          );
        } else {
          setNotice(`Training complete. ${rewardText(result.activity.reward)}`);
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
      <GameHeader gold={data?.player.gold} />
      <PlayerNav current="combat" />
      <main className="wrap game-screen">
        <ScreenHeading
          eyebrow="Frontier operations"
          title="Combat"
          description="Choose a target, inspect the risk, and let your trained skills and equipped gear decide the encounter."
          metric={data && <><span>Combat rating</span><strong>{data.combatRating}</strong></>}
        />

        {error && <div className="alert" role="alert"><span>{error}</span><button className="btn ghost sm" onClick={load}>Retry</button></div>}
        {notice && <div className="reward-notice" role="status"><span>{notice}</span><button className="btn ghost sm" onClick={() => setNotice(null)}>Dismiss</button></div>}

        {!data && !error && <div className="grid"><div className="skel" style={{ height: 300 }} /><div className="skel" style={{ height: 260 }} /></div>}

        {data && (
          <div className="game-screen-stack">
            {active && (
              <section className="game-card active-operation">
                <div className="section-banner activity-banner">
                  {activeIsBattle ? <Swords size={20} /> : <Target size={20} />}
                  <span>{activeIsBattle ? "Active Encounter" : "Active Training"}</span>
                  <small>{ready ? "Ready" : "In progress"}</small>
                </div>
                <div className="active-operation-body">
                  <div>
                    <h2>{data.activeActivityName ?? pretty(active.definitionId)}</h2>
                    <p>{activeIsBattle ? "The battle outcome is sealed on the server." : rewardText(active.reward)}</p>
                  </div>
                  <div className="bartrack"><div className="barfill" style={{ transform: `scaleX(${progress})` }} /></div>
                  <div className="activity-time">
                    <strong>{ready ? "Ready to resolve" : `${fmtTime(remaining)} remaining`}</strong>
                    <span>{activeIsBattle ? "Encounter" : "Training"}</span>
                  </div>
                  <div className="activity-actions">
                    <button className="btn ghost" onClick={cancel} disabled={busy !== null}>{busy === "cancel" ? "Cancelling..." : "Cancel"}</button>
                    <button className="btn gold-btn" onClick={claim} disabled={busy !== null || !ready}>{busy === "claim" ? "Resolving..." : activeIsBattle ? "Reveal Battle" : "Claim Training"}</button>
                  </div>
                </div>
              </section>
            )}

            {lastBattle && <BattleReport battle={lastBattle} />}

            {!active && selectedEnemy && (
              <section className="combat-stage game-card">
                <RegionArt regionId={selectedEnemy.regionId} name={selectedEnemy.regionName} />
                <div className="combat-stage-overlay">
                  <div className="combat-player-card">
                    <div className="combat-player-mark">{data.player.displayName.slice(0,1).toUpperCase()}</div>
                    <div><strong>{data.player.displayName}</strong><span>Rating {data.combatRating}</span></div>
                  </div>
                  <div className="versus-mark">VS</div>
                  <div className="combat-enemy-focus">
                    <EnemyPortrait enemyId={selectedEnemy.id} name={selectedEnemy.name} regionId={selectedEnemy.regionId} />
                  </div>
                </div>
                <div className="combat-stage-info">
                  <div>
                    <div className="eyebrow">{selectedEnemy.regionName}</div>
                    <h2>{selectedEnemy.name}</h2>
                    <p>{selectedEnemy.description}</p>
                  </div>
                  <div className="enemy-stat-grid">
                    <span><small>HP</small><strong>{selectedEnemy.maxHp}</strong></span>
                    <span><small>Attack</small><strong>{selectedEnemy.attack}</strong></span>
                    <span><small>Defense</small><strong>{selectedEnemy.defense}</strong></span>
                    <span><small>Required</small><strong>{selectedEnemy.requiredCombatRating}</strong></span>
                  </div>
                  <div className="combat-reward-strip">
                    <div><ItemGlyph id={selectedEnemy.reward.itemId} /><span>{rewardText(selectedEnemy.reward)}</span></div>
                    {selectedEnemy.equipmentDrop && <div><Sparkles size={20} /><span>{Math.round(selectedEnemy.equipmentDrop.chance * 100)}% gear chance · {pretty(selectedEnemy.equipmentDrop.itemId)}</span></div>}
                  </div>
                  <button
                    className="btn encounter-btn"
                    disabled={busy !== null || data.combatRating < selectedEnemy.requiredCombatRating}
                    onClick={() => startBattle(selectedEnemy)}
                  >
                    <Swords size={19} />
                    {data.combatRating < selectedEnemy.requiredCombatRating ? `Locked · Rating ${selectedEnemy.requiredCombatRating}` : busy === "start" ? "Starting..." : "Start Encounter"}
                  </button>
                </div>
              </section>
            )}

            {!active && (
              <section className="game-card">
                <div className="section-banner">
                  <Shield size={20} />
                  <span>Enemies</span>
                  <small>{regions.length} regions</small>
                </div>
                <div className="enemy-list">
                  {data.enemies.map((enemy) => {
                    const diff = difficulty(enemy, data.combatRating);
                    const selected = selectedEnemy?.id === enemy.id;
                    return (
                      <button key={enemy.id} className={selected ? "enemy-row selected" : "enemy-row"} onClick={() => setSelectedEnemyId(enemy.id)}>
                        <EnemyPortrait enemyId={enemy.id} name={enemy.name} regionId={enemy.regionId} />
                        <div className="enemy-row-copy">
                          <strong>{enemy.name}</strong>
                          <span>{enemy.regionName} · HP {enemy.maxHp}</span>
                        </div>
                        <span className={`difficulty ${diff.className}`}>{diff.label}</span>
                        <span className="enemy-chevron">›</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {!active && drill && duration && (
              <section className="game-card training-card">
                <div className="section-banner">
                  <Target size={20} />
                  <span>Training Grounds</span>
                  <small>{bonusText(data.gearBonuses)}</small>
                </div>
                <div className="training-body">
                  <div className="training-skill-pills">
                    {data.drills.map((entry) => (
                      <button
                        key={entry.id}
                        className={entry.id === drill.id ? "training-pill selected" : "training-pill"}
                        onClick={() => { setSelectedDrillId(entry.id); setSelectedDurationId("1m"); }}
                      >
                        <SkillGlyph id={entry.skillId} />
                        <span>{pretty(entry.skillId)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="training-detail">
                    <div>
                      <div className="eyebrow">Selected drill</div>
                      <h2>{drill.name}</h2>
                      <p>{drill.description}</p>
                    </div>
                    <label className="duration-control">
                      <span><TimerReset size={18} /> Duration</span>
                      <select className="activity-select" value={duration.id} onChange={(event) => setSelectedDurationId(event.target.value)}>
                        {drill.durationOptions.map((entry) => <option value={entry.id} key={entry.id}>{entry.label}</option>)}
                      </select>
                    </label>
                    <div className="combat-reward-strip">
                      <div><Target size={20} /><span>{rewardText(duration.reward)}</span></div>
                    </div>
                    <button className="btn gold-btn" onClick={startTraining} disabled={busy !== null}>
                      {busy === "start" ? "Starting..." : "Start Training"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}
