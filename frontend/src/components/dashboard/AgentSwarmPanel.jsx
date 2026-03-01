// Phase 4 - File #48
// frontend/src/components/dashboard/AgentSwarmPanel.jsx

import AgentCard from "./AgentCard";

const MOCK_AGENTS = [
  { name: "Liaison",       icon: "💬", iconBg: "bg-blue-600",   status: "active", activity: "Processed 3 inbound WhatsApp messages. Routed 2 to Dharavi center." },
  { name: "Quartermaster", icon: "📦", iconBg: "bg-amber-600",  status: "active", activity: "Low water supply alert sent. Resupply request logged for Andheri." },
  { name: "Dispatcher",    icon: "🚑", iconBg: "bg-red-600",    status: "active", activity: "Assigned Ambulance #AMB-03 to extraction at Kurla station." },
  { name: "Diplomat",      icon: "🤝", iconBg: "bg-purple-600", status: "idle",   activity: "Awaiting resource transfer request between centers." },
  { name: "Soldier",       icon: "🛡️",  iconBg: "bg-slate-600", status: "active", activity: "Status report broadcasted at 14:42. Next report in 7 min." },
  { name: "Reporter",      icon: "📋", iconBg: "bg-green-600",  status: "active", activity: "SITREP #7 generated for Dharavi. Sent to command." },
  { name: "Healer",        icon: "🩺", iconBg: "bg-teal-600",   status: "active", activity: "Redirected critical patient to Powai ICU. Blood type O+ confirmed." },
  { name: "Recruiter",     icon: "👥", iconBg: "bg-indigo-600", status: "idle",   activity: "Staff ratio check passed. Monitoring Chembur center staffing." },
];

export default function AgentSwarmPanel({ centerName = "All Centers", agents }) {
  const displayAgents = agents ?? MOCK_AGENTS;

  return (
    <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white">
          Agent Swarm — <span className="text-blue-400">{centerName}</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">All Agents Active</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {displayAgents.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </div>
    </div>
  );
}
