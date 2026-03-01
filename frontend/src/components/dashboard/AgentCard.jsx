// Phase 4 - File #47
// frontend/src/components/dashboard/AgentCard.jsx

const STATUS_CONFIG = {
  active: { dot: "bg-green-400 animate-pulse", text: "Active" },
  idle: { dot: "bg-yellow-400", text: "Idle" },
  error: { dot: "bg-red-500 animate-pulse", text: "Error" },
};

export default function AgentCard({ name, icon, iconBg = "bg-blue-600", status = "active", activity }) {
  const { dot, text } = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;

  return (
    <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/40 hover:border-slate-600/60 transition-colors">
      {/* Row 1 */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-base shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <span className="font-semibold text-white text-sm flex-1 truncate">{name}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-xs text-slate-400">{text}</span>
        </div>
      </div>

      {/* Row 2 */}
      {activity && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{activity}</p>
      )}
    </div>
  );
}
