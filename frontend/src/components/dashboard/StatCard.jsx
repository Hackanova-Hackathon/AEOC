// Phase 4 - File #45
// frontend/src/components/dashboard/StatCard.jsx

const variantBorderColor = {
  green: "border-t-green-500",
  blue: "border-t-blue-500",
  orange: "border-t-orange-500",
  red: "border-t-red-500",
};

export default function StatCard({ label, value, sub, icon, variant = "blue" }) {
  const borderColor = variantBorderColor[variant] ?? "border-t-blue-500";

  return (
    <div
      className={`bg-[#0d1526] rounded-xl p-5 border border-slate-700/50 border-t-[3px] ${borderColor} relative overflow-hidden`}
    >
      {/* Faded icon top-right */}
      {icon && (
        <span className="absolute top-3 right-4 text-4xl opacity-10 select-none">
          {icon}
        </span>
      )}

      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-4xl font-bold text-white leading-tight">{value}</p>
      {sub && <p className="text-sm text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
