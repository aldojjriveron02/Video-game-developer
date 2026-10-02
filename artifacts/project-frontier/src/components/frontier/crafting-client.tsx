"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type {
  ActivityResponse,
  ClaimResponse,
  CraftingResponse,
  ResourceCost,
  Reward,
} from "@/game/contracts";
import { Brand } from "./brand";
import { PlayerNav } from "./player-nav";

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
  const skill = reward.skillId && reward.skillXp
    ? ` · +${reward.skillXp.toLocaleString()} ${itemName(reward.skillId)} XP`
    : "";
  const gold = reward.gold > 0 ? ` · +${reward.gold.toLocaleString()} gold` : "";
  return `+${reward.quantity.toLocaleString()} ${itemName(reward.itemId)} · +${reward.xp.toLocaleString()} character XP${skill}${gold}`;
}

function costText(inputs: ResourceCost[]) {
  return inputs.map((input) => `${input.quantity.toLocaleString()} ${itemName(input.itemId)}`).join(" + ");
}

function fmtTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
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
        next.recipes.some((recipe) => recipe.id === current)
          ? current
          : (next.recipes[0]?.id ?? ""),
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
  const duration = recipe?.durationOptions.find((entry) => entry.id === selectedDurationId)
    ?? recipe?.durationOptions[0]
    ?? null;
  const inventory = useMemo(
    () => new Map((data?.inventory ?? []).map((item) => [item.itemId, item.quantity])),
    [data],
  );
  const canAfford = !!duration && duration.inputs.every(
    (input) => (inventory.get(input.itemId) ?? 0) >= input.quantity,
  );

  const active = data?.activeActivity ?? null;
  const serverNow = now + offset.current;
  const remaining = active ? Date.parse(active.finishesAt) - serverNow : 0;
  const total = active ? Date.parse(active.finishesAt) - Date.parse(active.startedAt) : 1;
  const ready = !!active && remaining <= 0;

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
        body: JSON.stringify({
          definitionId: recipe.id,
          durationId: duration.id,
          requestId: requestId.current,
        }),
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
    if (!window.confirm(hasInputs
      ? "Cancel this activity? Reserved materials will be returned and no reward will be granted."
      : "Cancel this activity? No reward will be granted.")) return;

    setBusy("cancel");
    setError(null);
    setNotice(null);
    try {
      await api<ActivityResponse>(`/activities/${encodeURIComponent(active.id)}/cancel`, { method: "POST" });
      setNotice(hasInputs
        ? "Activity cancelled. Reserved materials were returned."
        : "Activity cancelled.");
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
        setNotice(`Craft complete: ${rewardText(result.activity.reward)}.`);
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
      <PlayerNav current="crafting" />
      <main className="wrap" style={{ padding: "1.5rem 1.25rem 4rem" }}>
        <h1 className="mono" style={{ margin: "0 0 .4rem", fontSize: "1.5rem" }}>Workshop</h1>
        <p className="muted" style={{ margin: "0 0 1rem" }}>
          Turn gathered resources into useful materials while training production skills.
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
          <div className="grid" role="status" aria-label="Loading workshop">
            <div className="skel" style={{ height: 180 }} />
            <div className="skel" style={{ height: 140 }} />
          </div>
        )}

        {data && (
          <div className="grid">
            {active ? (
              <section className="panel" aria-labelledby="active-work">
                <h2 id="active-work">Active work</h2>
                <div className="mono" style={{ fontWeight: 600, textTransform: "capitalize" }}>
                  {data.activeActivityName ?? itemName(active.definitionId)}
                </div>
                <p className="muted" style={{ margin: ".35rem 0" }}>
                  {active.inputs.length > 0
                    ? `Reserved materials: ${costText(active.inputs)}`
                    : "No materials reserved."}
                </p>
                <p className="mono muted" style={{ margin: "0 0 .75rem", fontSize: ".8rem" }}>
                  Output: {rewardText(active.reward)}
                </p>
                <div className="bartrack" role="progressbar" aria-label="Activity progress"
                  aria-valuemin={0} aria-valuemax={100}
                  aria-valuenow={Math.round(Math.min(1, Math.max(0, 1 - remaining / total)) * 100)}>
                  <div className="barfill" style={{ transform: `scaleX(${Math.min(1, Math.max(0, 1 - remaining / total))})` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: ".75rem", flexWrap: "wrap", alignItems: "center", marginTop: ".75rem" }}>
                  <span className="mono">{ready ? "Ready to claim" : `${fmtTime(remaining)} remaining`}</span>
                  <div className="item-actions">
                    <button className="btn ghost" onClick={cancel} disabled={busy !== null}>
                      {busy === "cancel" ? "Cancelling..." : "Cancel"}
                    </button>
                    <button className="btn" onClick={claim} disabled={busy !== null || !ready}>
                      {busy === "claim" ? "Claiming..." : "Claim output"}
                    </button>
                  </div>
                </div>
              </section>
            ) : recipe && duration ? (
              <section className="panel" aria-labelledby="recipe">
                <h2 id="recipe">Production recipe</h2>
                <div className="grid" style={{ gap: ".75rem" }}>
                  <label>
                    <span className="label" style={{ display: "block", marginBottom: ".35rem" }}>Recipe</span>
                    <select className="activity-select" value={recipe.id}
                      onChange={(event) => {
                        setSelectedRecipeId(event.target.value);
                        setSelectedDurationId("1m");
                        requestId.current = null;
                        setError(null);
                      }}>
                      {data.recipes.map((entry) => (
                        <option value={entry.id} key={entry.id}>{entry.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="label" style={{ display: "block", marginBottom: ".35rem" }}>Work time</span>
                    <select className="activity-select" value={duration.id}
                      onChange={(event) => {
                        setSelectedDurationId(event.target.value);
                        requestId.current = null;
                        setError(null);
                      }}>
                      {recipe.durationOptions.map((entry) => (
                        <option value={entry.id} key={entry.id}>{entry.label}</option>
                      ))}
                    </select>
                  </label>

                  <div>
                    <div className="mono" style={{ fontWeight: 600 }}>{recipe.name}</div>
                    <p className="muted" style={{ margin: ".25rem 0 .65rem" }}>{recipe.description}</p>
                    <div className="row">
                      <span>Requires</span>
                      <strong className="mono">{costText(duration.inputs)}</strong>
                    </div>
                    <div className="row">
                      <span>Produces</span>
                      <strong className="mono">{rewardText(duration.reward)}</strong>
                    </div>
                    <div className="row">
                      <span>Skill</span>
                      <strong>{itemName(recipe.skillId)}</strong>
                    </div>
                  </div>

                  {!canAfford && (
                    <p className="muted" style={{ margin: 0, fontSize: ".85rem" }}>
                      Gather more materials or choose a shorter work period.
                    </p>
                  )}
                  <button className="btn" onClick={start} disabled={busy !== null || !canAfford}>
                    {busy === "start" ? "Starting..." : "Start crafting"}
                  </button>
                </div>
              </section>
            ) : (
              <p className="empty">No production recipes are available.</p>
            )}

            <section className="panel" aria-labelledby="materials">
              <h2 id="materials">Available materials</h2>
              {data.inventory.length === 0 ? (
                <p className="empty">No materials yet. Gather resources from the Dashboard first.</p>
              ) : data.inventory.map((item) => (
                <div className="row" key={item.itemId}>
                  <span>{itemName(item.itemId)}</span>
                  <span className="mono">{item.quantity.toLocaleString()}</span>
                </div>
              ))}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
