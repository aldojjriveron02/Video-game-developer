"use client";

import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  Anvil,
  Backpack,
  Coins,
  Fish,
  Gem,
  Hammer,
  HeartPulse,
  Leaf,
  Pickaxe,
  Shield,
  Shirt,
  Sparkles,
  Sprout,
  Sword,
  Swords,
  Target,
  TreePine,
  WandSparkles,
} from "lucide-react";
import { Brand } from "./brand";

export function GameHeader({ gold }: { gold?: number }) {
  return (
    <header className="bar game-header">
      <div className="wrap">
        <Brand />
        <div className="header-resources">
          {typeof gold === "number" && (
            <span className="resource-chip">
              <Coins size={16} aria-hidden="true" />
              {gold.toLocaleString()}
            </span>
          )}
        </div>
        <UserButton />
      </div>
    </header>
  );
}

export function ScreenHeading({
  eyebrow,
  title,
  description,
  metric,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  metric?: ReactNode;
}) {
  return (
    <div className="screen-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {metric && <div className="screen-heading-metric">{metric}</div>}
    </div>
  );
}

export function ItemGlyph({ id, size = 24 }: { id: string; size?: number }) {
  const props = { size, strokeWidth: 1.7, "aria-hidden": true as const };
  if (id.includes("wood") || id.includes("lumber")) return <TreePine {...props} />;
  if (id.includes("stone") || id.includes("ore") || id.includes("ingot")) return <Gem {...props} />;
  if (id.includes("fish")) return <Fish {...props} />;
  if (id.includes("hide") || id.includes("leather") || id.includes("coat") || id.includes("vest")) return <Shirt {...props} />;
  if (id.includes("herb") || id.includes("berries") || id.includes("fiber")) return <Leaf {...props} />;
  if (id.includes("tonic")) return <WandSparkles {...props} />;
  if (id.includes("axe")) return <Pickaxe {...props} />;
  if (id.includes("knife") || id.includes("saber")) return <Sword {...props} />;
  if (id.includes("helm") || id.includes("hood")) return <Shield {...props} />;
  if (id.includes("cloth")) return <Sparkles {...props} />;
  if (id.includes("training")) return <Target {...props} />;
  return <Backpack {...props} />;
}

export function SkillGlyph({ id, size = 22 }: { id: string; size?: number }) {
  const props = { size, strokeWidth: 1.7, "aria-hidden": true as const };
  if (id === "strength") return <Swords {...props} />;
  if (id === "defense") return <Shield {...props} />;
  if (id === "dexterity") return <Target {...props} />;
  if (id === "agility") return <Sparkles {...props} />;
  if (id === "vitality") return <HeartPulse {...props} />;
  if (id === "tactics") return <Sword {...props} />;
  if (id === "mining") return <Pickaxe {...props} />;
  if (id === "woodcutting") return <TreePine {...props} />;
  if (id === "fishing") return <Fish {...props} />;
  if (id === "hunting") return <Target {...props} />;
  if (id === "herbalism") return <Leaf {...props} />;
  if (id === "foraging") return <Sprout {...props} />;
  if (id === "blacksmithing") return <Anvil {...props} />;
  if (id === "cooking") return <Sparkles {...props} />;
  if (id === "alchemy") return <WandSparkles {...props} />;
  if (id === "carpentry") return <Hammer {...props} />;
  if (id === "leatherworking") return <Shirt {...props} />;
  return <Sparkles {...props} />;
}


export function OperatorPortrait({ name }: { name: string }) {
  return (
    <div className="operator-portrait" aria-label={name}>
      <svg viewBox="0 0 360 420" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="portrait-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#23445f" />
            <stop offset="55%" stopColor="#122538" />
            <stop offset="100%" stopColor="#08121d" />
          </linearGradient>
          <linearGradient id="portrait-armor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#70513a" />
            <stop offset="45%" stopColor="#2d3944" />
            <stop offset="100%" stopColor="#101923" />
          </linearGradient>
          <linearGradient id="portrait-scarf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34577b" />
            <stop offset="100%" stopColor="#14283d" />
          </linearGradient>
        </defs>
        <rect width="360" height="420" fill="url(#portrait-sky)" />
        <circle cx="286" cy="78" r="34" fill="#d9a65e" opacity=".55" />
        <path d="M0 215 76 133l58 62 63-104 70 105 54-76 39 58v242H0Z" fill="#0c1a27" opacity=".9" />
        <path d="M0 267 71 214l54 38 77-72 64 61 94-70v249H0Z" fill="#142332" />
        <g fill="#09131d">
          <path d="M24 304 42 242l18 62H50l14 35H20l13-35Z" />
          <path d="M297 310 314 249l18 61h-10l14 36h-43l13-36Z" />
        </g>
        <g transform="translate(80 58)">
          <path d="M86 22c27 0 48 22 48 51 0 15-5 31-14 42-8 10-18 16-34 16s-27-6-35-17c-8-11-13-26-13-41 0-29 21-51 48-51Z" fill="#a97859" />
          <path d="M39 67c2-33 22-56 52-56 20 0 39 12 48 32-15-7-32-8-47-4-19 5-30 18-39 35-5-1-10-3-14-7Z" fill="#2b211e" />
          <path d="M49 86c9 5 18 6 28 5 19-1 33-10 44-25 1 17-2 34-11 46-8 11-17 17-30 18-15 0-25-7-32-18-6-9-9-17-9-26 3 0 7 0 10 0Z" fill="#9b684d" />
          <path d="M62 103c7 9 17 13 30 12 11-1 21-5 28-12-4 14-15 28-31 29-15 1-26-11-27-29Z" fill="#4a3027" />
          <path d="M48 127c11 12 24 18 40 18s31-6 43-18l20 28-18 37H43l-18-37 23-28Z" fill="url(#portrait-scarf)" />
          <path d="M14 178c17-22 41-34 71-34 34 0 61 12 82 37l25 132H-11l25-135Z" fill="url(#portrait-armor)" />
          <path d="M52 158 84 181l35-23 17 28-52 35-49-34 17-29Z" fill="#1c2f42" />
          <path d="M22 188 4 281l35 5 25-111-42 13Z" fill="#273440" />
          <path d="m157 188 18 93-34 7-27-113 43 13Z" fill="#273440" />
          <path d="M52 221h67l17 92H35l17-92Z" fill="#222d36" />
          <path d="M66 220v94M104 220v94" stroke="#8a633d" strokeWidth="5" opacity=".8" />
          <circle cx="67" cy="77" r="3" fill="#161616" />
          <circle cx="104" cy="77" r="3" fill="#161616" />
        </g>
      </svg>
      <div className="operator-portrait-shade" />
      <div className="operator-portrait-name">{name}</div>
    </div>
  );
}

