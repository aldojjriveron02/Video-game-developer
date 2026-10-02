"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Backpack, Shield, Shirt, Sword } from "lucide-react";
import type { InventoryView } from "@/game/equipment";
import type { EquipmentSlot } from "@/content/items";
import { PlayerNav } from "./player-nav";
import { GameHeader, ItemGlyph, ScreenHeading } from "./frontier-ui";

class ApiFail extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function api(path: string, init?: RequestInit): Promise<InventoryView> {
  const response = await fetch(`/frontier-api${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiFail((body && body.error) || `Request failed (${response.status})`, response.status);
  if (!body || !Array.isArray(body.equipment) || !Array.isArray(body.resources) || !Array.isArray(body.slots)) {
    throw new ApiFail("The station returned an invalid inventory response.", 502);
  }
  return body as InventoryView;
}

type Notice = { ok: boolean; text: string };

function bonusText(bonuses: object) {
  const parts = Object.entries(bonuses)
    .filter(([, value]) => typeof value === "number" && value > 0)
    .map(([key, value]) => `+${value} ${key.charAt(0).toUpperCase() + key.slice(1)}`);
  return parts.length ? parts.join(" · ") : "No combat bonuses";
}

function slotIcon(slot: EquipmentSlot) {
  if (slot === "hand") return <Sword size={22} />;
  if (slot === "body") return <Shirt size={22} />;
  return <Shield size={22} />;
}

export function InventoryClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [data, setData] = useState<InventoryView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [view, setView] = useState<"equipment" | "inventory">("equipment");
  const [selectedGearId, setSelectedGearId] = useState<string | null>(null);
  const alive = useRef(true);
  const seq = useRef(0);

  const fail = useCallback((error: unknown) => {
    if (error instanceof ApiFail && error.status === 401) {
      setData(null);
      router.replace("/sign-in");
      return null;
    }
    return error instanceof Error ? error.message : "Could not reach the station.";
  }, [router]);

  const load = useCallback(async () => {
    const mine = ++seq.current;
    try {
      const next = await api("/inventory");
      if (!alive.current || mine !== seq.current) return;
      setData(next);
      setSelectedGearId((current) => current ?? next.equipment[0]?.id ?? null);
      setLoadError(null);
    } catch (error) {
      if (!alive.current || mine !== seq.current) return;
      const message = fail(error);
      if (message) setLoadError(message);
    }
  }, [fail]);

  useEffect(() => {
    alive.current = true;
    setData(null);
    setNotice(null);
    setSelectedGearId(null);
    setLoadError(null);
    load();
    return () => { alive.current = false; };
  }, [load, userId]);

  async function write(key: string, path: string, init: RequestInit, success: string, failure: string) {
    setBusy(key);
    setNotice(null);
    ++seq.current;
    try {
      const next = await api(path, init);
      if (!alive.current) return;
      ++seq.current;
      setData(next);
      setLoadError(null);
      setNotice({ ok: true, text: success });
    } catch (error) {
      if (!alive.current) return;
      const message = fail(error);
      if (message) {
        setNotice({ ok: false, text: `${failure} ${message}` });
        load();
      }
    } finally {
      if (alive.current) setBusy(null);
    }
  }

  const equip = (id: string, name: string, slot: EquipmentSlot, label: string) =>
    write(
      `eq-${id}`,
      `/equipment/${slot}`,
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ instanceId: id }) },
      `${name} equipped to ${label}.`,
      `${name}'s equipment change could not be confirmed.`,
    );

  const unequip = (slot: EquipmentSlot, label: string, name: string) =>
    write(
      `un-${slot}`,
      `/equipment/${slot}`,
      { method: "DELETE" },
      `${name} removed from ${label}.`,
      `${name}'s equipment change could not be confirmed.`,
    );

  const locked = busy !== null;
  const equipped = useMemo(() => {
    if (!data) return new Map();
    return new Map(data.equipment.filter((item) => item.equippedSlot).map((item) => [item.equippedSlot!, item]));
  }, [data]);
  const selectedGear = data?.equipment.find((item) => item.id === selectedGearId) ?? data?.equipment[0] ?? null;

