// Phase 5 - File #59
// frontend/src/pages/dashboard/CenterDetail.jsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import CapacityBar from "../../components/dashboard/CapacityBar";
import AgentSwarmPanel from "../../components/dashboard/AgentSwarmPanel";

const MOCK_CENTER = {
  id: 1, name: "Dharavi Relief Hub", address: "Dharavi, Mumbai", status: "online",
  onlineSince: "Today, 06:00 AM", doctor_count: 8, nurse_count: 20, paramedic_count: 10,
  surgeon_count: 2, icu_nurse_count: 5, staff_count: 42, occupied_beds: 680, total_beds: 800,
};

const MOCK_INVENTORY = [
  { id: 1, item_name: "Food Packets",  quantity: 1200, unit: "pcs",  threshold: 500 },
  { id: 2, item_name: "Water",         quantity: 380,  unit: "L",    threshold: 500 },
  { id: 3, item_name: "Blankets",      quantity: 600,  unit: "pcs",  threshold: 200 },
  { id: 4, item_name: "Medical Kits",  quantity: 95,   unit: "kits", threshold: 50  },
  { id: 5, item_name: "Medicines",     quantity: 310,  unit: "pcs",  threshold: 100 },
  { id: 6, item_name: "Blood Units",   quantity: 45,   unit: "bags", threshold: 20  },
];

const MOCK_PERSONNEL = [
  { id: 1, name: "Dr. Aisha Patel",  role: "Doctor",    shift_start: "07:00", shift_end: "19:00", status: "on_duty" },
  { id: 2, name: "Nurse Ravi Mehta", role: "Nurse",     shift_start: "08:00", shift_end: "20:00", status: "on_duty" },
  { id: 3, name: "Para. Sonal Khan", role: "Paramedic", shift_start: "06:00", shift_end: "18:00", status: "on_duty" },
  { id: 4, name: "Dr. Vikram Singh", role: "Surgeon",   shift_start: "09:00", shift_end: "21:00", status: "on_break" },
];

const MOCK_FLEET = [
  { id: "AMB-01", type: "ambulance", status: "idle",       task: "—" },
  { id: "AMB-02", type: "ambulance", status: "on_mission", task: "Extraction — Dharavi Station" },
  { id: "TRK-01", type: "truck",     status: "idle",       task: "—" },
  { id: "BUS-01", type: "bus",       status: "on_mission", task: "Evacuation run — Kurla depot" },
  { id: "AMB-03", type: "ambulance", status: "maintenance",task: "Scheduled service" },
];

const MOCK_LOGS = [
  { id: 1, agent: "Dispatcher",    time: "14:42", type: "dispatch",  desc: "Assigned AMB-02 to extraction at Dharavi Station." },
  { id: 2, agent: "Healer",        time: "14:38", type: "medical",   desc: "Cardiac patient redirected to Powai Medical Annex." },
  { id: 3, agent: "Quartermaster", time: "14:20", type: "supply",    desc: "Low water alert. Resupply convoy initiated." },
  { id: 4, agent: "Reporter",      time: "14:00", type: "sitrep",    desc: "SITREP #7 generated and dispatched to command." },
  { id: 5, agent: "Soldier",       time: "13:50", type: "report",    desc: "Periodic status broadcast sent. 680 sheltered." },
];

const TABS = ["Overview", "Agents", "Inventory", "Personnel", "Fleet", "Logs"];

const STATUS_BADGE_CLS = {
  online:  "text-green-400 bg-green-400/10 border border-green-700/40",
  full:    "text-red-400 bg-red-400/10 border border-red-700/40",
  offline: "text-slate-400 bg-slate-400/10 border border-slate-600/40",
};

const VEHICLE_STATUS_CLS = {
  idle:        "text-green-400",
  on_mission:  "text-yellow-400",
  maintenance: "text-slate-400",
};

const STAFF_STATUS_CLS = {
  on_duty:  "text-green-400",
  on_break: "text-yellow-400",
  off_duty: "text-slate-400",
};

