// Phase 5 - File #58
// frontend/src/pages/dashboard/CentersList.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CentersTable from "../../components/dashboard/CentersTable";

const MOCK_CENTERS = [
  { id: 1, name: "Dharavi Relief Hub",   address: "Dharavi, Mumbai",  doctor_count: 8,  staff_count: 42, occupied_beds: 680, total_beds: 800, vehicle_count: 5, status: "online" },
  { id: 2, name: "Andheri North Center", address: "Andheri, Mumbai",  doctor_count: 5,  staff_count: 28, occupied_beds: 310, total_beds: 400, vehicle_count: 3, status: "online" },
  { id: 3, name: "Kurla East Station",   address: "Kurla, Mumbai",    doctor_count: 4,  staff_count: 20, occupied_beds: 395, total_beds: 400, vehicle_count: 2, status: "full"   },
  { id: 4, name: "Chembur Shelter",      address: "Chembur, Mumbai",  doctor_count: 6,  staff_count: 35, occupied_beds: 200, total_beds: 500, vehicle_count: 4, status: "online" },
  { id: 5, name: "Powai Medical Annex",  address: "Powai, Mumbai",    doctor_count: 12, staff_count: 55, occupied_beds: 120, total_beds: 300, vehicle_count: 3, status: "online" },
];

const STATUS_TABS = ["All", "Online", "Full", "Offline"];

export default function CentersList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filtered = MOCK_CENTERS.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "All" ||
      c.status === activeTab.toLowerCase();
    return matchSearch && matchTab;
  });

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Relief Centers</h1>
          <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-700/40 px-2 py-0.5 rounded-full font-semibold">
            {MOCK_CENTERS.length} centers
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard/centers/boot")}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Boot New Center
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <input
          type="text"
          placeholder="Search centers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0d1526] border border-slate-700 text-white placeholder-slate-500 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600 w-full sm:w-72"
        />

        {/* Status filter tabs */}
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-semibold">No centers found</p>
        </div>
      ) : (
        <CentersTable centers={filtered} />
      )}
    </div>
  );
}