export function RegionArt({
  regionId,
  name,
  compact = false,
}: {
  regionId: string;
  name: string;
  compact?: boolean;
}) {
  const palette: Record<string, [string, string, string, string]> = {
    "pine-verge": ["#0b3144", "#1b6149", "#c99851", "#9ac7c9"],
    "rust-trail": ["#2d1b1b", "#733d2c", "#b7733f", "#657b88"],
    "old-quarry": ["#17212d", "#4c5660", "#bb7538", "#73889a"],
    "ruined-outpost": ["#101927", "#2d3d51", "#a35d36", "#5c7a94"],
  };
  const [sky, land, glow, water] = palette[regionId] ?? palette["pine-verge"];

  return (
    <div className={compact ? "region-art compact" : "region-art"} aria-label={name}>
      <svg viewBox="0 0 640 260" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`sky-${regionId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky} />
            <stop offset="100%" stopColor="#07111f" />
          </linearGradient>
          <linearGradient id={`land-${regionId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={land} />
            <stop offset="100%" stopColor="#071018" />
          </linearGradient>
          <linearGradient id={`water-${regionId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={water} stopOpacity=".2" />
            <stop offset="50%" stopColor={water} stopOpacity=".8" />
            <stop offset="100%" stopColor={water} stopOpacity=".15" />
          </linearGradient>
        </defs>
        <rect width="640" height="260" fill={`url(#sky-${regionId})`} />
        <circle cx="500" cy="62" r="30" fill={glow} opacity=".7" />
        <path d="M0 146 L90 80 L150 131 L230 48 L310 129 L390 62 L480 132 L555 70 L640 134 L640 260 L0 260 Z" fill="#0d2130" opacity=".9" />
        <path d="M0 169 L100 115 L174 169 L267 99 L350 161 L457 105 L530 157 L640 111 L640 260 L0 260 Z" fill={`url(#land-${regionId})`} />
        <path d="M262 260 C290 212 325 205 349 180 C370 158 369 131 392 110 C364 149 390 168 420 181 C451 196 487 206 528 260 Z" fill={`url(#water-${regionId})`} />
        <g fill="#0a1721" opacity=".95">
          <path d="M56 206 l18-60 18 60h-11l13 32H52l13-32z" />
          <path d="M112 214 l13-48 13 48h-8l10 25h-31l10-25z" />
          <path d="M507 206 l17-62 17 62h-10l12 32h-39l12-32z" />
          <path d="M566 218 l12-45 12 45h-7l8 21h-27l8-21z" />
        </g>
        {regionId === "rust-trail" && (
          <g stroke="#8b5639" strokeWidth="8" fill="none" opacity=".9">
            <path d="M206 260 C246 224 280 215 324 205 C371 195 414 176 456 142" />
          </g>
        )}
        {regionId === "old-quarry" && (
          <g fill="#1a2027" opacity=".95">
            <rect x="408" y="137" width="96" height="58" />
            <rect x="443" y="96" width="18" height="42" />
            <path d="M377 173 l31-51 12 7-29 52z" />
          </g>
        )}
        {regionId === "ruined-outpost" && (
          <g fill="#10161e" opacity=".95">
            <rect x="390" y="112" width="122" height="81" />
            <rect x="405" y="85" width="28" height="30" />
            <rect x="470" y="73" width="25" height="42" />
            <path d="M388 112 l21-20 25 20zM465 112 l18-27 22 27z" />
          </g>
        )}
      </svg>
      <div className="region-art-shade" />
      <div className="region-art-label">{name}</div>
    </div>
  );
}

export function EnemyPortrait({
  enemyId,
  name,
  regionId,
}: {
  enemyId: string;
  name: string;
  regionId: string;
}) {
  const isBeast = enemyId.includes("wolf") || enemyId.includes("boar");
  const isBrute = enemyId.includes("brute");
  const isWarden = enemyId.includes("warden");
  return (
    <div className={`enemy-portrait enemy-${regionId}`} aria-label={name}>
      <div className="enemy-portrait-bg" />
      <div className="enemy-silhouette" aria-hidden="true">
        {isBeast ? "◆" : isBrute ? "⬢" : isWarden ? "♜" : "♞"}
      </div>
      <div className="enemy-portrait-name">{name}</div>
    </div>
  );
}
