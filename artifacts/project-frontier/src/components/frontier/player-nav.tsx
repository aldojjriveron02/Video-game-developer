import Link from "next/link";

export function PlayerNav({ current }: { current: "dashboard" | "inventory" | "skills" | "crafting" | "combat" | "world" | "quests" }) {
  return (
    <nav className="pnav" aria-label="Player">
      <div className="wrap">
        <Link href="/dashboard" aria-current={current === "dashboard" ? "page" : undefined}>Dashboard</Link>
        <Link href="/inventory" aria-current={current === "inventory" ? "page" : undefined}>Inventory &amp; Equipment</Link>
        <Link href="/skills" aria-current={current === "skills" ? "page" : undefined}>Skills</Link>
        <Link href="/crafting" aria-current={current === "crafting" ? "page" : undefined}>Workshop</Link>
        <Link href="/combat" aria-current={current === "combat" ? "page" : undefined}>Combat</Link>
        <Link href="/world" aria-current={current === "world" ? "page" : undefined}>World</Link>
        <Link href="/quests" aria-current={current === "quests" ? "page" : undefined}>Quests</Link>
      </div>
    </nav>
  );
}
