// Phase 5 - File #57
// frontend/src/pages/dashboard/NetworkMap.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NetworkMapView from "../../components/map/NetworkMapView";
import CapacityBar from "../../components/dashboard/CapacityBar";

const ALL_CENTERS = [
  { id: 1, name: "Dharavi Relief Hub",   lat: 19.0411, lng: 72.8535, status: "online", occupied_beds: 680, total_beds: 800, doctor_count: 8,  vehicle_count: 5, lastAgentAction: "Dispatcher assigned AMB-02" },
  { id: 2, name: "Andheri North Center", lat: 19.1136, lng: 72.8697, status: "online", occupied_beds: 310, total_beds: 400, doctor_count: 5,  vehicle_count: 3, lastAgentAction: "Quartermaster: low water alert" },
  { id: 3, name: "Kurla East Station",   lat: 19.0728, lng: 72.8826, status: "full",   occupied_beds: 395, total_beds: 400, doctor_count: 4,  vehicle_count: 2, lastAgentAction: "Healer: cardiac patient redirected" },
  { id: 4, name: "Chembur Shelter",      lat: 19.0620, lng: 72.8997, status: "online", occupied_beds: 200, total_beds: 500, doctor_count: 6,  vehicle_count: 4, lastAgentAction: "Soldier: status report sent" },
  { id: 5, name: "Powai Medical Annex",  lat: 19.1197, lng: 72.9071, status: "online", occupied_beds: 120, total_beds: 300, doctor_count: 12, vehicle_count: 3, lastAgentAction: "Reporter: SITREP #7 generated" },
];

const FILTERS = ["All", "Online", "Near Full", "Full"];

const STATUS_BADGE = {
  online: "text-green-400 bg-green-400/10 border border-green-700/40",
  full:   "text-red-400 bg-red-400/10 border border-red-700/40",
  offline:"text-slate-400 bg-slate-400/10 border border-slate-600/40",
};

export default function NetworkMap() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [selectedCenter, setSelectedCenter] = useState(null);

  const filtered = ALL_CENTERS.filter((c) => {
    if (filter === "All")      return true;
    if (filter === "Online")   return c.status === "online";
    if (filter === "Full")     return c.status === "full";
    if (filter === "Near Full") {
      const pct = (c.occupied_beds / c.total_beds) * 100;
      return pct >= 70 && pct < 100;
    }
    return true;
  });

  return (
    <div className="relative h-[calc(100vh-64px)] bg-[#060d1a] flex flex-col">
      {/* Filter pills */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filter === f
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-[#0d1526]/90 border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1">
        <NetworkMapView centers={filtered} onSelectCenter={setSelectedCenter} />
      </div>

      {/* Slide-in panel */}
      {selectedCenter && (
        <div className="absolute top-0 right-0 h-full w-72 bg-[#0d1526]/98 border-l border-slate-700 p-5 shadow-2xl overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-bold text-white text-base leading-tight">{selectedCenter.name}</h2>
            <button onClick={() => setSelectedCenter(null)} className="text-slate-500 hover:text-white text-xl">×</button>
          </div>

          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_BADGE[selectedCenter.status]}`}>
            {selectedCenter.status}
          </span>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Capacity</p>
              <CapacityBar occupied={selectedCenter.occupied_beds} total={selectedCenter.total_beds} />
              <p className="text-xs text-slate-300 mt-1">{selectedCenter.occupied_beds} / {selectedCenter.total_beds} beds</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Doctors", value: selectedCenter.doctor_count },
                { label: "Vehicles", value: selectedCenter.vehicle_count },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/60 rounded-lg p-3 text-center">
                  <p className="text-base font-bold text-white">{value}</p>
                  <p className="text-[11px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3">
              <p className="text-[11px] text-slate-500 mb-1">Last Agent Action</p>
              <p className="text-xs text-slate-300">{selectedCenter.lastAgentAction}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/dashboard/centers/${selectedCenter.id}`)}
            className="mt-5 w-full py-2 text-xs font-semibold text-blue-400 border border-blue-700/50 rounded-lg hover:bg-blue-900/20 transition-colors"
          >
            View Center →
          </button>
        </div>
      )}
    </div>
  );
}
