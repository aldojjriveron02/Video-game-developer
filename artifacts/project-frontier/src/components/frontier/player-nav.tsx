import Link from "next/link";

export function PlayerNav({ current }: { current: "dashboard" | "inventory" | "skills" | "crafting" }) {
  return (
    <nav className="pnav" aria-label="Player">
      <div className="wrap">
        <Link href="/dashboard" aria-current={current === "dashboard" ? "page" : undefined}>Dashboard</Link>
        <Link href="/inventory" aria-current={current === "inventory" ? "page" : undefined}>Inventory &amp; Equipment</Link>
        <Link href="/skills" aria-current={current === "skills" ? "page" : undefined}>Skills</Link>
        <Link href="/crafting" aria-current={current === "crafting" ? "page" : undefined}>Workshop</Link>
      </div>
    </nav>
  );
}
