import Link from "next/link";

export function PlayerNav({ current }: { current: "dashboard" | "inventory" | "skills" | "crafting" | "combat" }) {
  return (
    <nav className="pnav" aria-label="Player">
      <div className="wrap">
        <Link href="/dashboard" aria-current={current === "dashboard" ? "page" : undefined}>Dashboard</Link>
        <Link href="/inventory" aria-current={current === "inventory" ? "page" : undefined}>Inventory &amp; Equipment</Link>
        <Link href="/skills" aria-current={current === "skills" ? "page" : undefined}>Skills</Link>
        <Link href="/crafting" aria-current={current === "crafting" ? "page" : undefined}>Workshop</Link>\n        <Link href="/combat" aria-current={current === "combat" ? "page" : undefined}>Training</Link>
      </div>
    </nav>
  );
}
