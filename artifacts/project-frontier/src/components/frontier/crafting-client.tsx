"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Hammer, Sparkles, TimerReset } from "lucide-react";
import type {
  ActivityResponse,
  ClaimResponse,
  CraftingResponse,
  ResourceCost,
  Reward,
} from "@/game/contracts";
import { PlayerNav } from "./player-nav";
import { GameHeader, ItemGlyph, ScreenHeading, SkillGlyph } from "./frontier-ui";

type ApiError = { error?: string; code?: string };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/frontier-api${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const body = await response.json().catch(() => null) as ApiError | T | null;
  if (!response.ok) {
    const error = body as ApiError | null;
    throw new Error(error?.error ?? `Request failed (${response.status})`);
  }
  return body as T;
}

function itemName(id: string) {
  return id.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function rewardText(reward: Reward) {
  const parts = [`${reward.quantity.toLocaleString()} ${itemName(reward.itemId)}`, `${reward.xp.toLocaleString()} XP`];
  if (reward.skillId && reward.skillXp) parts.push(`${reward.skillXp.toLocaleString()} ${itemName(reward.skillId)} XP`);
  if (reward.gold > 0) parts.push(`${reward.gold.toLocaleString()} gold`);
  return parts.join(" · ");
}

function costText(inputs: ResourceCost[]) {
  return inputs.map((input) => `${input.quantity.toLocaleString()} ${itemName(input.itemId)}`).join(" + ");
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

export function CraftingClient({ userId }: { userId: string }) {
  const [data, setData] = useState<CraftingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState("craft-lumber");
  const [selectedDurationId, setSelectedDurationId] = useState("1m");
  const [busy, setBusy] = useState<null | "start" | "claim" | "cancel">(null);
  const [now, setNow] = useState(() => Date.now());
  const requestId = useRef<string | null>(null);
  const offset = useRef(0);
  const alive = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await api<CraftingResponse>("/crafting");
      if (!alive.current) return;
      offset.current = Date.parse(next.serverTime) - Date.now();
      setData(next);
      setSelectedRecipeId((current) =>
        next.recipes.some((recipe) => recipe.id === current) ? current : (next.recipes[0]?.id ?? ""),
      );
      setError(null);
      if (next.activeActivity) requestId.current = null;
    } catch (err) {
      if (!alive.current) return;
      setError(err instanceof Error ? err.message : "Could not load the workshop.");
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

  const recipe = data?.recipes.find((entry) => entry.id === selectedRecipeId) ?? data?.recipes[0] ?? null;
  const duration = recipe?.durationOptions.find((entry) => entry.id === selectedDurationId) ?? recipe?.durationOptions[0] ?? null;
  const inventory = useMemo(
    () => new Map((data?.inventory ?? []).map((item) => [item.itemId, item.quantity])),
    [data],
  );
  const canAfford = !!duration && duration.inputs.every((input) => (inventory.get(input.itemId) ?? 0) >= input.quantity);

  const active = data?.activeActivity ?? null;
  const serverNow = now + offset.current;
  const remaining = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remaining <= 0;
  const progress = active ? Math.min(1, Math.max(0, 1 - remaining / total)) : 0;

  async function start() {
    if (!recipe || !duration) return;
    setBusy("start");
    setError(null);
    setNotice(null);
    requestId.current ??= crypto.randomUUID();
    try {
      await api<ActivityResponse>("/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definitionId: recipe.id, durationId: duration.id, requestId: requestId.current }),
      });
      requestId.current = null;
      setNotice("Crafting started. Materials were reserved from your inventory.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start crafting.");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function cancel() {
    if (!active) return;
    const hasInputs = active.inputs.length > 0;
    if (!window.confirm(hasInputs ? "Cancel this activity? Reserved materials will be returned." : "Cancel this activity?")) return;
    setBusy("cancel");
    setError(null);
    setNotice(null);
    try {
      await api<ActivityResponse>(`/activities/${encodeURIComponent(active.id)}/cancel`, { method: "POST" });
      setNotice(hasInputs ? "Activity cancelled. Reserved materials were returned." : "Activity cancelled.");
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
      if (result.rewardGranted) setNotice(`Craft complete: ${rewardText(result.activity.reward)}.`);
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
      <PlayerNav current="crafting" />
      <main className="wrap game-screen">
        <ScreenHeading
          eyebrow="Production hall"
          title="Workshop"
          description="Turn raw frontier materials into travel supplies, refined stock and campaign components."
          metric={data && <><span>Recipes</span><strong>{data.recipes.length}</strong></>}
        />

        {error && <div className="alert" role="alert"><span>{error}</span><button className="btn ghost sm" onClick={load}>Retry</button></div>}
        {notice && <div className="reward-notice" role="status"><span>{notice}</span><button className="btn ghost sm" onClick={() => setNotice(null)}>Dismiss</button></div>}
        {!data && !error && <div className="grid"><div className="skel" style={{ height: 340 }} /><div className="skel" style={{ height: 240 }} /></div>}

        {data && (
          <div className="game-screen-stack">
            {active ? (
              <section className="craft-active game-card">
                <div className="section-banner">
                  <Hammer size={20} />
                  <span>Active Craft</span>
                  <small>{ready ? "Ready" : "Working"}</small>
                </div>
                <div className="craft-active-body">
                  <div className="craft-scene">
                    <div className="forge-glow" />
                    <Hammer size={58} />
                  </div>
                  <div className="craft-active-copy">
                    <div className="eyebrow">Workshop order</div>
                    <h2>{data.activeActivityName ?? itemName(active.definitionId)}</h2>
                    <p>{active.inputs.length ? `Reserved: ${costText(active.inputs)}` : "No materials reserved."}</p>
                    <div className="bartrack"><div className="barfill" style={{ transform: `scaleX(${progress})` }} /></div>
                    <div className="activity-time">
                      <strong>{ready ? "Ready to claim" : `${fmtTime(remaining)} remaining`}</strong>
                      <span>{rewardText(active.reward)}</span>
                    </div>
                    <div className="activity-actions">
                      <button className="btn ghost" onClick={cancel} disabled={busy !== null}>{busy === "cancel" ? "Cancelling..." : "Cancel"}</button>
                      <button className="btn gold-btn" onClick={claim} disabled={busy !== null || !ready}>{busy === "claim" ? "Claiming..." : "Claim Output"}</button>
                    </div>
                  </div>
                </div>
              </section>
            ) : recipe && duration ? (
              <>
                <section className="recipe-rail game-card">
                  <div className="section-banner">
                    <Hammer size={20} />
                    <span>Recipes</span>
                    <small>Choose a craft</small>
                  </div>
                  <div className="recipe-tabs">
                    {data.recipes.map((entry) => (
                      <button
                        key={entry.id}
                        className={entry.id === recipe.id ? "recipe-tab selected" : "recipe-tab"}
                        onClick={() => { setSelectedRecipeId(entry.id); setSelectedDurationId("1m"); }}
                      >
                        <span className="recipe-tab-icon"><ItemGlyph id={entry.reward.itemId} size={24} /></span>
                        <span>{entry.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="craft-detail game-card">
                  <div className="craft-detail-art">
                    <div className="forge-glow" />
                    <ItemGlyph id={recipe.reward.itemId} size={72} />
                    <div className="craft-detail-art-label">{itemName(recipe.reward.itemId)}</div>
                  </div>

                  <div className="craft-detail-copy">
                    <div className="eyebrow">Production recipe</div>
                    <h2>{recipe.name}</h2>
                    <p>{recipe.description}</p>

                    <div className="craft-skill-row">
                      <SkillGlyph id={recipe.skillId} />
                      <span>Trains <strong>{itemName(recipe.skillId)}</strong></span>
                    </div>

                    <div className="material-requirements">
                      <span className="subheading">Materials</span>
                      {duration.inputs.map((input) => {
                        const owned = inventory.get(input.itemId) ?? 0;
                        const enough = owned >= input.quantity;
                        return (
                          <div className={enough ? "material-row enough" : "material-row missing"} key={input.itemId}>
                            <ItemGlyph id={input.itemId} size={24} />
                            <span>{itemName(input.itemId)}</span>
                            <strong>{owned.toLocaleString()} / {input.quantity.toLocaleString()}</strong>
                          </div>
                        );
                      })}
                    </div>

                    <label className="duration-control">
                      <span><TimerReset size={18} /> Craft time</span>
                      <select className="activity-select" value={duration.id} onChange={(event) => setSelectedDurationId(event.target.value)}>
                        {recipe.durationOptions.map((entry) => <option value={entry.id} key={entry.id}>{entry.label}</option>)}
                      </select>
                    </label>

                    <div className="craft-output">
                      <Sparkles size={20} />
                      <span>Output</span>
                      <strong>{rewardText(duration.reward)}</strong>
                    </div>

                    <button className="btn gold-btn craft-start-button" onClick={start} disabled={busy !== null || !canAfford}>
                      <Clock3 size={18} />
                      {busy === "start" ? "Starting..." : canAfford ? "Start Crafting" : "Missing Materials"}
                    </button>
                  </div>
                </section>
              </>
            ) : (
              <p className="empty">No production recipes are available.</p>
            )}

            <section className="game-card">
              <div className="section-banner">
                <Sparkles size={20} />
                <span>Material Stores</span>
                <small>{data.inventory.length} stacks</small>
              </div>
              <div className="material-store-grid">
                {data.inventory.length === 0 ? (
                  <p className="empty padded-empty">No materials yet. Gather resources from Home first.</p>
                ) : data.inventory.map((item) => (
                  <div className="material-store-item" key={item.itemId}>
                    <ItemGlyph id={item.itemId} size={24} />
                    <span>{itemName(item.itemId)}</span>
                    <strong>{item.quantity.toLocaleString()}</strong>
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
