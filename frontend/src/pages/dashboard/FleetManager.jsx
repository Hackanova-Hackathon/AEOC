// Phase 5 - File #62
// frontend/src/pages/dashboard/FleetManager.jsx

import { useState } from "react";

const VEHICLES = [
  { id: "AMB-01", type: "ambulance", center: "Dharavi Relief Hub",   centerId: 1, status: "idle",        task: "—",                          updated: "5 min ago" },
  { id: "AMB-02", type: "ambulance", center: "Dharavi Relief Hub",   centerId: 1, status: "on_mission",  task: "Extraction — Dharavi Station", updated: "2 min ago" },
  { id: "AMB-03", type: "ambulance", center: "Andheri North Center", centerId: 2, status: "idle",        task: "—",                          updated: "10 min ago"},
  { id: "TRK-01", type: "truck",     center: "Chembur Shelter",      centerId: 4, status: "idle",        task: "—",                          updated: "15 min ago"},
  { id: "TRK-02", type: "truck",     center: "Andheri North Center", centerId: 2, status: "on_mission",  task: "Supply run — Kurla depot",    updated: "3 min ago" },
  { id: "BUS-01", type: "bus",       center: "Powai Medical Annex",  centerId: 5, status: "on_mission",  task: "Evacuation — Ghatkopar",     updated: "6 min ago" },
  { id: "AMB-04", type: "ambulance", center: "Kurla East Station",   centerId: 3, status: "maintenance", task: "Scheduled service",          updated: "1 hr ago"  },
  { id: "BUS-02", type: "bus",       center: "Chembur Shelter",      centerId: 4, status: "idle",        task: "—",                          updated: "30 min ago"},
];

const TYPE_ICON = { ambulance: "🚑", truck: "🚛", bus: "🚌" };

const STATUS_CLS = {
  idle:        "text-green-400 bg-green-400/10 border-green-700/40",
  on_mission:  "text-yellow-400 bg-yellow-400/10 border-yellow-700/40",
  maintenance: "text-slate-400 bg-slate-400/10 border-slate-600/40",
};

function statCount(status) { return VEHICLES.filter((v) => v.status === status).length; }

export default function FleetManager() {
  const [view, setView] = useState("table");

  const stats = [
    { label: "Total",       value: VEHICLES.length, icon: "🚗", variant: "blue" },
    { label: "On Mission",  value: statCount("on_mission"),  icon: "🚨", variant: "yellow" },
    { label: "Idle",        value: statCount("idle"),        icon: "✅", variant: "green" },
    { label: "Maintenance", value: statCount("maintenance"), icon: "🔧", variant: "slate" },
  ];

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Fleet Manager</h1>
        {/* View toggle */}
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {["table", "map"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                view === v ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {v === "table" ? "📋 Table" : "🗺 Map"}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-4 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-xs text-slate-400 font-semibold">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table view */}
      {view === "table" && (
        <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <th className="text-left py-2 pr-4">Vehicle ID</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-left py-2 pr-4">Assigned Center</th>
                <th className="text-left py-2 pr-4">Status</th>
                <th className="text-left py-2 pr-4">Current Task</th>
                <th className="text-left py-2">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map((v) => (
                <tr key={v.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                  <td className="py-2.5 pr-4 font-mono font-bold text-white">{v.id}</td>
                  <td className="py-2.5 pr-4 text-slate-300 capitalize">
                    {TYPE_ICON[v.type]} {v.type}
                  </td>
                  <td className="py-2.5 pr-4 text-blue-400 hover:underline cursor-pointer">{v.center}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold capitalize ${STATUS_CLS[v.status]}`}>
                      {v.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">{v.task}</td>
                  <td className="py-2.5 text-slate-500">{v.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map view placeholder */}
      {view === "map" && (
        <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 h-96 flex items-center justify-center">
          <p className="text-slate-500 text-sm">🗺 Vehicle map view — wire Google Maps + vehicle pins in Phase 6</p>
        </div>
      )}
    </div>
  );
}
