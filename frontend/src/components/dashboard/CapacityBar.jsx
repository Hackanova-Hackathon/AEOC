// Phase 4 - File #46
// frontend/src/components/dashboard/CapacityBar.jsx

function getBarColor(percent) {
  if (percent >= 90) return "bg-red-500";
  if (percent >= 70) return "bg-yellow-400";
  return "bg-green-500";
}

export default function CapacityBar({ occupied = 0, total = 1, showLabel = true }) {
  const percent = total > 0 ? Math.min(100, Math.round((occupied / total) * 100)) : 0;
  const color = getBarColor(percent);

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 bg-slate-700 rounded-full h-[6px] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400 whitespace-nowrap min-w-[32px] text-right">
          {percent}%
        </span>
      )}
    </div>
  );
}
