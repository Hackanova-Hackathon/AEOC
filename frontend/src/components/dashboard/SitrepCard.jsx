// Phase 4 - File #52
// frontend/src/components/dashboard/SitrepCard.jsx

const MOCK_SITREP = {
  id: 7,
  title: "SITREP #7 — Dharavi Relief Hub",
  timestamp: "Today, 14:42",
  content:
    "SITUATION: Active flood emergency in Dharavi zone. 680 of 800 beds occupied. Critical influx expected in next 3 hours as water levels rise near the western railway line. RESOURCES: Water supply at 38% — resupply convoy en route. Medical kits sufficient for 48h. Blood bank has O+ and A+ units available. ACTIONS TAKEN: Ambulance AMB-02 dispatched for extraction at Dharavi Station. Cardiac patient redirected to Powai Medical Annex. Quartermaster initiated emergency water resupply.",
  stats: { sheltered: 680, pending: 14, vehicles: 5 },
};

export default function SitrepCard({ sitrep }) {
  const s = sitrep ?? MOCK_SITREP;

  return (
    <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl">📋</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm leading-tight">{s.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{s.timestamp}</p>
        </div>
      </div>

      {/* Content preview */}
      <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 mb-3">{s.content}</p>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Sheltered", value: s.stats.sheltered },
          { label: "Pending",   value: s.stats.pending },
          { label: "Vehicles",  value: s.stats.vehicles },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-800/60 rounded-lg p-2 text-center">
            <p className="text-base font-bold text-white">{value}</p>
            <p className="text-[11px] text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
          ⬇ Download
        </button>
        <button className="flex-1 py-1.5 text-xs font-semibold text-blue-400 border border-blue-700/50 rounded-lg hover:bg-blue-900/20 transition-colors">
          View Full →
        </button>
      </div>
    </div>
  );
}
