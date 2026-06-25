import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, ShoppingBag, Package, Zap, Target,
  Star, Lock, CheckCircle, Clock, Coins, Gem,
  Battery, Shield, Cpu, Crosshair, Wind, Plus,
  ArrowLeft, ChevronRight,
} from "lucide-react";

import masterImg from "@/imports/master.png";
import masterButtonsImg from "@/imports/master-buttons.png";
import masterCurrencyImg from "@/imports/master-currency.png";
import masterForgeImg from "@/imports/master-forge.png";
import masterMeltImg from "@/imports/master-melt.png";
import masterGearImg from "@/imports/master-gear.png";
import masterShipsImg from "@/imports/master-ships.png";
import masterShipContainerImg from "@/imports/master-ship-container.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavTab = "home" | "store" | "inventory" | "skills" | "missions";
type InventoryMode = "main" | "forge" | "melt" | "ships";

interface ItemSlot {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: React.ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const RARITY_COLOR: Record<string, string> = {
  common:    "#64748b",
  rare:      "#3b82f6",
  epic:      "#a855f7",
  legendary: "#f59e0b",
};

const EQUIPPED: ItemSlot[] = [
  { id: "l1", name: "Plasma Core",  rarity: "epic",      icon: <Cpu       size={16} /> },
  { id: "l2", name: "Ion Hull",     rarity: "rare",      icon: <Shield    size={16} /> },
  { id: "l3", name: "Warp Drive",   rarity: "legendary", icon: <Wind      size={16} /> },
  { id: "r1", name: "Rail Cannon",  rarity: "legendary", icon: <Crosshair size={16} /> },
  { id: "r2", name: "Deflector",    rarity: "rare",      icon: <Shield    size={16} /> },
  { id: "r3", name: "Cell Array",   rarity: "common",    icon: <Battery   size={16} /> },
];

const FORGE_INGREDIENTS: (ItemSlot | null)[] = [
  { id: "i1", name: "Ion Shard",     rarity: "rare",   icon: <Zap    size={16} /> },
  { id: "i2", name: "Void Steel",    rarity: "epic",   icon: <Shield size={16} /> },
  null,
  null,
];

const INVENTORY_ITEMS: ItemSlot[] = [
  { id: "v1", name: "Ion Shard",       rarity: "rare",      icon: <Zap       size={14} /> },
  { id: "v2", name: "Plasma Lens",     rarity: "rare",      icon: <Cpu       size={14} /> },
  { id: "v3", name: "Void Steel x3",   rarity: "epic",      icon: <Shield    size={14} /> },
  { id: "v4", name: "Null Crystal",    rarity: "legendary", icon: <Star      size={14} /> },
  { id: "v5", name: "Carbon Plate",    rarity: "common",    icon: <Battery   size={14} /> },
  { id: "v6", name: "Arc Filament",    rarity: "rare",      icon: <Wind      size={14} /> },
];

const MISSIONS = [
  { id: "m1", name: "Asteroid Sweep",  desc: "Clear the debris field in sector 7",           diff: "easy",      reward: "500 Credits",                      status: "completed" as const },
  { id: "m2", name: "Convoy Escort",   desc: "Protect the ore freighter to Station Alpha",   diff: "medium",    reward: "1,200 Credits + Rare Part",        status: "active"    as const, time: "14:32" },
  { id: "m3", name: "Rogue Squadron",  desc: "Eliminate the pirate fleet at Sector 12",      diff: "hard",      reward: "3,000 Credits + Epic Core",        status: "available" as const },
  { id: "m4", name: "Deep Scan",       desc: "Survey the uncharted nebula for anomalies",    diff: "medium",    reward: "800 Credits",                      status: "available" as const },
  { id: "m5", name: "Warlord Hunt",    desc: "Destroy the Dreadnought before it reaches colony", diff: "legendary", reward: "10,000 Credits + Legendary Module", status: "available" as const },
];

const CREDITS_ITEMS = [
  { id: "c1", name: "Plasma Core",  price: "1,200", icon: <Cpu       size={14} /> },
  { id: "c2", name: "Void Shield",  price: "800",   icon: <Shield    size={14} /> },
  { id: "c3", name: "Rail Cannon",  price: "3,500", icon: <Crosshair size={14} /> },
  { id: "c4", name: "Warp Cell",    price: "350",   icon: <Battery   size={14} /> },
  { id: "c5", name: "Ion Hull",     price: "1,100", icon: <Shield    size={14} /> },
  { id: "c6", name: "Arc Drive",    price: "2,200", icon: <Wind      size={14} /> },
  { id: "c7", name: "Nova Bolt",    price: "1,800", icon: <Zap       size={14} /> },
  { id: "c8", name: "Null Field",   price: "4,500", icon: <Star      size={14} /> },
];

const GOLD_ITEMS = [
  { id: "g1", name: "Omega Cannon", stars: "50",  icon: <Crosshair size={14} /> },
  { id: "g2", name: "Phase Shield", stars: "35",  icon: <Shield    size={14} /> },
  { id: "g3", name: "Warp Coil X",  stars: "80",  icon: <Wind      size={14} /> },
  { id: "g4", name: "Quant. Cell",  stars: "15",  icon: <Battery   size={14} /> },
  { id: "g5", name: "Void Armor",   stars: "120", icon: <Shield    size={14} /> },
  { id: "g6", name: "Arc Matrix",   stars: "60",  icon: <Zap       size={14} /> },
  { id: "g7", name: "Pulse Engine", stars: "45",  icon: <Cpu       size={14} /> },
  { id: "g8", name: "Dark Matter",  stars: "200", icon: <Star      size={14} /> },
];

// Keep for backward compat reference
const STORE_ITEMS = CREDITS_ITEMS;

const SHIP_LIST = [
  { id: "sh1", name: "Nebula-X",    type: "Interceptor", unlocked: true,  active: true  },
  { id: "sh2", name: "Void Hawk",   type: "Fighter",     unlocked: true,  active: false },
  { id: "sh3", name: "Dusk Runner", type: "Cruiser",     unlocked: false, active: false },
  { id: "sh4", name: "Iron Wrath",  type: "Destroyer",   unlocked: false, active: false },
  { id: "sh5", name: "Starfall",    type: "Bomber",      unlocked: false, active: false },
  { id: "sh6", name: "Echo Prime",  type: "Scout",       unlocked: false, active: false },
];

const SKILL_ROWS = [
  [{ id:"s1", name:"Plasma Bolt", lv:3, max:5, unlocked:true,  cost:0,   col:"#60a5fa" }],
  [{ id:"s2", name:"Arc Chain",   lv:1, max:5, unlocked:true,  cost:120, col:"#60a5fa" },
   { id:"s3", name:"Ion Burst",   lv:0, max:5, unlocked:true,  cost:150, col:"#f97316" }],
  [{ id:"s4", name:"Overcharge",  lv:0, max:3, unlocked:false, cost:300, col:"#60a5fa" },
   { id:"s5", name:"Nova Strike", lv:0, max:3, unlocked:false, cost:350, col:"#f97316" }],
  [{ id:"s6", name:"Singularity", lv:0, max:1, unlocked:false, cost:999, col:"#a855f7" }],
];

// ─── Spaceship SVG ────────────────────────────────────────────────────────────
function Spaceship({ size = 1 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 12px rgba(37,99,235,0.9))" }}>
      <ellipse cx="60" cy="163" rx="20" ry="10" fill="#2563eb" opacity="0.25" />
      <ellipse cx="60" cy="161" rx="11" ry="6" fill="#60a5fa" opacity="0.55" />
      <path d="M60 10 L80 82 L75 122 L60 138 L45 122 L40 82 Z" fill="#1e3a5f" stroke="#2563eb" strokeWidth="1.5" />
      <ellipse cx="60" cy="41" rx="10" ry="14" fill="#0ea5e9" opacity="0.7" stroke="#38bdf8" strokeWidth="1" />
      <ellipse cx="60" cy="39" rx="6" ry="9" fill="#bae6fd" opacity="0.35" />
      <path d="M40 82 L8 123 L19 132 L45 122 Z" fill="#1a3050" stroke="#2563eb" strokeWidth="1.2" />
      <path d="M80 82 L112 123 L101 132 L75 122 Z" fill="#1a3050" stroke="#2563eb" strokeWidth="1.2" />
      <line x1="23" y1="116" x2="43" y2="106" stroke="#3b82f6" strokeWidth="0.9" opacity="0.65" />
      <line x1="97" y1="116" x2="77" y2="106" stroke="#3b82f6" strokeWidth="0.9" opacity="0.65" />
      <line x1="54" y1="57" x2="66" y2="57" stroke="#38bdf8" strokeWidth="1" opacity="0.45" />
      <line x1="52" y1="68" x2="68" y2="68" stroke="#38bdf8" strokeWidth="1" opacity="0.45" />
      <rect x="48" y="130" width="8" height="15" rx="2" fill="#0a1a30" stroke="#2563eb" strokeWidth="1" />
      <rect x="64" y="130" width="8" height="15" rx="2" fill="#0a1a30" stroke="#2563eb" strokeWidth="1" />
      <ellipse cx="52" cy="145" rx="4" ry="3" fill="#60a5fa" opacity="0.85" />
      <ellipse cx="68" cy="145" rx="4" ry="3" fill="#60a5fa" opacity="0.85" />
      <rect x="17" y="120" width="6" height="10" rx="2" fill="#0a1a30" stroke="#2563eb" strokeWidth="0.8" />
      <rect x="97" y="120" width="6" height="10" rx="2" fill="#0a1a30" stroke="#2563eb" strokeWidth="0.8" />
      <rect x="36" y="91" width="6" height="20" rx="1" fill="#0a1a30" stroke="#3b82f6" strokeWidth="0.8" />
      <rect x="78" y="91" width="6" height="20" rx="1" fill="#0a1a30" stroke="#3b82f6" strokeWidth="0.8" />
    </svg>
  );
}