  return (
    <>
      <GameHeader gold={data?.player.gold} />
      <PlayerNav current="inventory" />

      <main className="wrap game-screen" aria-busy={!data && !loadError}>
        <ScreenHeading
          eyebrow="Loadout & supplies"
          title="Inventory"
          description="Equip your operator and inspect the materials collected across the frontier."
          metric={data && <><span>Level</span><strong>{data.progression.level}</strong></>}
        />

        <div className="screen-tabs">
          <button className={view === "equipment" ? "screen-tab active" : "screen-tab"} onClick={() => setView("equipment")}>
            <Shield size={18} /> Equipment
          </button>
          <button className={view === "inventory" ? "screen-tab active" : "screen-tab"} onClick={() => setView("inventory")}>
            <Backpack size={18} /> Inventory
          </button>
        </div>

        {loadError && <div className="alert" role="alert"><span>{data ? "Showing last known state. " : ""}{loadError}</span><button className="btn ghost sm" onClick={load} disabled={locked}>Retry</button></div>}
        {notice && <div className={notice.ok ? "reward-notice" : "alert"} role={notice.ok ? "status" : "alert"}><span>{notice.text}</span><button className="btn ghost sm" onClick={() => setNotice(null)}>Dismiss</button></div>}
        {!data && !loadError && <div className="grid"><div className="skel" style={{ height: 390 }} /><div className="skel" style={{ height: 260 }} /></div>}

        {data && view === "equipment" && (
          <div className="game-screen-stack">
            <section className="equipment-stage game-card">
              <div className="section-banner">
                <Shield size={20} />
                <span>Operator Loadout</span>
                <small>3 equipment slots</small>
              </div>

              <div className="equipment-stage-body">
                <div className="equipment-slots-column left">
                  {data.slots.filter((slot) => slot.slot === "head" || slot.slot === "body").map((slot) => {
                    const item = equipped.get(slot.slot);
                    return (
                      <button
                        key={slot.slot}
                        className={item ? "equipment-slot-card filled" : "equipment-slot-card"}
                        onClick={() => item && setSelectedGearId(item.id)}
                      >
                        <span className="slot-icon">{slotIcon(slot.slot)}</span>
                        <span className="slot-copy"><small>{slot.label}</small><strong>{item?.item.name ?? "Empty"}</strong></span>
                      </button>
                    );
                  })}
                </div>

                <div className="operator-paperdoll">
                  <div className="operator-aura" />
                  <div className="operator-head" />
                  <div className="operator-body-shape" />
                  <div className="operator-arm left" />
                  <div className="operator-arm right" />
                  <div className="operator-legs" />
                  <div className="operator-nameplate">
                    <strong>{data.player.displayName}</strong>
                    <span>Level {data.progression.level}</span>
                  </div>
                </div>

                <div className="equipment-slots-column right">
                  {data.slots.filter((slot) => slot.slot === "hand").map((slot) => {
                    const item = equipped.get(slot.slot);
                    return (
                      <button
                        key={slot.slot}
                        className={item ? "equipment-slot-card filled" : "equipment-slot-card"}
                        onClick={() => item && setSelectedGearId(item.id)}
                      >
                        <span className="slot-icon">{slotIcon(slot.slot)}</span>
                        <span className="slot-copy"><small>{slot.label}</small><strong>{item?.item.name ?? "Empty"}</strong></span>
                      </button>
                    );
                  })}
                  <div className="equipment-slot-card locked-slot">
                    <span className="slot-icon">+</span>
                    <span className="slot-copy"><small>Future slot</small><strong>Locked</strong></span>
                  </div>
                </div>
              </div>
            </section>

            {selectedGear && (
              <section className={`gear-inspect game-card rarity-${selectedGear.item.rarity}`}>
                <div className="gear-inspect-icon"><ItemGlyph id={selectedGear.item.id} size={42} /></div>
                <div className="gear-inspect-copy">
                  <div className="eyebrow">{selectedGear.item.rarity} · {selectedGear.item.slot}</div>
                  <h2>{selectedGear.item.name}</h2>
                  <p>{selectedGear.item.description}</p>
                  <div className="gear-bonuses">{bonusText(selectedGear.item.combatBonuses)}</div>
                </div>
                <div className="gear-inspect-actions">
                  {selectedGear.equippedSlot ? (
                    <button className="btn ghost" disabled={locked} onClick={() => unequip(selectedGear.equippedSlot!, selectedGear.item.slot, selectedGear.item.name)}>
                      {busy === `un-${selectedGear.equippedSlot}` ? "Saving..." : "Unequip"}
                    </button>
                  ) : (
                    <button className="btn gold-btn" disabled={locked} onClick={() => equip(selectedGear.id, selectedGear.item.name, selectedGear.item.slot, selectedGear.item.slot)}>
                      {busy === `eq-${selectedGear.id}` ? "Saving..." : "Equip"}
                    </button>
                  )}
                </div>
              </section>
            )}

            <section className="game-card">
              <div className="section-banner">
                <Sword size={20} />
                <span>Owned Gear</span>
                <small>{data.equipment.length} items</small>
              </div>
              {data.equipment.length === 0 ? (
                <p className="empty padded-empty">No equipment owned.</p>
              ) : (
                <div className="gear-grid">
                  {data.equipment.map((item) => (
                    <button
                      key={item.id}
                      className={selectedGear?.id === item.id ? `gear-tile selected rarity-${item.item.rarity}` : `gear-tile rarity-${item.item.rarity}`}
                      onClick={() => setSelectedGearId(item.id)}
                    >
                      <div className="gear-tile-icon"><ItemGlyph id={item.item.id} size={30} /></div>
                      <strong>{item.item.name}</strong>
                      <span>{item.equippedSlot ? "Equipped" : item.item.rarity}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {data && view === "inventory" && (
          <div className="game-screen-stack">
            <section className="game-card">
              <div className="section-banner">
                <Backpack size={20} />
                <span>Resources</span>
                <small>{data.resources.length} stacks</small>
              </div>
              {data.resources.length === 0 ? (
                <p className="empty padded-empty">No resources yet. Complete gathering activities to fill your pack.</p>
              ) : (
                <div className="resource-grid">
                  {data.resources.map((resource) => (
                    <div className="resource-tile" key={resource.item.id}>
                      <div className="resource-icon"><ItemGlyph id={resource.item.id} size={30} /></div>
                      <div className="resource-tile-copy">
                        <strong>{resource.item.name}</strong>
                        <span>{resource.item.description}</span>
                      </div>
                      <b>{resource.quantity.toLocaleString()}</b>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="game-card inventory-tip">
              <div className="section-banner">
                <Shield size={20} />
                <span>Loadout Tip</span>
              </div>
              <p>Equipment now changes combat stats. Materials are used by the Workshop and campaign quests.</p>
              <button className="btn gold-btn" onClick={() => setView("equipment")}>View Equipment</button>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
