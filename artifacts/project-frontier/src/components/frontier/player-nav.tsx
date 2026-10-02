import Link from "next/link";
import {
  Backpack,
  BarChart3,
  Hammer,
  Home,
  Map,
  ScrollText,
  Swords,
  Trees,
} from "lucide-react";

type PlayerSection =
  | "dashboard"
  | "inventory"
  | "skills"
  | "crafting"
  | "combat"
  | "world"
  | "quests"
  | "gathering";

const desktopItems = [
  { id: "dashboard", href: "/dashboard", label: "Home", Icon: Home },
  { id: "gathering", href: "/gathering", label: "Gathering", Icon: Trees },
  { id: "quests", href: "/quests", label: "Quests", Icon: ScrollText },
  { id: "world", href: "/world", label: "World", Icon: Map },
  { id: "combat", href: "/combat", label: "Combat", Icon: Swords },
  { id: "skills", href: "/skills", label: "Skills", Icon: BarChart3 },
  { id: "crafting", href: "/crafting", label: "Workshop", Icon: Hammer },
  { id: "inventory", href: "/inventory", label: "Inventory", Icon: Backpack },
] as const;

const mobileItems = [
  { id: "dashboard", href: "/dashboard", label: "Home", Icon: Home },
  { id: "quests", href: "/quests", label: "Quests", Icon: ScrollText },
  { id: "combat", href: "/combat", label: "Combat", Icon: Swords },
  { id: "inventory", href: "/inventory", label: "Inventory", Icon: Backpack },
  { id: "world", href: "/world", label: "Map", Icon: Map },
] as const;

export function PlayerNav({ current }: { current: PlayerSection }) {
  return (
    <>
      <nav className="pnav desktop-pnav" aria-label="Player">
        <div className="wrap">
          {desktopItems.map(({ id, href, label, Icon }) => (
            <Link href={href} key={id} aria-current={current === id ? "page" : undefined}>
              <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <nav className="mobile-bottom-nav" aria-label="Mobile player navigation">
        {mobileItems.map(({ id, href, label, Icon }) => (
          <Link href={href} key={id} aria-current={current === id ? "page" : undefined}>
            <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
