"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type { CombatEnemyView, CombatResponse } from "@/game/contracts";
import { Brand } from "./brand";
import { PlayerNav } from "./player-nav";

type ApiError = { error?: string };

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`/frontier-api${path}`, {
    credentials: "include",
    cache: "no-store",
  });
  const body = await response.json().catch(() => null) as ApiError | T | null;
  if (!response.ok) {
    throw new Error((body as ApiError | null)?.error ?? `Request failed (${response.status})`);
  }
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
      return "The first ring beyond the station: dense timber, game trails and aggressive wildlife.";
    case "rust-trail":
      return "A broken trade route controlled by armed scavengers and raiders.";
    case "old-quarry":
      return "Abandoned excavation works where heavier threats guard valuable material routes.";
    case "ruined-outpost":
      return "A fortified ruin at the edge of known territory. Only seasoned operators reach it.";
    default:
      return "Uncharted frontier territory.";
  }
}

function regionCode(index: number) {
  return `R-${String(index + 1).padStart(2, "0")}`;
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
    const refresh = () => {
      if (document.visibilityState === "visible") load();
    };
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

  const unlockedCount = data
    ? regions.filter((region) => data.combatRating >= region.requiredCombatRating).length
    : 0;
  const nextLocked = data
    ? regions.find((region) => data.combatRating < region.requiredCombatRating)
    : undefined;

  return (
    <>
      <header className="bar">
        <div className="wrap"><Brand /><UserButton /></div>
      </header>
      <PlayerNav current="world" />

      <main className="wrap" style={{ padding: "1.5rem 1.25rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div>
            <p className="label" style={{ marginBottom: ".3rem" }}>Frontier operations map</p>
            <h1 className="mono" style={{ margin: 0, fontSize: "1.65rem" }}>World</h1>
          </div>
          {data && (
            <div className="mono muted" style={{ fontSize: ".82rem", textAlign: "right" }}>
              Combat rating {data.combatRating}
              <br />
              Regions open {unlockedCount} / {regions.length}
            </div>
          )}
        </div>

        {error && (
          <div className="alert" role="alert" style={{ marginBottom: "1rem" }}>
            <span>{error}</span>
            <button className="btn ghost sm" onClick={load}>Retry</button>
          </div>
        )}

        {!data && !error && (
          <div className="grid" role="status" aria-label="Loading frontier map">
            <div className="skel" style={{ height: 150 }} />
            <div className="skel" style={{ height: 180 }} />
            <div className="skel" style={{ height: 180 }} />
          </div>
        )}

        {data && (
          <div className="grid">
            <section className="panel">
              <h2>Expedition status</h2>
              <div className="grid two">
                <div>
                  <div className="stat">{data.combatRating}</div>
                  <p className="muted" style={{ margin: ".25rem 0 0", fontSize: ".82rem" }}>Current combat rating</p>
                </div>
                <div>
                  <div className="stat">{unlockedCount}/{regions.length}</div>
                  <p className="muted" style={{ margin: ".25rem 0 0", fontSize: ".82rem" }}>Regions accessible</p>
                </div>
              </div>
              {nextLocked ? (
                <p className="mono muted" style={{ margin: "1rem 0 0", fontSize: ".8rem" }}>
                  Next region: {nextLocked.name} · rating {nextLocked.requiredCombatRating}
                  {" · "}
                  {Math.max(0, nextLocked.requiredCombatRating - data.combatRating)} rating remaining
                </p>
              ) : (
                <p className="mono muted" style={{ margin: "1rem 0 0", fontSize: ".8rem" }}>
                  All mapped regions are currently accessible.
                </p>
              )}
            </section>

            <section className="world-map" aria-label="Frontier region route">
              {regions.map((region, index) => {
                const unlocked = data.combatRating >= region.requiredCombatRating;
                const completed = index < unlockedCount - 1;
                return (
                  <div className="world-node-wrap" key={region.id}>
                    {index > 0 && <div className={unlocked ? "world-line open" : "world-line"} aria-hidden="true" />}
                    <article className={unlocked ? "world-node open" : "world-node locked"}>
                      <div className="world-node-head">
                        <div>
                          <span className="tag">{regionCode(index)}</span>{" "}
                          <span className={unlocked ? "tag on" : "tag"}>
                            {unlocked ? (completed ? "Cleared route" : "Accessible") : "Locked"}
                          </span>
                        </div>
                        <span className="mono muted" style={{ fontSize: ".76rem" }}>
                          Rating {region.requiredCombatRating}
                        </span>
                      </div>

                      <h2 className="mono" style={{ margin: ".65rem 0 .25rem", fontSize: "1.2rem" }}>{region.name}</h2>
                      <p className="muted" style={{ margin: "0 0 .8rem", fontSize: ".88rem" }}>
                        {regionSummary(region.id)}
                      </p>

                      <div className="grid two" style={{ gap: ".55rem" }}>
                        {region.enemies.map((enemy) => (
                          <div className="world-enemy" key={enemy.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: ".5rem", alignItems: "center" }}>
                              <strong>{enemy.name}</strong>
                              <span className="tag">HP {enemy.maxHp}</span>
                            </div>
                            <p className="mono muted" style={{ margin: ".25rem 0 0", fontSize: ".72rem" }}>
                              ATK {enemy.attack} · DEF {enemy.defense}
                              {enemy.equipmentDrop ? ` · Gear ${Math.round(enemy.equipmentDrop.chance * 100)}%` : ""}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: ".9rem" }}>
                        {unlocked ? (
                          <Link href="/combat" className="btn">Enter region combat</Link>
                        ) : (
                          <button className="btn" disabled>
                            Locked · need {region.requiredCombatRating - data.combatRating} rating
                          </button>
                        )}
                      </div>
                    </article>
                  </div>
                );
              })}
            </section>

            <section className="panel">
              <h2>How exploration works</h2>
              <p className="muted" style={{ margin: 0 }}>
                Training and equipped gear raise your combat rating. Higher rating opens deeper frontier regions,
                where stronger enemies provide more gold, XP, materials and better equipment drops.
              </p>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