// ─── Image Layer helpers ──────────────────────────────────────────────────────
// All masters share the same 768×1366 canvas. Positions below are expressed as
// percentages of that canvas so they stay aligned regardless of display size.
const ABS: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", top: 0, left: 0, objectFit: "fill" };

// LayerLabel — stamps each container with its GIMP filename.
// Sits top-right inside any position:relative parent.
function LayerLabel({ name }: { name: string }) {
  return (
    <div style={{
      position: "absolute", top: 2, right: 3, zIndex: 50,
      fontFamily: "monospace", fontSize: "min(1.1vw,4.5px)",
      color: "rgba(96,165,250,0.45)",
      pointerEvents: "none", userSelect: "none",
      letterSpacing: "0.03em",
    }}>{name}</div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GLOBAL OVERLAYS  (appear on every page)
//   master-currency.png  →  MasterCurrency
//   master-buttons.png   →  MasterButtons
// ══════════════════════════════════════════════════════════════════════════════

// master-currency.png — pill graphics come from the image; we overlay number text.
function MasterCurrency({ credits, gold }: { credits: number; gold: number }) {
  const numStyle: React.CSSProperties = {
    fontFamily: "Orbitron, sans-serif",
    fontSize: "min(2.4vw, 10px)",
    fontWeight: 700,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    lineHeight: 1,
  };
  return (
    <>
      {/* Left pill – blue credits */}
      <div style={{ position: "absolute", left: "7.7%", top: "1.7%", width: "8.2%", height: "3.2%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...numStyle, color: "#90c8ff" }}>{credits.toLocaleString()}</span>
      </div>
      {/* Right pill – gold */}
      <div style={{ position: "absolute", left: "84.5%", top: "1.7%", width: "8.2%", height: "3.2%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...numStyle, color: "#fcd34d" }}>{gold.toLocaleString()}</span>
      </div>
    </>
  );
}

// master-buttons.png — transparent hit-areas over each baked-in button graphic.
const NAV_DEFS = [
  { tab: "store"     as NavTab, icon: <ShoppingBag size={16} />, label: "STORE",    style: { left: "2.7%",  bottom: "1.0%", width: "17.7%", height: "10.2%" } },
  { tab: "inventory" as NavTab, icon: <Package     size={16} />, label: "GEAR",     style: { left: "21.5%", bottom: "1.0%", width: "17.7%", height: "10.2%" } },
  { tab: "home"      as NavTab, icon: <Home        size={18} />, label: "HOME",     style: { left: "39.3%", bottom: "0.5%", width: "21.4%", height: "11.2%" } },
  { tab: "skills"    as NavTab, icon: <Zap         size={16} />, label: "SKILLS",   style: { left: "61.0%", bottom: "1.0%", width: "17.7%", height: "10.2%" } },
  { tab: "missions"  as NavTab, icon: <Target      size={16} />, label: "MISSIONS", style: { left: "79.6%", bottom: "1.0%", width: "17.7%", height: "10.2%" } },
];

interface MasterButtonsProps {
  active: NavTab;
  onSelect: (t: NavTab) => void;
}
function MasterButtons({ active, onSelect }: MasterButtonsProps) {
  return (
    <>
      {NAV_DEFS.map(({ tab, icon, label, style }) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            style={{
              position: "absolute",
              ...style,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 30,
              transition: "filter 0.15s",
              filter: isActive ? "drop-shadow(0 0 6px rgba(96,165,250,0.9))" : "none",
            }}
          >
            <span style={{ color: isActive ? "#93c5fd" : "#607090", transition: "color 0.15s" }}>{icon}</span>
            <span style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "min(1.8vw, 7.5px)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: isActive ? "#93c5fd" : "#607090",
              transition: "color 0.15s",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </>
  );
}

// ─── Slot widget (drawn in CSS, sits inside image slot outline) ───────────────
function SlotWidget({ item, onClick, small }: { item: ItemSlot | null; onClick?: () => void; small?: boolean }) {
  if (!item) {
    return (
      <div
        onClick={onClick}
        style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: onClick ? "pointer" : "default",
        }}
      >
        <span style={{ color: "#1a2a45", fontFamily: "Orbitron,sans-serif", fontSize: small ? "min(1.4vw,5px)" : "min(1.8vw,6px)" }}>EMPTY</span>
      </div>
    );
  }
  const col = RARITY_COLOR[item.rarity];
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "1px",
        cursor: onClick ? "pointer" : "default",
        background: `${col}12`,
        borderRadius: 4,
      }}
    >
      <span style={{ color: col }}>{item.icon}</span>
      <span style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: small ? "min(1.6vw,5.5px)" : "min(1.8vw,6.5px)",
        color: "#94a3b8",
        textAlign: "center",
        lineHeight: 1.1,
        padding: "0 2px",
      }}>{item.name}</span>
      <div style={{ width: "70%", height: 1, background: col, opacity: 0.6, borderRadius: 1 }} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: HOME  |  base layer: master.png + master-buttons.png
// ══════════════════════════════════════════════════════════════════════════════
function HomeScreen() {
  return (
    <div style={{ position: "absolute", top: "5.8%", left: "4%", right: "4%", bottom: "12.5%", display: "flex", flexDirection: "column", gap: "2%" }}>
      {/* Player card */}
      <div style={{ background: "linear-gradient(160deg,#0d1929 0%,#08121e 100%)", border: "1px solid rgba(37,99,235,0.4)", borderRadius: 8, padding: "3% 4%", display: "flex", gap: "3%", alignItems: "center" }}>
        <div style={{ width: "min(10vw,42px)", height: "min(10vw,42px)", borderRadius: "50%", background: "linear-gradient(135deg,#1e3a5f,#0f2444)", border: "2px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "Orbitron,sans-serif", color: "#60a5fa", fontSize: "min(4vw,16px)", fontWeight: 700 }}>V</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Orbitron,sans-serif", color: "#e2e8f0", fontSize: "min(2.8vw,12px)", fontWeight: 600 }}>VOIDWALKER</div>
          <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#60a5fa", fontSize: "min(2.6vw,11px)" }}>Level 24 · Commander</div>
          <div style={{ marginTop: 3, height: "min(0.8vw,3.5px)", borderRadius: 99, background: "#111c30", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#2563eb,#60a5fa)", borderRadius: 99 }} />
          </div>
        </div>
        <span style={{ fontFamily: "Rajdhani,sans-serif", color: "#f59e0b", fontSize: "min(2.2vw,9px)", flexShrink: 0 }}>72% XP</span>
      </div>

      {/* Resources row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2%" }}>
        {[
          { icon: <Coins size={12} />, value: "48,200", label: "Credits", col: "#f59e0b" },
          { icon: <Gem   size={12} />, value: "320",    label: "Crystals", col: "#a855f7" },
          { icon: <Star  size={12} />, value: "1,840",  label: "Rank pts", col: "#3b82f6" },
        ].map((r) => (
          <div key={r.label} style={{ background: "linear-gradient(160deg,#0d1929,#08121e)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 6, padding: "3% 2%", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ color: r.col }}>{r.icon}</span>
            <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2.4vw,10px)", color: "#e2e8f0", fontWeight: 600 }}>{r.value}</span>
            <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(2vw,8px)", color: "#64748b" }}>{r.label}</span>
          </div>
        ))}
      </div>

      {/* Active mission */}
      <div style={{ background: "linear-gradient(160deg,#0d1929,#08121e)", border: "1px solid rgba(37,99,235,0.35)", borderRadius: 8, padding: "3% 4%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2%" }}>
          <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#2563eb", letterSpacing: "0.1em" }}>ACTIVE MISSION</span>
          <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(2.2vw,9px)", color: "#f59e0b" }}>14:32 left</span>
        </div>
        <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#e2e8f0", fontSize: "min(2.8vw,12px)", fontWeight: 600 }}>Convoy Escort</div>
        <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#64748b", fontSize: "min(2.2vw,9.5px)" }}>Protect the ore freighter to Station Alpha</div>
        <div style={{ marginTop: 4, height: "min(0.8vw,3.5px)", borderRadius: 99, background: "#111c30", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "38%", background: "linear-gradient(90deg,#f59e0b,#fcd34d)", borderRadius: 99 }} />
        </div>
      </div>

      {/* Ship preview */}
      <div style={{ flex: 1, background: "radial-gradient(ellipse at 50% 40%,#0a1a35 0%,#050d1a 70%)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2%" }}>
        <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#2563eb", letterSpacing: "0.12em", marginBottom: "2%" }}>YOUR VESSEL</span>
        <div style={{ height: "min(20vw,85px)" }}>
          <Spaceship />
        </div>
        <span style={{ fontFamily: "Rajdhani,sans-serif", color: "#60a5fa", fontSize: "min(2.4vw,10px)", marginTop: "2%" }}>NEBULA-CLASS INTERCEPTOR</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: GEAR  |  base: master-gear.png
//   elements:  master-gear (upper panel — slots + ship)
//              master-gear (lower panel — inventory grid)
//   sub-pages: master-melt.png  →  MeltScreen
//              master-forge.png →  ForgeScreen
//              master-ships.png →  ShipsScreen
// ══════════════════════════════════════════════════════════════════════════════
function GearMainScreen({ onMelt, onForge, onShips }: { onMelt: () => void; onForge: () => void; onShips: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const leftItems  = EQUIPPED.slice(0, 3);
  const rightItems = EQUIPPED.slice(3, 6);
  const selItem = selected ? EQUIPPED.find(i => i.id === selected) : null;

  // Slot layout helpers (all positions as % of 768×1366 canvas)
  const LEFT_X   = "5.5%";
  const RIGHT_X  = "80.5%"; // right edge of slot = 100 - 5.5 - 14.1 = 80.4%
  const SLOT_W   = "14.1%";
  const SLOT_Y   = ["6.2%", "14.9%", "23.5%"];
  const SLOT_H   = "8.1%";

  return (
    <>
      {/* Left item slots */}
      {leftItems.map((item, i) => (
        <div key={item.id} onClick={() => setSelected(selected === item.id ? null : item.id)}
          style={{ position: "absolute", left: LEFT_X, top: SLOT_Y[i], width: SLOT_W, height: SLOT_H,
            outline: selected === item.id ? `1.5px solid ${RARITY_COLOR[item.rarity]}` : "none", borderRadius: 4, cursor: "pointer" }}>
          <SlotWidget item={item} />
        </div>
      ))}

      {/* Right item slots */}
      {rightItems.map((item, i) => (
        <div key={item.id} onClick={() => setSelected(selected === item.id ? null : item.id)}
          style={{ position: "absolute", left: RIGHT_X, top: SLOT_Y[i], width: SLOT_W, height: SLOT_H,
            outline: selected === item.id ? `1.5px solid ${RARITY_COLOR[item.rarity]}` : "none", borderRadius: 4, cursor: "pointer" }}>
          <SlotWidget item={item} />
        </div>
      ))}

      {/* Spaceship in center */}
      <div style={{ position: "absolute", left: "21%", right: "21%", top: "6.2%", height: "25.5%",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ height: "90%" }}>
          <Spaceship />
        </div>
      </div>

      {/* Selected item detail strip */}
      {selItem && (
        <div style={{ position: "absolute", left: "5.5%", right: "5.5%", top: "32.5%", height: "4%",
          background: `${RARITY_COLOR[selItem.rarity]}18`, border: `1px solid ${RARITY_COLOR[selItem.rarity]}55`,
          borderRadius: 5, display: "flex", alignItems: "center", gap: "2%", padding: "0 2%" }}>
          <span style={{ color: RARITY_COLOR[selItem.rarity] }}>{selItem.icon}</span>
          <span style={{ fontFamily: "Orbitron,sans-serif", color: "#e2e8f0", fontSize: "min(1.8vw,7.5px)", flex: 1 }}>{selItem.name}</span>
          <span style={{ fontFamily: "Rajdhani,sans-serif", color: RARITY_COLOR[selItem.rarity], fontSize: "min(1.8vw,7.5px)", textTransform: "capitalize" }}>{selItem.rarity}</span>
        </div>
      )}

      {/* MELT hit-area (left image button) */}
      <div onClick={onMelt} style={{ position: "absolute", left: "8%", top: "36.2%", width: "26%", height: "4.5%", cursor: "pointer", zIndex: 25 }} />

      {/* SHIPS — visible CSS pill centered between the two image buttons */}
      <div onClick={onShips} style={{
        position: "absolute", left: "35.5%", top: "36.2%", width: "29%", height: "4.5%",
        cursor: "pointer", zIndex: 26,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg,#b45309,#92400e)",
        border: "1.5px solid #f59e0b",
        borderRadius: "min(2vw,8px)",
        boxShadow: "0 0 10px rgba(245,158,11,0.35)",
      }}>
        <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2vw,8px)", fontWeight: 700, color: "#1a0a00", letterSpacing: "0.1em" }}>SHIPS</span>
      </div>

      {/* FORGE hit-area (right image button) */}
      <div onClick={onForge} style={{ position: "absolute", left: "66%", top: "36.2%", width: "26%", height: "4.5%", cursor: "pointer", zIndex: 25 }} />

      {/* master-gear — lower panel: inventory grid */}
      <div style={{ position: "absolute", left: "4.3%", right: "4.3%", top: "42%", bottom: "12.5%", overflow: "hidden" }}>
        <LayerLabel name="master-gear (lower panel)" />
        <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#2563eb", letterSpacing: "0.1em", marginBottom: "2%", paddingTop: "1.5%" }}>
          SHIP INVENTORY
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5%" }}>
          {INVENTORY_ITEMS.map((item) => {
            const col = RARITY_COLOR[item.rarity];
            return (
              <div key={item.id} style={{ background: `${col}12`, border: `1px solid ${col}44`, borderRadius: 5, padding: "3% 2%", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ color: col }}>{item.icon}</span>
                <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(2vw,8.5px)", color: "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: GEAR > FORGE  |  base: master-forge.png
//   elements:  master-forge (upper panel — 4 ingredient slots)
//              master-forge (lower panel — recipe list / result)
// ══════════════════════════════════════════════════════════════════════════════
function ForgeScreen({ onBack }: { onBack: () => void }) {
  const [slots, setSlots] = useState<(ItemSlot | null)[]>(FORGE_INGREDIENTS);
  const [result, setResult] = useState<string | null>(null);

  const SLOT_W = "13.5%";
  const SLOT_H = "8.4%";
  const SLOT_Y = "19.0%";
  const SLOT_X = ["7.2%", "27.9%", "48.7%", "69.4%"];

  const doForge = () => {
    const filled = slots.filter(Boolean).length;
    if (filled >= 2) setResult("NOVA CANNON MK-III");
  };

  return (
    <>
      {/* Back to gear — small hit zone top-left of upper panel */}
      <div onClick={onBack} style={{ position: "absolute", left: "4.5%", top: "6.5%", zIndex: 25, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 3 }}>
        <ArrowLeft size={10} style={{ color: "#60a5fa" }} />
        <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.6vw,6.5px)", color: "#60a5fa" }}>GEAR</span>
      </div>

      {/* 4 ingredient slots */}
      {SLOT_X.map((lx, i) => (
        <div key={i} style={{ position: "absolute", left: lx, top: SLOT_Y, width: SLOT_W, height: SLOT_H, cursor: "pointer" }}>
          <SlotWidget item={slots[i]} onClick={() => {
            setSlots(prev => { const n = [...prev]; n[i] = n[i] ? null : (INVENTORY_ITEMS[i] ?? null); return n; });
          }} />
        </div>
      ))}

      {/* Invisible FORGE action overlay */}
      <div onClick={doForge} style={{ position: "absolute", left: "31.2%", top: "36.5%", width: "37.5%", height: "4.1%", cursor: "pointer", zIndex: 25 }} />

      {/* master-forge — lower panel */}
      <div style={{ position: "absolute", left: "4.3%", right: "4.3%", top: "42%", bottom: "12.5%", overflow: "hidden", paddingTop: "2%" }}>
        <LayerLabel name="master-forge (lower panel)" />
        {result ? (
          <div style={{ textAlign: "center", padding: "6% 4%" }}>
            <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2.2vw,9.5px)", color: "#f59e0b", marginBottom: "3%" }}>FORGE COMPLETE</div>
            <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.5)", borderRadius: 8, padding: "4%", marginBottom: "4%" }}>
              <Crosshair size={20} style={{ color: "#f59e0b", margin: "0 auto 4px" }} />
              <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#e2e8f0", fontSize: "min(2.4vw,10px)", fontWeight: 600 }}>{result}</div>
              <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#f59e0b", fontSize: "min(1.8vw,7.5px)", textTransform: "uppercase" }}>Legendary · Weapon</div>
            </div>
            <div onClick={() => { setResult(null); setSlots(FORGE_INGREDIENTS); }} style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(2vw,8.5px)", color: "#60a5fa", cursor: "pointer" }}>FORGE AGAIN</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#2563eb", letterSpacing: "0.1em", marginBottom: "3%" }}>FORGE RECIPES</div>
            {[
              { name: "Nova Cannon MK-III", mats: "Ion Shard + Void Steel", rarity: "legendary", col: "#f59e0b" },
              { name: "Phase Shield",       mats: "Arc Filament + Plasma Lens", rarity: "epic",  col: "#a855f7" },
              { name: "Quantum Drive",      mats: "Null Crystal × 2", rarity: "epic",            col: "#a855f7" },
            ].map((r) => (
              <div key={r.name} style={{ background: `${r.col}0e`, border: `1px solid ${r.col}44`, borderRadius: 5, padding: "2.5% 3%", marginBottom: "2%", display: "flex", alignItems: "center", gap: "3%" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#e2e8f0" }}>{r.name}</div>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#64748b" }}>{r.mats}</div>
                </div>
                <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.6vw,6.5px)", color: r.col, textTransform: "capitalize" }}>{r.rarity}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: GEAR > MELT  |  base: master-melt.png
//   elements:  master-melt (upper panel — selected item display)
//              master-melt (lower panel — inventory list to select from)
// ══════════════════════════════════════════════════════════════════════════════
function MeltScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<ItemSlot | null>(null);
  const [melted, setMelted] = useState<string | null>(null);

  const doMelt = () => {
    if (selected) setMelted(`${selected.name} → 4–8 Shards`);
  };

  return (
    <>
      {/* Back button */}
      <div onClick={onBack} style={{ position: "absolute", left: "4.5%", top: "6.5%", zIndex: 25, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 3 }}>
        <ArrowLeft size={10} style={{ color: "#f97316" }} />
        <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.6vw,6.5px)", color: "#f97316" }}>GEAR</span>
      </div>

      {/* Upper panel — selected item display (matches master-melt.png panel: 6%–34%) */}
      {/* master-melt — upper panel: selected item display */}
      <div style={{ position: "absolute", left: "4.3%", right: "4.3%", top: "6.5%", height: "27%",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LayerLabel name="master-melt (upper panel)" />
        {selected ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 4, color: RARITY_COLOR[selected.rarity] }}>{selected.icon}</div>
            <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2.4vw,10px)", color: "#e2e8f0" }}>{selected.name}</div>
            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.8vw,8px)", color: RARITY_COLOR[selected.rarity], textTransform: "capitalize" }}>{selected.rarity} · Yields 4–8 shards</div>
          </div>
        ) : (
          <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(2.2vw,9px)", color: "#2a3a5a" }}>Select an item below to melt</span>
        )}
      </div>

      {/* Melt result */}
      {melted && (
        <div style={{ position: "absolute", left: "4.3%", right: "4.3%", top: "33.5%", height: "2.5%",
          background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.5)", borderRadius: 5,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(2vw,8.5px)", color: "#fb923c" }}>{melted}</span>
        </div>
      )}

      {/* Invisible MELT action overlay */}
      <div onClick={doMelt} style={{ position: "absolute", left: "31.2%", top: "36.5%", width: "37.5%", height: "4.1%", cursor: "pointer", zIndex: 25 }} />

      {/* master-melt — lower panel: item list */}
      <div style={{ position: "absolute", left: "4.3%", right: "4.3%", top: "42%", bottom: "12.5%", overflow: "hidden", paddingTop: "2%" }}>
        <LayerLabel name="master-melt (lower panel)" />
        <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#f97316", letterSpacing: "0.1em", marginBottom: "3%" }}>SELECT TO MELT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2%" }}>
          {INVENTORY_ITEMS.map((item) => {
            const col = RARITY_COLOR[item.rarity];
            const isSel = selected?.id === item.id;
            return (
              <div key={item.id} onClick={() => { setSelected(isSel ? null : item); setMelted(null); }}
                style={{ background: isSel ? `${col}22` : `${col}0a`, border: `1px solid ${isSel ? col + "88" : col + "33"}`,
                  borderRadius: 5, padding: "2.5% 3%", display: "flex", alignItems: "center", gap: "3%", cursor: "pointer" }}>
                <span style={{ color: col }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(2.2vw,9px)", color: "#e2e8f0", fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.8vw,7.5px)", color: col, textTransform: "capitalize" }}>{item.rarity}</div>
                </div>
                {isSel && <CheckCircle size={12} style={{ color: col }} />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// MISSIONS -----------------------------------------------------------------------
// Individual rows using master-missions-dialoug.png visual style:
//   dark charcoal body, orange border, orange triangle top-left,
//   orange diagonal hazard stripes bottom-right.
const DIFF_COL: Record<string, string> = {
  easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444", legendary: "#a855f7",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  available: <ChevronRight size={11} />,
  active:    <Clock        size={11} />,
  completed: <CheckCircle  size={11} />,
};

// master-missions-dialoug — individual mission row container
function MasterMissionsDialoug({ m }: { m: typeof MISSIONS[0] }) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      borderRadius: "min(1.5vw,5px)",
      overflow: "hidden",
      opacity: m.status === "completed" ? 0.6 : 1,
      flexShrink: 0,
    }}>
      {/* Dark body — master-missions-dialoug */}
      <div style={{
        background: "#252830",
        border: "1.5px solid #b45309",
        borderRadius: "min(1.5vw,5px)",
        padding: "3.5% 4% 4% 10%",
        position: "relative",
        overflow: "hidden",
      }}>
        <LayerLabel name="master-missions-dialoug" />
        {/* Orange triangle top-left */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 0, height: 0,
          borderTop: "min(6vw,26px) solid #b45309",
          borderRight: "min(6vw,26px) solid transparent",
        }} />

        {/* Diagonal hazard stripes bottom-right */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: "22%", height: "45%",
          backgroundImage: "repeating-linear-gradient(45deg, #b45309 0px, #b45309 4px, transparent 4px, transparent 10px)",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2%", marginBottom: "2%" }}>
            <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2vw,8.5px)", color: "#e2e8f0", fontWeight: 700, flex: 1 }}>{m.name}</span>
            {m.time && <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#f59e0b" }}>{m.time}</span>}
            <span style={{ color: m.status === "completed" ? "#22c55e" : m.status === "active" ? "#60a5fa" : "#b45309" }}>
              {STATUS_ICON[m.status]}
            </span>
          </div>
          <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.8vw,7.5px)", color: "#64748b", lineHeight: 1.2, marginBottom: "2.5%" }}>{m.desc}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "2%" }}>
            <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.4vw,6px)", padding: "0 3px",
              borderRadius: 2, background: `${DIFF_COL[m.diff]}22`, border: `1px solid ${DIFF_COL[m.diff]}55`,
              color: DIFF_COL[m.diff], textTransform: "uppercase" }}>{m.diff}</span>
            <Coins size={8} style={{ color: "#f59e0b" }} />
            <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.4vw,6px)", color: "#f59e0b" }}>{m.reward}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: MISSIONS  |  base: master.png + master-buttons.png
//   elements:  master-missions-dialoug  (one per mission row)
// ══════════════════════════════════════════════════════════════════════════════
function MissionsScreen() {
  return (
    <div className="noscroll" style={{ position: "absolute", top: "6%", left: "3.5%", right: "3.5%", bottom: "12.5%",
      display: "flex", flexDirection: "column", gap: "2%", overflowY: "auto" }}>
      {MISSIONS.map(m => <MasterMissionsDialoug key={m.id} m={m} />)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: GEAR > SHIPS  |  base: master-ships.png
//   elements:  master-ships (upper preview panel)
//              master-ship-container  (one per ship card, 3-col scrollable grid)
// ══════════════════════════════════════════════════════════════════════════════
function ShipsScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string>("sh1");
  const selShip = SHIP_LIST.find(s => s.id === selected)!;
  const F = "Orbitron,sans-serif";
  const R = "Rajdhani,sans-serif";

  return (
    <>
      {/* ── Back button ── */}
      <div onClick={onBack} style={{
        position: "absolute", left: "4.5%", top: "6.5%", zIndex: 25,
        cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
      }}>
        <ArrowLeft size={10} style={{ color: "#f59e0b" }} />
        <span style={{ fontFamily: F, fontSize: "min(1.6vw,6.5px)", color: "#f59e0b" }}>GEAR</span>
      </div>

      {/* master-ships — upper preview panel */}
      <div style={{
        position: "absolute", left: "4.3%", right: "4.3%",
        top: "10%", height: "20%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3%",
      }}>
        <LayerLabel name="master-ships (preview)" />
        <div style={{ height: "65%" }}><Spaceship /></div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F, fontSize: "min(2.2vw,9.5px)", color: "#e2e8f0", fontWeight: 700 }}>{selShip.name}</div>
          <div style={{ fontFamily: R, fontSize: "min(1.8vw,8px)", color: "#f59e0b" }}>{selShip.type}</div>
        </div>
      </div>

      {/* ── Transparent SELECT hit-area over image button ── */}
      <div onClick={() => {}}
        style={{ position: "absolute", left: "31.9%", top: "31.9%", width: "36.2%", height: "4.9%", cursor: "pointer", zIndex: 25 }}
      />

      {/* ── Scrollable 3-column card grid (37.5%–87.5%) ── */}
      <div
        className="noscroll"
        style={{
          position: "absolute", left: "4%", right: "4%",
          top: "37.5%", bottom: "12.5%",
          overflowY: "auto",
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "min(2vw, 7px)",
          paddingBottom: "2%",
        }}>
          {SHIP_LIST.map(ship => {
            const isSel = ship.id === selected;
            return (
              <div
                key={ship.id}
                onClick={() => ship.unlocked && setSelected(ship.id)}
                style={{
                  position: "relative",
                  aspectRatio: "3 / 4",
                  borderRadius: "min(2vw,7px)",
                  overflow: "hidden",
                  cursor: ship.unlocked ? "pointer" : "default",
                  outline: isSel ? "2px solid #f59e0b" : "none",
                  outlineOffset: 2,
                  flexShrink: 0,
                }}
              >
                {/* master-ship-container */}
                <img src={masterShipContainerImg} alt={ship.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill", pointerEvents: "none" }} />
                <LayerLabel name="master-ship-container" />
                {/* Content */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "8% 6% 12%",
                }}>
                  {ship.unlocked ? (
                    <>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", opacity: isSel ? 1 : 0.65 }}>
                        <Spaceship />
                      </div>
                      <span style={{ fontFamily: F, fontSize: "min(1.5vw,6px)", color: isSel ? "#f59e0b" : "#94a3b8", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
                        {ship.name}
                      </span>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6%" }}>
                      <Lock size={14} style={{ color: "#2a3a5a" }} />
                      <span style={{ fontFamily: F, fontSize: "min(1.3vw,5px)", color: "#2a3a5a" }}>LOCKED</span>
                    </div>
                  )}
                </div>
                {isSel && (
                  <div style={{ position: "absolute", top: 4, right: 4, width: "min(2vw,8px)", height: "min(2vw,8px)", borderRadius: "50%", background: "#f59e0b" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Talent data (52 talents, 4-column grid) ──────────────────────────────────
const TALENT_DATA = [
  { id:"ta01", name:"Precision",     max:5, desc:"Increase weapon accuracy by 3% per level." },
  { id:"ta02", name:"Rapid Fire",    max:5, desc:"Reduces weapon cooldown by 5% per level." },
  { id:"ta03", name:"Penetrate",     max:5, desc:"Shots pierce 1 extra enemy per 2 levels." },
  { id:"ta04", name:"Overload",      max:3, desc:"Chance to deal 200% damage on crit." },
  { id:"ta05", name:"Iron Plating",  max:5, desc:"Hull integrity +8% per level." },
  { id:"ta06", name:"Shields Up",    max:5, desc:"Shield recharge rate +10% per level." },
  { id:"ta07", name:"Evasion",       max:5, desc:"Dodge chance +4% per level." },
  { id:"ta08", name:"Bulkhead",      max:3, desc:"Survive one lethal hit once per battle." },
  { id:"ta09", name:"Afterburn",     max:5, desc:"Speed boost lasts 20% longer per level." },
  { id:"ta10", name:"Slip Drive",    max:5, desc:"Jump cooldown reduced 8% per level." },
  { id:"ta11", name:"Maneuver",      max:5, desc:"Turn speed +6% per level." },
  { id:"ta12", name:"Void Step",     max:1, desc:"Warp short distances through objects." },
  { id:"ta13", name:"Salvage",       max:5, desc:"Collect 10% more resources per level." },
  { id:"ta14", name:"Repair Bots",   max:5, desc:"Auto-repair 1% hull/sec out of combat." },
  { id:"ta15", name:"Scan Array",    max:5, desc:"Enemy scan range +15% per level." },
  { id:"ta16", name:"Black Market",  max:3, desc:"Unlock discounted rare items in store." },
  { id:"ta17", name:"Capacitor",     max:5, desc:"Energy capacity +10% per level." },
  { id:"ta18", name:"Regen Field",   max:5, desc:"Passive energy regen +2% per level." },
  { id:"ta19", name:"Overdrive",     max:3, desc:"Spend energy to double damage for 5s." },
  { id:"ta20", name:"Arc Link",      max:5, desc:"Chain lightning hits 1 extra target per 2 levels." },
  { id:"ta21", name:"Camo Drive",    max:5, desc:"Cloak duration +10% per level." },
  { id:"ta22", name:"Lock-On",       max:5, desc:"Target lock time reduced 15% per level." },
  { id:"ta23", name:"EMP Surge",     max:3, desc:"Disable enemy shields 3s on hit." },
  { id:"ta24", name:"Deploy Mine",   max:5, desc:"+1 mine per 2 levels." },
  { id:"ta25", name:"Void Lance",    max:5, desc:"Charged shot deals bonus void damage." },
  { id:"ta26", name:"Nano Weave",    max:5, desc:"DoT damage taken -8% per level." },
  { id:"ta27", name:"Debris Field",  max:3, desc:"Leave damaging trail when boosting." },
  { id:"ta28", name:"Gravity Hook",  max:3, desc:"Pull asteroids as cover or projectiles." },
  { id:"ta29", name:"Pulse Wave",    max:5, desc:"Area knockback on activation, 15s CD." },
  { id:"ta30", name:"Warp Strike",   max:1, desc:"Teleport behind target, deal 300% dmg." },
  { id:"ta31", name:"Deep Scan",     max:5, desc:"Reveal hidden caches in exploration zones." },
  { id:"ta32", name:"Fuel Cell",     max:5, desc:"Boost duration +8% per level." },
  { id:"ta33", name:"Resonance",     max:5, desc:"Damage to shielded enemies +5% per level." },
  { id:"ta34", name:"Null Point",    max:3, desc:"Negate one enemy ability every 60s." },
  { id:"ta35", name:"Stasis Web",    max:5, desc:"Slow enemies 5% per level on hit." },
  { id:"ta36", name:"Ion Trail",     max:5, desc:"Damaging ion trail during boost." },
  { id:"ta37", name:"Phantom Shot",  max:3, desc:"Bypass shields on every 3rd shot." },
  { id:"ta38", name:"Quantum Leap",  max:1, desc:"Reset all cooldowns once per mission." },
  { id:"ta39", name:"Focus Lens",    max:5, desc:"Crit chance +3% per level." },
  { id:"ta40", name:"Vortex Core",   max:3, desc:"Create gravity well pulling enemies in." },
  { id:"ta41", name:"Ammo Cache",    max:5, desc:"+2 special ammo per level each mission." },
  { id:"ta42", name:"Shield Bash",   max:3, desc:"Ramming drains enemy energy." },
  { id:"ta43", name:"Spectral Aim",  max:5, desc:"Shots pass through allies penalty-free." },
  { id:"ta44", name:"Void Tap",      max:5, desc:"+1% energy steal per hit per level." },
  { id:"ta45", name:"Blitz Drive",   max:3, desc:"Speed burst auto-triggers on low hull." },
  { id:"ta46", name:"Scatter Shot",  max:5, desc:"Shots split at max range, 2 projectiles." },
  { id:"ta47", name:"Dead Eye",      max:5, desc:"Max-range accuracy +5% per level." },
  { id:"ta48", name:"Reactive Plating",max:3,desc:"Reflect 10% of melee damage taken." },
  { id:"ta49", name:"Wormhole",      max:1, desc:"Open wormhole to any explored sector." },
  { id:"ta50", name:"Celestial Eye", max:5, desc:"See all enemies on sector map." },
  { id:"ta51", name:"Gravity Bomb",  max:3, desc:"Drop a collapsing AoE gravity bomb." },
  { id:"ta52", name:"Mirror Field",  max:3, desc:"Deflect projectiles 20% of the time." },
];

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: SKILLS > TALENTS  |  base: master-melt.png (MELT button unused)
//   elements:  master-melt (upper panel — talent info, points, +/- controls)
//              master-ship-container  (one per talent card, 4-col scrollable grid)
// ══════════════════════════════════════════════════════════════════════════════
function TalentsScreen({ onBack }: { onBack: () => void }) {
  const [lvls, setLvls] = useState<Record<string, number>>(
    () => Object.fromEntries(TALENT_DATA.map(t => [t.id, 0]))
  );
  const [selected, setSelected] = useState("ta01");
  const [points,   setPoints]   = useState(12);

  const sel = TALENT_DATA.find(t => t.id === selected)!;
  const selLv = lvls[selected];

  const add = () => {
    if (points > 0 && selLv < sel.max) {
      setLvls(p => ({ ...p, [selected]: p[selected] + 1 }));
      setPoints(p => p - 1);
    }
  };
  const sub = () => {
    if (selLv > 0) {
      setLvls(p => ({ ...p, [selected]: p[selected] - 1 }));
      setPoints(p => p + 1);
    }
  };

  const F = "Orbitron,sans-serif";
  const R = "Rajdhani,sans-serif";

  return (
    <>
      {/* master-melt — upper panel: talent info */}
      <div style={{
        position: "absolute", left: "4.3%", right: "4.3%",
        top: "6.5%", height: "27%",
        display: "flex", flexDirection: "column",
      }}>
        <LayerLabel name="master-melt (upper panel)" />
        {/* Row 1: back + points indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4%" }}>
          <div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
            <ArrowLeft size={10} style={{ color: "#2563eb" }} />
            <span style={{ fontFamily: F, fontSize: "min(1.6vw,6.5px)", color: "#2563eb" }}>SKILLS</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "4%",
            background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.4)",
            borderRadius: "min(1.5vw,5px)", padding: "1.5% 4%",
          }}>
            <Zap size={9} style={{ color: "#60a5fa" }} />
            <span style={{ fontFamily: F, fontSize: "min(1.6vw,6.5px)", color: "#e2e8f0", letterSpacing: "0.06em" }}>
              TALENT PTS: {points}
            </span>
          </div>
        </div>

        {/* Row 2: selected talent name + level bar */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "3%", marginBottom: "2%" }}>
          <span style={{ fontFamily: F, fontSize: "min(2.2vw,9.5px)", color: "#e2e8f0", fontWeight: 700, flex: 1 }}>{sel.name}</span>
          <span style={{ fontFamily: R, fontSize: "min(1.8vw,7.5px)", color: "#f59e0b" }}>
            Lv {selLv} / {sel.max}
          </span>
        </div>

        {/* Level dots */}
        <div style={{ display: "flex", gap: "min(0.8vw,3px)", marginBottom: "3%" }}>
          {Array.from({ length: sel.max }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: "min(0.8vw,3.5px)", borderRadius: 99,
              background: i < selLv ? "#f59e0b" : "#1a2a4a",
            }} />
          ))}
        </div>

        {/* Description */}
        <div style={{
          fontFamily: R, fontSize: "min(2vw,8.5px)", color: "#94a3b8",
          lineHeight: 1.35, flex: 1,
        }}>{sel.desc}</div>

        {/* Row 3: +/- adjustment buttons */}
        <div style={{ display: "flex", gap: "3%", justifyContent: "flex-end", marginTop: "3%" }}>
          {[{ label: "−", action: sub, active: selLv > 0 }, { label: "+", action: add, active: points > 0 && selLv < sel.max }].map(btn => (
            <button key={btn.label} onClick={btn.action} style={{
              width: "min(8vw,32px)", height: "min(8vw,32px)",
              borderRadius: "min(1.5vw,5px)",
              background: btn.active ? "linear-gradient(135deg,#1e3a5f,#0f2444)" : "#0a1220",
              border: `1.5px solid ${btn.active ? "#2563eb" : "#1a2a4a"}`,
              color: btn.active ? "#60a5fa" : "#2a3a5a",
              fontFamily: F, fontSize: "min(3vw,12px)", fontWeight: 700,
              cursor: btn.active ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: btn.active ? "0 0 8px rgba(37,99,235,0.3)" : "none",
            }}>{btn.label}</button>
          ))}
        </div>
      </div>

      {/* ── Lower grid: 4-col scrollable card grid (34%–87.5%) ── */}
      {/* Starts at 34% to cover the MELT button zone in the background image */}
      <div className="noscroll" style={{
        position: "absolute", left: "3.5%", right: "3.5%",
        top: "34%", bottom: "12.5%",
        overflowY: "auto",
        paddingTop: "1.5%",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "min(1.8vw, 6px)",
          paddingBottom: "2%",
        }}>
          {TALENT_DATA.map(t => {
            const lv  = lvls[t.id];
            const sel2 = t.id === selected;
            return (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "min(1.5vw,5px)",
                  overflow: "hidden",
                  cursor: "pointer",
                  outline: sel2 ? "1.5px solid #f59e0b" : "1.5px solid transparent",
                  outlineOffset: 1,
                }}
              >
                {/* master-ship-container */}
                <img
                  src={masterShipContainerImg}
                  alt=""
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill", pointerEvents: "none" }}
                />
                <LayerLabel name="master-ship-container" />
                {/* Content overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "space-between",
                  padding: "8% 5% 6%",
                }}>
                  {/* Name */}
                  <span style={{
                    fontFamily: F,
                    fontSize: "min(1.4vw,5.5px)",
                    color: sel2 ? "#f59e0b" : "#e2e8f0",
                    fontWeight: 700,
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}>{t.name}</span>

                  {/* Level dots row */}
                  <div style={{ display: "flex", gap: "min(0.5vw,2px)", width: "80%" }}>
                    {Array.from({ length: t.max }).map((_, i) => (
                      <div key={i} style={{
                        flex: 1,
                        height: "min(0.5vw,2px)",
                        borderRadius: 99,
                        background: i < lv ? "#f59e0b" : "#1a2a4a",
                      }} />
                    ))}
                  </div>

                  {/* Level text + SELECT button (sits over pill area of ship container) */}
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "4%" }}>
                    <span style={{ fontFamily: R, fontSize: "min(1.4vw,5.5px)", color: "#64748b" }}>
                      {lv} / {t.max}
                    </span>
                    <div style={{
                      width: "88%",
                      background: sel2 ? "rgba(245,158,11,0.2)" : "rgba(37,99,235,0.25)",
                      border: `1px solid ${sel2 ? "#f59e0b" : "#2563eb"}`,
                      borderRadius: "min(1vw,3px)",
                      padding: "4% 0",
                      textAlign: "center",
                    }}>
                      <span style={{
                        fontFamily: F,
                        fontSize: "min(1.3vw,5px)",
                        color: sel2 ? "#f59e0b" : "#60a5fa",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                      }}>SELECT</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: SKILLS  |  base: master.png + master-buttons.png
//   sub-page: TALENTS  →  master-melt.png + master-ship-container (talent cards)
// ══════════════════════════════════════════════════════════════════════════════
function SkillsScreen({ onTalents }: { onTalents: () => void }) {
  const [levels, setLevels] = useState<Record<string, number>>(() =>
    Object.fromEntries(SKILL_ROWS.flat().map(s => [s.id, s.lv]))
  );

  const upgrade = (id: string) => {
    const node = SKILL_ROWS.flat().find(s => s.id === id)!;
    if (!node.unlocked || levels[id] >= node.max) return;
    setLevels(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  return (
    <div style={{ position: "absolute", top: "6%", left: "4%", right: "4%", bottom: "12.5%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "2%", borderBottom: "1px solid rgba(37,99,235,0.25)", marginBottom: "3%", gap: "3%" }}>
        <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2vw,8.5px)", color: "#2563eb", letterSpacing: "0.12em", flex: 1 }}>
          SKILL BRANCH
        </span>
        <div onClick={onTalents} style={{
          display: "flex", alignItems: "center", gap: "min(1vw,4px)",
          background: "linear-gradient(135deg,#b45309,#92400e)",
          border: "1.5px solid #f59e0b",
          borderRadius: "min(1.5vw,5px)",
          padding: "min(1vw,4px) min(2.5vw,10px)",
          cursor: "pointer",
          boxShadow: "0 0 8px rgba(245,158,11,0.3)",
        }}>
          <Star size={9} style={{ color: "#1a0a00" }} />
          <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.6vw,6.5px)", fontWeight: 700, color: "#1a0a00", letterSpacing: "0.08em" }}>TALENTS</span>
        </div>
      </div>
      <div className="noscroll" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "3%", paddingRight: "1%" }}>
        {SKILL_ROWS.map((row, ri) => (
          <div key={ri}>
            {ri > 0 && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "2%" }}>
                <div style={{ width: 1, height: "min(4vw,18px)", background: "linear-gradient(to bottom, rgba(37,99,235,0.7), rgba(37,99,235,0.2))" }} />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: "4%" }}>
              {row.map((node) => {
                const lv = levels[node.id];
                const maxed = lv >= node.max;
                const locked = !node.unlocked;
                return (
                  <div key={node.id} onClick={() => upgrade(node.id)}
                    style={{ width: "min(27vw,120px)", background: locked ? "#060e18" : "linear-gradient(160deg,#0d1929,#08121e)",
                      border: `1px solid ${locked ? "rgba(37,99,235,0.1)" : maxed ? node.col + "80" : "rgba(37,99,235,0.45)"}`,
                      borderRadius: 8, padding: "4%", display: "flex", flexDirection: "column", alignItems: "center", gap: "5%",
                      opacity: locked ? 0.4 : 1, cursor: locked ? "default" : "pointer",
                      boxShadow: !locked && !maxed ? "0 0 10px rgba(37,99,235,0.15)" : "none" }}>
                    <div style={{ width: "min(8vw,32px)", height: "min(8vw,32px)", borderRadius: "50%",
                      background: locked ? "#111" : `${node.col}22`,
                      border: `1px solid ${locked ? "#1a2a4a" : node.col}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: locked ? "#2a3a5a" : node.col }}>
                      {locked ? <Lock size={12} /> : <Zap size={12} />}
                    </div>
                    <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.6vw,7px)", color: locked ? "#2a3a5a" : "#e2e8f0", textAlign: "center", lineHeight: 1.3 }}>
                      {node.name}
                    </span>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: node.max }).map((_, i) => (
                        <div key={i} style={{ width: "min(1.6vw,7px)", height: "min(0.7vw,3px)", borderRadius: 2,
                          background: i < lv ? node.col : "#1a2a4a" }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.6vw,7px)", color: maxed ? node.col : "#64748b" }}>
                      {maxed ? "MAXED" : locked ? "LOCKED" : `${node.cost} cr`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: STORE  |  base: master.png + master-buttons.png
//   reference:  master-store.png  (layout guide — CREDITS + GOLD STARS sections)
//   elements:   master-store-container  (one per item card, 4-col grid)
// ══════════════════════════════════════════════════════════════════════════════

// master-store-container — individual store item card
// Styled to match master-store-container.png: amber face, dark strip, blue pill.
function MasterStoreContainer({ name, label, icon, owned, onBuy }: {
  name: string; label: string; icon: React.ReactNode; owned: boolean; onBuy: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", borderRadius: "min(1.5vw,6px)", overflow: "hidden",
      position: "relative",
      border: `1.5px solid ${owned ? "#60a5fa88" : "#92400e"}`,
      boxShadow: owned ? "0 0 8px rgba(96,165,250,0.2)" : "none",
      cursor: "pointer" }} onClick={onBuy}>
      <LayerLabel name="master-store-container" />
      {/* Amber top area — matches gold card face */}
      <div style={{ flex: 1, background: "linear-gradient(170deg,#b45309 0%,#92400e 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "12% 0 8%" }}>
        <div style={{ color: owned ? "#bfdbfe" : "#1a0a00", opacity: owned ? 0.7 : 1 }}>{icon}</div>
      </div>
      {/* Dark lower strip */}
      <div style={{ background: "#1a1008", padding: "4% 6% 2%" }}>
        <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(1.3vw,5.5px)", color: owned ? "#60a5fa" : "#e2e8f0",
          textAlign: "center", lineHeight: 1.2, marginBottom: "4%" }}>{name}</div>
        {/* Blue pill button */}
        <div style={{ background: owned ? "#1e3a5f" : "#1d4ed8", borderRadius: "min(1vw,4px)",
          padding: "3% 0", textAlign: "center",
          border: `1px solid ${owned ? "#3b82f6" : "#60a5fa"}` }}>
          <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "min(1.4vw,6px)", fontWeight: 700,
            color: owned ? "#60a5fa" : "#bfdbfe" }}>{owned ? "OWNED" : label}</span>
        </div>
      </div>
    </div>
  );
}

function StoreScreen() {
  const [owned, setOwned] = useState<string[]>([]);
  const toggle = (id: string) => setOwned(o => o.includes(id) ? o.filter(x => x !== id) : [...o, id]);

  return (
    <div className="noscroll" style={{ position: "absolute", top: "6%", left: "3.5%", right: "3.5%", bottom: "12.5%",
      display: "flex", flexDirection: "column", overflowY: "auto" }}>

      {/* CREDITS section */}
      <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2vw,8.5px)", color: "#e2e8f0",
        textAlign: "center", letterSpacing: "0.18em", padding: "2% 0",
        background: "linear-gradient(90deg,transparent,rgba(37,99,235,0.15),transparent)",
        borderTop: "1px solid rgba(37,99,235,0.4)", borderBottom: "1px solid rgba(37,99,235,0.4)",
        marginBottom: "2%" }}>
        CREDITS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2%", marginBottom: "3%" }}>
        {CREDITS_ITEMS.map(item => (
          <MasterStoreContainer key={item.id} name={item.name} label={item.price} icon={item.icon}
            owned={owned.includes(item.id)} onBuy={() => toggle(item.id)} />
        ))}
      </div>

      {/* GOLD STARS section */}
      <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: "min(2vw,8.5px)", color: "#e2e8f0",
        textAlign: "center", letterSpacing: "0.18em", padding: "2% 0",
        background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.15),transparent)",
        borderTop: "1px solid rgba(245,158,11,0.4)", borderBottom: "1px solid rgba(245,158,11,0.4)",
        marginBottom: "2%" }}>
        GOLD STARS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2%", paddingBottom: "2%" }}>
        {GOLD_ITEMS.map(item => (
          <MasterStoreContainer key={item.id} name={item.name} label={`★ ${item.stars}`} icon={item.icon}
            owned={owned.includes(item.id)} onBuy={() => toggle(item.id)} />
        ))}
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,     setActiveTab]     = useState<NavTab>("home");
  const [inventoryMode, setInventoryMode] = useState<InventoryMode>("main");
  const [skillsMode,    setSkillsMode]    = useState<"tree" | "talents">("tree");
  const [credits] = useState(48200);
  const [gold]    = useState(320);

  // Determine which background image stack to use
  type BgStack = { base: string; buttons?: string };
  const getBg = (): BgStack => {
    if (activeTab === "inventory") {
      if (inventoryMode === "forge") return { base: masterForgeImg };
      if (inventoryMode === "melt")  return { base: masterMeltImg };
      if (inventoryMode === "ships") return { base: masterShipsImg };
      return { base: masterGearImg };
    }
    if (activeTab === "skills" && skillsMode === "talents") return { base: masterMeltImg };
    return { base: masterImg, buttons: masterButtonsImg };
  };
  const bg = getBg();

  const handleNavSelect = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "inventory") setInventoryMode("main");
    if (tab !== "skills") setSkillsMode("tree");
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#020609" }}>
      {/* Game frame container – 768:1366 aspect ratio */}
      <div
        style={{
          position: "relative",
          width: "min(420px, 100vw)",
          aspectRatio: "768 / 1366",
          overflow: "hidden",
        }}
      >
        {/* ── Layer 1: Screen background ── */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`bg-${activeTab}-${inventoryMode}-${skillsMode}`}
            src={bg.base}
            alt=""
            style={{ ...ABS, zIndex: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        </AnimatePresence>

        {/* ── Layer 2: master-buttons.png (screens without baked-in buttons) ── */}
        {bg.buttons && (
          <img src={bg.buttons} alt="" style={{ ...ABS, zIndex: 1, pointerEvents: "none" }} />
        )}

        {/* ── Layer 3: master-currency.png (always) ── */}
        <img src={masterCurrencyImg} alt="" style={{ ...ABS, zIndex: 2, pointerEvents: "none" }} />

        {/* ── Layer 4: MasterCurrency — value text overlaid on pill graphics ── */}
        <MasterCurrency credits={credits} gold={gold} />

        {/* ── Layer 5: Screen content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${activeTab}-${inventoryMode}-${skillsMode}`}
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "home"      && <HomeScreen />}
            {activeTab === "store"     && <StoreScreen />}
            {activeTab === "skills" && skillsMode === "tree" && (
              <SkillsScreen onTalents={() => setSkillsMode("talents")} />
            )}
            {activeTab === "skills" && skillsMode === "talents" && (
              <TalentsScreen onBack={() => setSkillsMode("tree")} />
            )}
            {activeTab === "missions"  && <MissionsScreen />}
            {activeTab === "inventory" && inventoryMode === "main"  && (
              <GearMainScreen
                onForge={() => setInventoryMode("forge")}
                onMelt={() => setInventoryMode("melt")}
                onShips={() => setInventoryMode("ships")}
              />
            )}
            {activeTab === "inventory" && inventoryMode === "forge" && (
              <ForgeScreen onBack={() => setInventoryMode("main")} />
            )}
            {activeTab === "inventory" && inventoryMode === "melt" && (
              <MeltScreen onBack={() => setInventoryMode("main")} />
            )}
            {activeTab === "inventory" && inventoryMode === "ships" && (
              <ShipsScreen onBack={() => setInventoryMode("main")} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Layer 6: MasterButtons — nav click overlays (always on top) ── */}
        <MasterButtons active={activeTab} onSelect={handleNavSelect} />
      </div>
    </div>
  );
}