export default function CenterDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const center = MOCK_CENTER; // later: fetch by id

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{center.name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_BADGE_CLS[center.status]}`}>
              {center.status}
            </span>
          </div>
          <p className="text-sm text-slate-400">📍 {center.address} · Online since {center.onlineSince}</p>
        </div>
        <button className="text-sm font-semibold text-slate-300 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          Edit Center
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === t ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Beds Occupied"   value={center.occupied_beds} sub={`of ${center.total_beds} total`} icon="🛏" variant="blue" />
            <StatCard label="Doctors"         value={center.doctor_count}  sub="Active medical staff"            icon="👨‍⚕️" variant="green" />
            <StatCard label="Total Staff"     value={center.staff_count}   sub="Including support staff"         icon="👥" variant="orange" />
            <StatCard label="Nurses"          value={center.nurse_count}   sub={`${center.icu_nurse_count} ICU nurses`} icon="🩺" variant="red" />
          </div>
          <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Bed Capacity</p>
            <CapacityBar occupied={center.occupied_beds} total={center.total_beds} />
            <p className="text-sm text-slate-300 mt-2">{center.occupied_beds} / {center.total_beds} beds occupied</p>
          </div>
        </div>
      )}

      {/* Agents */}
      {activeTab === "Agents" && <AgentSwarmPanel centerName={center.name} />}

      {/* Inventory */}
      {activeTab === "Inventory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_INVENTORY.map((item) => {
            const pct = Math.min(100, Math.round((item.quantity / (item.threshold * 3)) * 100));
            return (
              <div key={item.id} className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-4">
                <p className="font-bold text-white text-sm mb-1">{item.item_name}</p>
                <p className="text-2xl font-bold text-white mb-2">{item.quantity} <span className="text-sm text-slate-400">{item.unit}</span></p>
                <CapacityBar occupied={item.quantity} total={item.threshold * 3} showLabel={false} />
                {item.quantity <= item.threshold && (
                  <p className="text-xs text-yellow-400 mt-1">⚠ Below threshold ({item.threshold} {item.unit})</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Personnel */}
      {activeTab === "Personnel" && (
        <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <th className="text-left py-2 pr-4">Name</th>
                <th className="text-left py-2 pr-4">Role</th>
                <th className="text-left py-2 pr-4">Shift Start</th>
                <th className="text-left py-2 pr-4">Shift End</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PERSONNEL.map((p) => (
                <tr key={p.id} className="border-b border-slate-800/50 last:border-0">
                  <td className="py-2.5 pr-4 font-semibold text-white">{p.name}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{p.role}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{p.shift_start}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{p.shift_end}</td>
                  <td className={`py-2.5 font-semibold capitalize ${STAFF_STATUS_CLS[p.status]}`}>{p.status.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Fleet */}
      {activeTab === "Fleet" && (
        <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <th className="text-left py-2 pr-4">ID</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-left py-2 pr-4">Status</th>
                <th className="text-left py-2">Current Task</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_FLEET.map((v) => (
                <tr key={v.id} className="border-b border-slate-800/50 last:border-0">
                  <td className="py-2.5 pr-4 font-mono font-bold text-white">{v.id}</td>
                  <td className="py-2.5 pr-4 text-slate-300 capitalize">{v.type}</td>
                  <td className={`py-2.5 pr-4 font-semibold capitalize ${VEHICLE_STATUS_CLS[v.status]}`}>{v.status.replace("_", " ")}</td>
                  <td className="py-2.5 text-slate-400">{v.task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Logs */}
      {activeTab === "Logs" && (
        <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5 space-y-3">
          {MOCK_LOGS.map((log) => (
            <div key={log.id} className="flex items-start gap-3 border-b border-slate-800 pb-3 last:border-0">
              <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap mt-0.5">{log.time}</span>
              <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-700/40 px-1.5 py-0.5 rounded font-semibold shrink-0">{log.type}</span>
              <div>
                <span className="text-xs font-bold text-blue-400">{log.agent}: </span>
                <span className="text-xs text-slate-300">{log.desc}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
