"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import type { SkillView, SkillsResponse } from "@/game/contracts";
import { MAX_CHARACTER_LEVEL } from "@/game/progression";
import { Brand } from "./brand";
import { PlayerNav } from "./player-nav";

class ApiFail extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function api(): Promise<SkillsResponse> {
  const response = await fetch("/frontier-api/skills", {
    credentials: "include",
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiFail(
      (body && body.error) || `Request failed (${response.status})`,
      response.status,
    );
  }
  if (!body || !Array.isArray(body.skills) || !body.player) {
    throw new ApiFail("The station returned an invalid skills response.", 502);
  }
  return body as SkillsResponse;
}

const categoryLabel = {
  combat: "Combat",
  gathering: "Gathering",
  production: "Production",
} as const;

function SkillRow({ skill }: { skill: SkillView }) {
  const atCap = skill.level >= MAX_CHARACTER_LEVEL;
  const percent = atCap || skill.xpForNextLevel <= 0
    ? 100
    : Math.min(100, (skill.xpIntoLevel / skill.xpForNextLevel) * 100);

  return (
    <div className="item">
      <div className="item-head">
        <div>
          <strong>{skill.name}</strong>{" "}
          <span className="tag">Level {skill.level}</span>
        </div>
        <span className="mono muted" style={{ fontSize: ".78rem" }}>
          {skill.totalXp.toLocaleString()} XP
        </span>
      </div>
      <p className="muted" style={{ margin: ".4rem 0 .55rem", fontSize: ".82rem" }}>
        {skill.description}
      </p>
      <div
        className="bartrack"
        role="progressbar"
        aria-label={atCap ? `${skill.name} maximum level` : `${skill.name} progress to level ${skill.level + 1}`}
        aria-valuemin={0}
        aria-valuemax={atCap ? 100 : skill.xpForNextLevel}
        aria-valuenow={atCap ? 100 : skill.xpIntoLevel}
      >
        <div className="barfill" style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
      <p className="mono muted" style={{ margin: ".4rem 0 0", fontSize: ".75rem" }}>
        {atCap
          ? "MAX LEVEL"
          : `${skill.xpIntoLevel.toLocaleString()} / ${skill.xpForNextLevel.toLocaleString()} XP · ${skill.xpRemaining.toLocaleString()} remaining`}
      </p>
    </div>
  );
}

export function SkillsClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [data, setData] = useState<SkillsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await api();
      if (!alive.current) return;
      setData(next);
      setError(null);
    } catch (err) {
      if (!alive.current) return;
      if (err instanceof ApiFail && err.status === 401) {
        router.replace("/sign-in");
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load skills.");
    }
  }, [router]);

  useEffect(() => {
    alive.current = true;
    setData(null);
    setError(null);
    load();
    return () => {
      alive.current = false;
    };
  }, [load, userId]);

  return (
    <>
      <header className="bar">
        <div className="wrap"><Brand /><UserButton /></div>
      </header>
      <PlayerNav current="skills" />
      <main className="wrap" style={{ padding: "1.5rem 1.25rem 4rem" }}>
        <h1 className="mono" style={{ margin: "0 0 .4rem", fontSize: "1.5rem" }}>Skills</h1>
        <p className="muted" style={{ margin: "0 0 1rem" }}>
          Skills improve through the activities that use them. Training builds combat skills, gathering trains resource skills, and workshop recipes train production skills.
        </p>

        {error && (
          <div className="alert" role="alert" style={{ marginBottom: "1rem" }}>
            <span>{error}</span>
            <button className="btn ghost" onClick={load}>Retry</button>
          </div>
        )}

        {!data && !error && (
          <div className="grid" role="status" aria-label="Loading skills">
            <div className="skel" style={{ height: 150 }} />
            <div className="skel" style={{ height: 150 }} />
          </div>
        )}

        {data && (
          <div className="grid">
            <p className="mono muted" style={{ margin: 0, fontSize: ".85rem" }}>
              {data.player.displayName} · Character XP {data.player.xp.toLocaleString()}
            </p>
            {(["combat", "gathering", "production"] as const).map((category) => (
              <section className="panel" key={category} aria-labelledby={`skills-${category}`}>
                <h2 id={`skills-${category}`}>{categoryLabel[category]}</h2>
                <div className="grid two">
                  {data.skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => <SkillRow key={skill.id} skill={skill} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
