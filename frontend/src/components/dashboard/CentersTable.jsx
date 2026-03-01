// Phase 4 - File #51
// frontend/src/components/dashboard/CentersTable.jsx

import CapacityBar from "./CapacityBar";
import { useNavigate } from "react-router-dom";

const STATUS_DOT = {
  online: "bg-green-400",
  full: "bg-red-500",
  offline: "bg-slate-500",
};

const STATUS_BADGE = {
  online: "text-green-400 bg-green-400/10 border-green-700/40",
  full: "text-red-400 bg-red-400/10 border-red-700/40",
  offline: "text-slate-400 bg-slate-400/10 border-slate-600/40",
};

const MOCK_CENTERS = [
  { id: 1, name: "Dharavi Relief Hub",    address: "Dharavi, Mumbai",   doctor_count: 8,  staff_count: 42, occupied_beds: 680, total_beds: 800, vehicle_count: 5, status: "online" },
  { id: 2, name: "Andheri North Center",  address: "Andheri, Mumbai",   doctor_count: 5,  staff_count: 28, occupied_beds: 310, total_beds: 400, vehicle_count: 3, status: "online" },
  { id: 3, name: "Kurla East Station",    address: "Kurla, Mumbai",     doctor_count: 4,  staff_count: 20, occupied_beds: 395, total_beds: 400, vehicle_count: 2, status: "full" },
  { id: 4, name: "Chembur Shelter",       address: "Chembur, Mumbai",   doctor_count: 6,  staff_count: 35, occupied_beds: 200, total_beds: 500, vehicle_count: 4, status: "online" },
  { id: 5, name: "Powai Medical Annex",   address: "Powai, Mumbai",     doctor_count: 12, staff_count: 55, occupied_beds: 120, total_beds: 300, vehicle_count: 3, status: "online" },
];

export default function CentersTable({ centers }) {
  const navigate = useNavigate();
  const displayCenters = centers ?? MOCK_CENTERS;

  return (
    <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
      <h2 className="text-base font-bold text-white mb-3">🏥 Relief Centers</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 uppercase tracking-wider border-b border-slate-800">
              <th className="text-left py-2 pr-3 font-semibold">Center</th>
              <th className="text-left py-2 pr-3 font-semibold">Capacity</th>
              <th className="text-left py-2 pr-3 font-semibold">Beds</th>
              <th className="text-left py-2 pr-3 font-semibold">Vehicles</th>
              <th className="text-left py-2 pr-3 font-semibold">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {displayCenters.map((center) => (
              <tr key={center.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                {/* Name */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[center.status]}`} />
                    <div>
                      <p className="font-semibold text-white">{center.name}</p>
                      <p className="text-slate-500 text-[11px]">
                        👨‍⚕️ {center.doctor_count} doctors · 👥 {center.staff_count} staff
                      </p>
                    </div>
                  </div>
                </td>

                {/* Capacity bar */}
                <td className="py-2.5 pr-3 min-w-[100px]">
                  <CapacityBar occupied={center.occupied_beds} total={center.total_beds} showLabel />
                </td>

                {/* Beds */}
                <td className="py-2.5 pr-3 text-slate-300 whitespace-nowrap">
                  {center.occupied_beds} / {center.total_beds}
                </td>

                {/* Vehicles */}
                <td className="py-2.5 pr-3 text-slate-300">{center.vehicle_count}</td>

                {/* Status badge */}
                <td className="py-2.5 pr-3">
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold capitalize ${STATUS_BADGE[center.status]}`}>
                    {center.status}
                  </span>
                </td>

                {/* Action */}
                <td className="py-2.5">
                  <button
                    onClick={() => navigate(`/dashboard/centers/${center.id}`)}
                    className="text-blue-400 hover:text-blue-300 font-semibold hover:underline text-xs"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
