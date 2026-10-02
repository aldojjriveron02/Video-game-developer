"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Hammer, Swords } from "lucide-react";
import type { SkillView, SkillsResponse } from "@/game/contracts";
import { MAX_CHARACTER_LEVEL } from "@/game/progression";
import { PlayerNav } from "./player-nav";
import { GameHeader, ScreenHeading, SkillGlyph } from "./frontier-ui";

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
    throw new ApiFail((body && body.error) || `Request failed (${response.status})`, response.status);
  }
  if (!body || !Array.isArray(body.skills) || !body.player) {
    throw new ApiFail("The station returned an invalid skills response.", 502);
  }
  return body as SkillsResponse;
}

const categoryMeta = {
  combat: { label: "Combat", icon: Swords, copy: "Power, defense, accuracy, movement, resilience and battlefield judgment." },
  gathering: { label: "Gathering", icon: Activity, copy: "Resource skills improve while you work the frontier." },
  production: { label: "Production", icon: Hammer, copy: "Workshop disciplines turn raw materials into useful stock." },
} as const;

function SkillTile({ skill }: { skill: SkillView }) {
  const atCap = skill.level >= MAX_CHARACTER_LEVEL;
  const percent = atCap || skill.xpForNextLevel <= 0 ? 100 : Math.min(100, (skill.xpIntoLevel / skill.xpForNextLevel) * 100);

  return (
    <article className="skill-tile">
      <div className="skill-tile-top">
        <div className="skill-glyph"><SkillGlyph id={skill.id} size={27} /></div>
        <div className="skill-level">
          <small>Level</small>
          <strong>{skill.level}</strong>
        </div>
      </div>
      <h3>{skill.name}</h3>
      <p>{skill.description}</p>
      <div className="bartrack">
        <div className="barfill" style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
      <div className="skill-xp">
        <span>{atCap ? "MAX LEVEL" : `${skill.xpIntoLevel.toLocaleString()} / ${skill.xpForNextLevel.toLocaleString()} XP`}</span>
        <strong>{skill.totalXp.toLocaleString()} total</strong>
      </div>
    </article>
  );
}

export function SkillsClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [data, setData] = useState<SkillsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<"combat" | "gathering" | "production">("combat");
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
    return () => { alive.current = false; };
  }, [load, userId]);

  const current = categoryMeta[category];
  const CurrentIcon = current.icon;
  const visible = data?.skills.filter((skill) => skill.category === category) ?? [];
  const totalLevels = visible.reduce((sum, skill) => sum + skill.level, 0);

  return (
    <>
      <GameHeader gold={data?.player.gold} />
      <PlayerNav current="skills" />
      <main className="wrap game-screen">
        <ScreenHeading
          eyebrow="Operator development"
          title="Skills"
          description="Every frontier activity strengthens a discipline. Combat, gathering and production all progress independently."
          metric={data && <><span>Character XP</span><strong>{data.player.xp.toLocaleString()}</strong></>}
        />

        <div className="skill-category-tabs">
          {(Object.keys(categoryMeta) as (keyof typeof categoryMeta)[]).map((key) => {
            const MetaIcon = categoryMeta[key].icon;
            return (
              <button
                key={key}
                className={category === key ? "skill-category-tab active" : "skill-category-tab"}
                onClick={() => setCategory(key)}
              >
                <MetaIcon size={19} />
                <span>{categoryMeta[key].label}</span>
              </button>
            );
          })}
        </div>

        {error && <div className="alert" role="alert"><span>{error}</span><button className="btn ghost sm" onClick={load}>Retry</button></div>}
        {!data && !error && <div className="grid"><div className="skel" style={{ height: 410 }} /></div>}

        {data && (
          <div className="game-screen-stack">
            <section className="skill-category-hero game-card">
              <div className="skill-category-icon"><CurrentIcon size={38} /></div>
              <div>
                <div className="eyebrow">{current.label} skills</div>
                <h2>{current.label}</h2>
                <p>{current.copy}</p>
              </div>
              <div className="skill-category-total">
                <small>Total levels</small>
                <strong>{totalLevels}</strong>
              </div>
            </section>

            <section className="skill-grid">
              {visible.map((skill) => <SkillTile key={skill.id} skill={skill} />)}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
