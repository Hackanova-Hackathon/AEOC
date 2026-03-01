// Phase 5 - File #63
// frontend/src/pages/dashboard/Inventory.jsx

import { useState } from "react";
import CapacityBar from "../../components/dashboard/CapacityBar";

const CENTERS = [
  { id: "all", name: "All Centers" },
  { id: 1, name: "Dharavi Relief Hub" },
  { id: 2, name: "Andheri North Center" },
  { id: 3, name: "Kurla East Station" },
  { id: 4, name: "Chembur Shelter" },
  { id: 5, name: "Powai Medical Annex" },
];

const SUPPLY_ITEMS = [
  { id: 1, name: "Food Packets", icon: "🍱", unit: "pcs",  quantity: 1200, max: 2000, threshold: 500, restocked: "2 hrs ago" },
  { id: 2, name: "Water",        icon: "💧", unit: "L",    quantity: 380,  max: 1000, threshold: 400, restocked: "5 hrs ago" },
  { id: 3, name: "Blankets",     icon: "🛏", unit: "pcs",  quantity: 600,  max: 1000, threshold: 200, restocked: "Yesterday" },
  { id: 4, name: "Medical Kits", icon: "🩺", unit: "kits", quantity: 95,   max: 200,  threshold: 50,  restocked: "3 hrs ago" },
  { id: 5, name: "Medicines",    icon: "💊", unit: "pcs",  quantity: 310,  max: 500,  threshold: 100, restocked: "1 hr ago"  },
  { id: 6, name: "Blood Units",  icon: "🩸", unit: "bags", quantity: 45,   max: 100,  threshold: 20,  restocked: "6 hrs ago" },
];

function pct(qty, max) { return Math.min(100, Math.round((qty / max) * 100)); }

function SupplyCard({ item }) {
  const p = pct(item.quantity, item.max);
  const isLow = item.quantity <= item.threshold;
  const isCritical = item.quantity <= item.threshold * 0.25;

  return (
    <div className={`bg-[#0d1526] rounded-xl border p-5 ${isCritical ? "border-red-700/60" : isLow ? "border-yellow-700/50" : "border-slate-700/50"}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl">{item.icon}</span>
        {isLow && (
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isCritical ? "text-red-400 bg-red-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
            {isCritical ? "⛔ Critical" : "⚠ Low"}
          </span>
        )}
      </div>
      <p className="font-bold text-white text-sm mb-1">{item.name}</p>
      <p className="text-2xl font-bold text-white mb-2">
        {item.quantity} <span className="text-sm text-slate-400 font-normal">{item.unit}</span>
      </p>

      {/* Inverted bar — fills red as it empties */}
      <div className="w-full bg-slate-700 rounded-full h-[6px] overflow-hidden mb-1">
        <div
          style={{ width: `${p}%` }}
          className={`h-full rounded-full transition-all ${p <= 25 ? "bg-red-500" : p <= 50 ? "bg-yellow-400" : "bg-green-500"}`}
        />
      </div>
      <p className="text-[11px] text-slate-500 mb-3">
        Threshold: {item.threshold} {item.unit} · Restocked {item.restocked}
      </p>

      <button className="w-full py-1.5 text-xs font-semibold text-blue-400 border border-blue-700/40 rounded-lg hover:bg-blue-900/20 transition-colors">
        Request Resupply
      </button>
    </div>
  );
}

export default function Inventory() {
  const [centerId, setCenterId] = useState("all");

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        <select
          value={centerId}
          onChange={(e) => setCenterId(e.target.value)}
          className="bg-[#0d1526] border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
        >
          {CENTERS.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SUPPLY_ITEMS.map((item) => <SupplyCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
