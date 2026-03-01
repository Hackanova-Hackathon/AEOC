// Phase 4 - File #50
// frontend/src/components/dashboard/ActivityLog.jsx

const MOCK_LOGS = [
  { id: 1, agent: "Liaison",       agentColor: "text-blue-400",   iconBg: "bg-blue-600",   icon: "💬", action: "Processed inbound message from +91 98765 43210", time: "1 min ago" },
  { id: 2, agent: "Dispatcher",    agentColor: "text-red-400",    iconBg: "bg-red-600",    icon: "🚑", action: "Assigned AMB-02 to extraction — Dharavi Station", time: "2 min ago" },
  { id: 3, agent: "Quartermaster", agentColor: "text-amber-400",  iconBg: "bg-amber-600",  icon: "📦", action: "Low water alert — Andheri Center (120L remaining)", time: "5 min ago" },
  { id: 4, agent: "Healer",        agentColor: "text-teal-400",   iconBg: "bg-teal-600",   icon: "🩺", action: "Cardiac case redirected to Powai ICU center", time: "8 min ago" },
  { id: 5, agent: "Reporter",      agentColor: "text-green-400",  iconBg: "bg-green-600",  icon: "📋", action: "SITREP #7 generated for Dharavi Relief Center", time: "12 min ago" },
  { id: 6, agent: "Soldier",       agentColor: "text-slate-400",  iconBg: "bg-slate-600",  icon: "🛡️",  action: "Broadcast status report — 5 centers online", time: "15 min ago" },
];

export default function ActivityLog({ logs }) {
  const displayLogs = logs ?? MOCK_LOGS;

  return (
    <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
      <h2 className="text-base font-bold text-white mb-3">📡 Activity Log</h2>
      <div className="overflow-y-auto max-h-52 space-y-2 pr-1">
        {displayLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 py-1.5 border-b border-slate-800 last:border-0">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs shrink-0 mt-0.5 ${log.iconBg}`}>
              {log.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-xs font-bold ${log.agentColor}`}>{log.agent} </span>
              <span className="text-xs text-slate-300">{log.action}</span>
            </div>
            <span className="text-[11px] text-slate-500 shrink-0 whitespace-nowrap">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
