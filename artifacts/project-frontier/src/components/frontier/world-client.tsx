"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Map as MapIcon, Mountain, Swords } from "lucide-react";
import type { CombatEnemyView, CombatResponse } from "@/game/contracts";
import { PlayerNav } from "./player-nav";
import { GameHeader, RegionArt, ScreenHeading } from "./frontier-ui";

type ApiError = { error?: string };

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`/frontier-api${path}`, { credentials: "include", cache: "no-store" });
  const body = await response.json().catch(() => null) as ApiError | T | null;
  if (!response.ok) throw new Error((body as ApiError | null)?.error ?? `Request failed (${response.status})`);
  return body as T;
}

type RegionView = {
  id: string;
  name: string;
  requiredCombatRating: number;
  enemies: CombatEnemyView[];
};

function regionSummary(regionId: string) {
  switch (regionId) {
    case "pine-verge":
      return "Dense timber, cold rivers and game trails form the first expedition ring beyond the station.";
    case "rust-trail":
      return "A fractured trade road cut through red earth, wreckage and raider territory.";
    case "old-quarry":
      return "Abandoned excavation works descend into stone terraces, machinery and heavier threats.";
    case "ruined-outpost":
      return "A fortified ruin at the frontier edge where veteran enemies guard the route beyond.";
    default:
      return "Uncharted frontier territory.";
  }
}

export function WorldClient({ userId }: { userId: string }) {
  const [data, setData] = useState<CombatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await api<CombatResponse>("/combat");
      if (!alive.current) return;
      setData(next);
      setError(null);
    } catch (err) {
      if (!alive.current) return;
      setError(err instanceof Error ? err.message : "Could not load frontier map.");
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
    return () => {
      alive.current = false;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [load, userId]);

  const regions = useMemo<RegionView[]>(() => {
    if (!data) return [];
    const order: string[] = [];
    const byRegion = new Map<string, RegionView>();

    for (const enemy of data.enemies) {
      if (!byRegion.has(enemy.regionId)) {
        order.push(enemy.regionId);
        byRegion.set(enemy.regionId, {
          id: enemy.regionId,
          name: enemy.regionName,
          requiredCombatRating: enemy.requiredCombatRating,
          enemies: [],
        });
      }
      const region = byRegion.get(enemy.regionId)!;
      region.enemies.push(enemy);
      region.requiredCombatRating = Math.min(region.requiredCombatRating, enemy.requiredCombatRating);
    }
    return order.map((id) => byRegion.get(id)!);
  }, [data]);

  const unlockedCount = data ? regions.filter((region) => data.combatRating >= region.requiredCombatRating).length : 0;
  const nextLocked = data ? regions.find((region) => data.combatRating < region.requiredCombatRating) : undefined;

  return (
    <>
      <GameHeader gold={data?.player.gold} />
      <PlayerNav current="world" />
      <main className="wrap game-screen">
        <ScreenHeading
          eyebrow="Expedition chart"
          title="World Map"
          description="Push outward from the field station. Stronger regions demand a higher combat rating and offer better enemies and loot."
          metric={data && <><span>Regions open</span><strong>{unlockedCount}/{regions.length}</strong></>}
        />

        {error && <div className="alert" role="alert"><span>{error}</span><button className="btn ghost sm" onClick={load}>Retry</button></div>}
        {!data && !error && <div className="grid"><div className="skel" style={{ height: 540 }} /></div>}

        {data && (
          <div className="game-screen-stack">
            <section className="world-overview game-card">
              <div className="world-overview-copy">
                <MapIcon size={28} />
                <div>
                  <div className="eyebrow">Current expedition power</div>
                  <strong>{data.combatRating}</strong>
                  <span>Combat Rating</span>
                </div>
              </div>
              {nextLocked ? (
                <div className="world-next">
                  <span>Next route</span>
                  <strong>{nextLocked.name}</strong>
                  <small>{Math.max(0, nextLocked.requiredCombatRating - data.combatRating)} rating needed</small>
                </div>
              ) : (
                <div className="world-next"><span>Map status</span><strong>All routes open</strong><small>Current frontier chart complete</small></div>
              )}
            </section>

            <section className="frontier-map game-card" aria-label="Frontier region route">
              <div className="frontier-map-header">
                <Mountain size={20} />
                <span>Frontier Route</span>
                <small>Field Station → Ruined Outpost</small>
              </div>

              <div className="frontier-route">
                {regions.map((region, index) => {
                  const unlocked = data.combatRating >= region.requiredCombatRating;
                  return (
                    <article className={unlocked ? "region-stop unlocked" : "region-stop locked"} key={region.id}>
                      {index > 0 && <div className={unlocked ? "route-connector open" : "route-connector"} />}
                      <RegionArt regionId={region.id} name={region.name} />
                      <div className="region-stop-content">
                        <div className="region-stop-topline">
                          <span className="region-number">0{index + 1}</span>
                          <span className={unlocked ? "region-status open" : "region-status"}>
                            {unlocked ? "Accessible" : <><Lock size={12} /> Locked</>}
                          </span>
                        </div>
                        <h2>{region.name}</h2>
                        <p>{regionSummary(region.id)}</p>

                        <div className="region-enemy-list">
                          {region.enemies.map((enemy) => (
                            <div className="region-enemy-chip" key={enemy.id}>
                              <Swords size={15} />
                              <span>{enemy.name}</span>
                              <b>HP {enemy.maxHp}</b>
                            </div>
                          ))}
                        </div>

                        <div className="region-footer">
                          <span>Required rating <strong>{region.requiredCombatRating}</strong></span>
                          {unlocked ? (
                            <Link href="/combat" className="btn gold-btn">Enter Region</Link>
                          ) : (
                            <button className="btn" disabled>Need {region.requiredCombatRating - data.combatRating} rating</button>
                          )}
                        </div>
                      </div>
                    </article>
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
