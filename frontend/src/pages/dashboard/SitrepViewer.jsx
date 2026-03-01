// Phase 5 - File #64
// frontend/src/pages/dashboard/SitrepViewer.jsx

import { useState } from "react";

const MOCK_SITREPS = [
  {
    id: 7, center: "Dharavi Relief Hub", generated_at: "Today, 14:42",
    content: "SITUATION: Active flood emergency in Dharavi zone. 680 of 800 beds occupied. Critical influx expected in next 3 hours as water levels rise near the western railway line.\n\nRESOURCES: Water supply at 38% — resupply convoy en route. Medical kits sufficient for 48h. Blood bank has O+ and A+ units available. 8 doctors, 20 nurses, 10 paramedics on duty.\n\nACTIONS TAKEN: Ambulance AMB-02 dispatched for extraction at Dharavi Station. Cardiac patient redirected to Powai Medical Annex. Quartermaster initiated emergency water resupply.\n\nIMMEDIATE NEEDS: 200 additional blankets, water resupply within 4 hours, 2 additional paramedics requested from Andheri Center.\n\nOUTLOOK: Situation is manageable with current resources. Potential overflow in 6-8 hours if influx continues at current rate. Recommend activating Chembur Shelter as overflow center.",
    stats: { sheltered: 680, vehicles: 5, pending: 14 },
  },
  {
    id: 6, center: "Andheri North Center", generated_at: "Today, 13:00",
    content: "SITUATION: Flood waters receding in Andheri West. 310 of 400 beds occupied. Controlled situation with no critical cases in the last 2 hours.\n\nRESOURCES: All supplies above threshold. Medical staff adequate for current load. One truck idle and available for redeployment.\n\nACTIONS TAKEN: Supply truck dispatched to Kurla East Station with food packets and blankets. Liaison routed 12 WhatsApp inquiries.\n\nIMMEDIATE NEEDS: No critical needs at this time. Routine resupply scheduled in 24 hours.\n\nOUTLOOK: Stable. Capacity available to accept overflow from Dharavi or Kurla if needed.",
    stats: { sheltered: 310, vehicles: 3, pending: 4 },
  },
  {
    id: 5, center: "Kurla East Station", generated_at: "Today, 12:15",
    content: "SITUATION: Center at full capacity. 395 of 400 beds occupied. No new intake being accepted. Overflow patients being redirected to Chembur Shelter.\n\nRESOURCES: Food packets adequate. Blankets critically low at 80 units. Medicines running low — threshold breached.\n\nACTIONS TAKEN: Diplomat requested blanket transfer from Andheri. Quartermaster sent emergency medicine resupply request. Two vehicles on active extraction missions.\n\nIMMEDIATE NEEDS: Blankets (200+ units), medicines, additional medical staff (1 surgeon needed).\n\nOUTLOOK: Critical. Overflow likely within 2 hours. Requesting immediate resource reallocation.",
    stats: { sheltered: 395, vehicles: 2, pending: 22 },
  },
];

function MiniStat({ label, value }) {
  return (
    <div className="bg-slate-800/60 rounded-lg p-2 text-center">
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

export default function SitrepViewer() {
  const [openSitrep, setOpenSitrep] = useState(null);

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Situation Reports</h1>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Generate Now
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_SITREPS.map((s) => (
          <div key={s.id} className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-700/40 px-2 py-1 rounded-full font-bold">
                  SITREP #{s.id}
                </span>
                <div>
                  <p className="font-bold text-white text-sm">{s.center}</p>
                  <p className="text-[11px] text-slate-500">Generated {s.generated_at}</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">{s.content}</p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <MiniStat label="Sheltered"  value={s.stats.sheltered} />
              <MiniStat label="Vehicles"   value={s.stats.vehicles} />
              <MiniStat label="Pending"    value={s.stats.pending} />
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                ⬇ Download PDF
              </button>
              <button
                onClick={() => setOpenSitrep(s)}
                className="flex-1 py-1.5 text-xs font-semibold text-blue-400 border border-blue-700/50 rounded-lg hover:bg-blue-900/20 transition-colors"
              >
                View Full →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openSitrep && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setOpenSitrep(null)}
        >
          <div
            className="bg-[#0d1526] border border-slate-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div>
                <h2 className="font-bold text-white">SITREP #{openSitrep.id} — {openSitrep.center}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{openSitrep.generated_at}</p>
              </div>
              <button onClick={() => setOpenSitrep(null)} className="text-slate-500 hover:text-white text-xl">×</button>
            </div>
            <div className="overflow-y-auto p-5">
              {openSitrep.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-slate-300 leading-relaxed mb-4 last:mb-0">
                  {para.split("\n").map((line, j) => (
                    <span key={j}>
                      {line.startsWith("SITUATION:") || line.startsWith("RESOURCES:") || line.startsWith("ACTIONS TAKEN:") || line.startsWith("IMMEDIATE NEEDS:") || line.startsWith("OUTLOOK:")
                        ? <strong className="text-white">{line}</strong>
                        : line}
                      {j < para.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
