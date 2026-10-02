"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import type { InventoryView } from "@/game/equipment";
import type { EquipmentSlot } from "@/content/items";
import { Brand } from "./brand";
import { PlayerNav } from "./player-nav";

class ApiFail extends Error { constructor(m: string, public status: number) { super(m); } }

async function api(path: string, init?: RequestInit): Promise<InventoryView> {
  const res = await fetch(`/frontier-api${path}`, { credentials: "include", cache: "no-store", ...init });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiFail((body && body.error) || `Request failed (${res.status})`, res.status);
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
  return parts.length > 0 ? parts.join(" · ") : "No combat bonuses";
}

export function InventoryClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [data, setData] = useState<InventoryView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const alive = useRef(true);
  const seq = useRef(0);

  const fail = useCallback((e: unknown) => {
    if (e instanceof ApiFail && e.status === 401) { setData(null); router.replace("/sign-in"); return null; }
    return e instanceof Error ? e.message : "Could not reach the station.";
  }, [router]);

  const load = useCallback(async () => {
    const mine = ++seq.current;
    try {
      const d = await api("/inventory");
      if (!alive.current || mine !== seq.current) return;
      setData(d); setLoadError(null);
    } catch (e) {
      if (!alive.current || mine !== seq.current) return;
      const m = fail(e);
      if (m) setLoadError(m);
    }
  }, [fail]);

  useEffect(() => {
    alive.current = true;
    setData(null); setNotice(null); setOpen(null); setLoadError(null);
    load();
    return () => { alive.current = false; };
  }, [load, userId]);

  async function write(key: string, path: string, init: RequestInit, okText: string, failText: string) {
    setBusy(key); setNotice(null);
    ++seq.current;
    try {
      const d = await api(path, init);
      if (!alive.current) return;
      ++seq.current;
      setData(d); setLoadError(null);
      setNotice({ ok: true, text: okText });
    } catch (e) {
      if (!alive.current) return;
      const m = fail(e);
      if (m) { setNotice({ ok: false, text: `${failText} ${m}` }); load(); }
    } finally { if (alive.current) setBusy(null); }
  }

  const equip = (id: string, name: string, slot: EquipmentSlot, label: string) =>
    write(`eq-${id}`, `/equipment/${slot}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ instanceId: id }),
    }, `${name} equipped to ${label}. Saved.`, `${name}'s equipment change could not be confirmed.`);
  const unequip = (slot: EquipmentSlot, label: string, name: string) =>
    write(`un-${slot}`, `/equipment/${slot}`, { method: "DELETE" },
      `${name} removed from ${label}. Saved.`, `${name}'s equipment change could not be confirmed.`);

  const locked = busy !== null;

  return (
    <>
      <header className="bar">
        <div className="wrap"><Brand /><UserButton /></div>
      </header>
      <PlayerNav current="inventory" />
      <main className="wrap" style={{ padding: "1.5rem 1.25rem 4rem" }} aria-busy={!data && !loadError}>
        <h1 className="mono" style={{ margin: "0 0 1rem", fontSize: "1.5rem" }}>Inventory &amp; Equipment</h1>
        {data && <p className="mono muted" style={{ margin: "0 0 1rem", fontSize: ".85rem" }}>
          {data.player.displayName} · {data.player.gold.toLocaleString()} gold · Level {data.progression.level}
        </p>}
        {loadError && (
          <div className="alert" role="alert" style={{ marginBottom: "1rem" }}>
            <span>{data ? "Showing last known state. " : ""}{loadError}</span>
            <button className="btn ghost" onClick={load} disabled={locked}>Retry</button>
          </div>
        )}
        {!data && !loadError && (
          <div className="grid" role="status" aria-label="Loading inventory">
            <div className="skel" style={{ height: 120 }} /><div className="skel" style={{ height: 90 }} /><div className="skel" style={{ height: 160 }} />
          </div>
        )}
        {!data && loadError && <p className="empty">Inventory unavailable.</p>}
        <div aria-live="polite">
          {notice && (
            <div className={notice.ok ? "reward-notice" : "alert"} role={notice.ok ? "status" : "alert"} style={{ marginBottom: "1rem" }}>
              <span><strong>{notice.ok ? "Saved" : "Save not confirmed"}:</strong> {notice.text}</span>
              <button className="btn ghost sm" onClick={() => setNotice(null)}>Dismiss</button>
            </div>
          )}
        </div>
        {data && (() => {
          const byId = new Map(data.equipment.map((e) => [e.id, e]));
          return (
            <div className="grid">
              <p className="muted" style={{ margin: 0, fontSize: ".85rem" }}>
                Equipped gear now changes combat stats. Gathering speed and resource rewards are still unchanged.
              </p>

              <section className="panel" aria-labelledby="slots">
                <h2 id="slots">Equipment slots</h2>
                <div className="slot-grid">
                  {data.slots.map((s) => {
                    const eq = s.equipmentId ? byId.get(s.equipmentId) : undefined;
                    return (
                      <div key={s.slot} className={`slot${eq ? " filled" : ""}`}>
                        <span className="label" style={{ margin: 0 }}>{s.label} slot</span>
                        <span className="slot-name">{eq ? eq.item.name : "Empty"}</span>
                        {eq && (
                          <button className="btn ghost sm" disabled={locked}
                            aria-label={`Unequip ${eq.item.name} from ${s.label}`}
                            onClick={() => unequip(s.slot, s.label, eq.item.name)}>
                            {busy === `un-${s.slot}` ? "Saving..." : "Unequip"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="panel" aria-labelledby="gear">
                <h2 id="gear">Owned gear · unique items</h2>
                {data.equipment.length === 0 ? <p className="empty">No gear owned.</p> :
                  data.equipment.map((e) => {
                    const label = data.slots.find((s) => s.slot === e.item.slot)?.label ?? e.item.slot;
                    const did = `gear-${e.id}`;
                    const isOpen = open === did;
                    return (
                      <div className="item" key={e.id}>
                        <div className="item-head">
                          <div>
                            <strong>{e.item.name}</strong>{" "}
                            <span className="tag">{label}</span>{" "}
                            <span className="tag">{e.item.rarity}</span>{" "}
                            <span className="tag on">{bonusText(e.item.combatBonuses)}</span>{" "}
                            {e.equippedSlot
                              ? <span className="tag on">Equipped · {data.slots.find((s) => s.slot === e.equippedSlot)?.label}</span>
                              : <span className="tag">Not equipped</span>}
                          </div>
                          <div className="item-actions">
                            <button className="btn ghost sm" aria-expanded={isOpen} aria-controls={did}
                              onClick={() => setOpen(isOpen ? null : did)}>{isOpen ? "Hide details" : "Inspect"}</button>
                            {e.equippedSlot ? (
                              <button className="btn ghost sm" disabled={locked}
                                onClick={() => unequip(e.equippedSlot!, label, e.item.name)}>
                                {busy === `un-${e.equippedSlot}` ? "Saving..." : "Unequip"}
                              </button>
                            ) : (
                              <button className="btn sm" disabled={locked}
                                aria-label={`Equip ${e.item.name} to ${label}`}
                                onClick={() => equip(e.id, e.item.name, e.item.slot, label)}>
                                {busy === `eq-${e.id}` ? "Saving..." : `Equip to ${label}`}
                              </button>
                            )}
                          </div>
                        </div>
                        {isOpen && (
                          <div className="detail" id={did}>
                            <p style={{ margin: 0 }}>{e.item.description}</p>
                            <p className="mono" style={{ margin: ".4rem 0 0", fontSize: ".78rem" }}>
                              Combat: {bonusText(e.item.combatBonuses)}
                            </p>
                            <p className="mono muted" style={{ margin: ".4rem 0 0", fontSize: ".75rem" }}>
                              Fits: {label} only · Instance {e.id.slice(0, 8)} · Acquired {new Date(e.acquiredAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </section>

              <section className="panel" aria-labelledby="stacks">
                <h2 id="stacks">Resources · stacks</h2>
                {data.resources.length === 0 ? <p className="empty">No resources yet. Complete gathering and claim your first reward.</p> :
                  data.resources.map((r) => {
                    const did = `res-${r.item.id}`;
                    const isOpen = open === did;
                    return (
                      <div className="item" key={r.item.id}>
                        <div className="item-head">
                          <div><strong>{r.item.name}</strong> <span className="tag">Stack</span></div>
                          <div className="item-actions">
                            <span className="mono" style={{ alignSelf: "center" }}>x {r.quantity.toLocaleString()}</span>
                            <button className="btn ghost sm" aria-expanded={isOpen} aria-controls={did}
                              onClick={() => setOpen(isOpen ? null : did)}>{isOpen ? "Hide details" : "Inspect"}</button>
                          </div>
                        </div>
                        {isOpen && <div className="detail" id={did}><p style={{ margin: 0 }}>{r.item.description}</p></div>}
                      </div>
                    );
                  })}
              </section>
            </div>
          );
        })()}
      </main>
    </>
  );
}
