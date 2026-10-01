import type { Progression } from "@/game/progression";

export function ProgressionPanel({ progression }: { progression: Progression }) {
  const percent = (progression.xpIntoLevel / progression.xpForNextLevel) * 100;
  return (
    <section className="panel" aria-label="Player progression">
      <h2>Progression</h2>
      <div className="stat">Level {progression.level}</div>
      <div className="bartrack" style={{ marginTop: ".85rem" }}
        role="progressbar" aria-label={`XP progress to level ${progression.level + 1}`}
        aria-valuemin={0} aria-valuemax={progression.xpForNextLevel}
        aria-valuenow={progression.xpIntoLevel}
        aria-valuetext={`${progression.xpRemaining} XP to level ${progression.level + 1}`}>
        <div className="barfill" style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
      <p className="mono muted" style={{ fontSize: ".8rem", margin: ".5rem 0 0" }}>
        {progression.xpIntoLevel.toLocaleString()} / {progression.xpForNextLevel.toLocaleString()} XP
        {" · "}Level {progression.level + 1} in {progression.xpRemaining.toLocaleString()} XP
      </p>
      <p className="muted" style={{ fontSize: ".78rem", margin: ".2rem 0 0" }}>
        {progression.totalXp.toLocaleString()} lifetime XP · Earned by claiming gathering rewards
      </p>
    </section>
  );
}