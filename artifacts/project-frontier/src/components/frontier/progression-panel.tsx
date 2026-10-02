import { MAX_CHARACTER_LEVEL, type Progression } from "@/game/progression";

export function ProgressionPanel({ progression }: { progression: Progression }) {
  const atCap = progression.level >= MAX_CHARACTER_LEVEL;
  const percent = atCap || progression.xpForNextLevel <= 0
    ? 100
    : (progression.xpIntoLevel / progression.xpForNextLevel) * 100;

  return (
    <section className="panel" aria-label="Player progression">
      <h2>Progression</h2>
      <div className="stat">Level {progression.level}</div>
      <div className="bartrack" style={{ marginTop: ".85rem" }}
        role="progressbar"
        aria-label={atCap ? "Maximum character level reached" : `XP progress to level ${progression.level + 1}`}
        aria-valuemin={0}
        aria-valuemax={atCap ? 100 : progression.xpForNextLevel}
        aria-valuenow={atCap ? 100 : progression.xpIntoLevel}
        aria-valuetext={atCap ? "Maximum character level reached" : `${progression.xpRemaining} XP to level ${progression.level + 1}`}>
        <div className="barfill" style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
      <p className="mono muted" style={{ fontSize: ".8rem", margin: ".5rem 0 0" }}>
        {atCap ? "MAX LEVEL" : (
          <>
            {progression.xpIntoLevel.toLocaleString()} / {progression.xpForNextLevel.toLocaleString()} XP
            {" · "}Level {progression.level + 1} in {progression.xpRemaining.toLocaleString()} XP
          </>
        )}
      </p>
      <p className="muted" style={{ fontSize: ".78rem", margin: ".2rem 0 0" }}>
        {progression.totalXp.toLocaleString()} lifetime XP · Earned by claiming activity rewards
      </p>
    </section>
  );
}
