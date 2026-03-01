// Phase 5 - File #65
// frontend/src/pages/dashboard/AgentMonitor.jsx

import { useState } from "react";

const STATUS_DOT = {
  active: "bg-green-400 animate-pulse",
  idle:   "bg-yellow-400",
  error:  "bg-red-500 animate-pulse",
};

const AGENTS_BY_CENTER = [
  {
    centerId: 1, centerName: "Dharavi Relief Hub",
    agents: [
      { name: "Liaison",       icon: "💬", status: "active", lastAction: "Processed inbound message from +91 98765 43210", lastTime: "1 min ago",
        logs: [
          { time: "14:42", type: "message_in",  desc: "Inbound from +91 98765 43210 — flood emergency" },
          { time: "14:41", type: "triage",       desc: "Urgency classified: 5/Critical, needs extraction" },
          { time: "14:40", type: "dispatch",     desc: "Triggered DispatcherAgent for vehicle assignment" },
          { time: "14:39", type: "reply_sent",   desc: "Reply sent: AMB-02 ETA 12 min, stay on second floor" },
        ]
      },
      { name: "Dispatcher",    icon: "🚑", status: "active", lastAction: "Assigned AMB-02 to extraction at Dharavi Station", lastTime: "2 min ago",
        logs: [
          { time: "14:42", type: "dispatch",    desc: "Assigned AMB-02 — extraction Dharavi Station" },
          { time: "14:38", type: "eta_calc",    desc: "ETA calculated: 12 min via GMaps API" },
          { time: "14:30", type: "status_upd",  desc: "AMB-01 status updated to idle after return" },
        ]
      },
      { name: "Quartermaster", icon: "📦", status: "active", lastAction: "Low water supply alert for Dharavi", lastTime: "5 min ago",
        logs: [
          { time: "14:37", type: "alert",       desc: "Water level below threshold: 380L remaining" },
          { time: "14:37", type: "resupply_req", desc: "Resupply convoy request submitted" },
          { time: "14:20", type: "poll",        desc: "Routine inventory check completed" },
        ]
      },
      { name: "Healer",        icon: "🩺", status: "active", lastAction: "Cardiac patient redirected to Powai ICU", lastTime: "8 min ago",
        logs: [
          { time: "14:34", type: "assessment",  desc: "Medical need assessed: cardiac — requires ICU" },
          { time: "14:35", type: "redirect",    desc: "Patient redirected to Powai Medical Annex" },
          { time: "14:35", type: "blood_check", desc: "O+ blood confirmed at Powai" },
        ]
      },
    ]
  },
  {
    centerId: 2, centerName: "Andheri North Center",
    agents: [
      { name: "Soldier",   icon: "🛡️",  status: "active", lastAction: "Status broadcast sent to command", lastTime: "3 min ago", logs: [{ time: "14:39", type: "report", desc: "Periodic broadcast: 310/400 beds, stable" }] },
      { name: "Reporter",  icon: "📋", status: "idle",   lastAction: "SITREP #6 generated", lastTime: "1 hr ago",   logs: [{ time: "13:00", type: "sitrep", desc: "SITREP #6 generated for Andheri North Center" }] },
      { name: "Diplomat",  icon: "🤝", status: "idle",   lastAction: "Awaiting resource request",       lastTime: "2 hrs ago", logs: [{ time: "12:00", type: "standby", desc: "Awaiting resource transfer request" }] },
      { name: "Recruiter", icon: "👥", status: "active", lastAction: "Staff ratio check passed", lastTime: "10 min ago", logs: [{ time: "14:30", type: "check", desc: "Staff ratio adequate: 1:15 (medical:patients)" }] },
    ]
  },
];

export default function AgentMonitor() {
  const [expanded, setExpanded] = useState({ 1: true, 2: true });
  const [logAgent, setLogAgent] = useState(null);

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      <h1 className="text-2xl font-bold text-white mb-6">Agent Monitor</h1>

      <div className="space-y-4">
        {AGENTS_BY_CENTER.map(({ centerId, centerName, agents }) => (
          <div key={centerId} className="bg-[#0d1526] rounded-xl border border-slate-700/50">
            {/* Accordion header */}
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => toggle(centerId)}
            >
              <h2 className="font-bold text-white">{centerName}</h2>
              <span className="text-slate-400">{expanded[centerId] ? "▲" : "▼"}</span>
            </button>

            {/* Agents grid */}
            {expanded[centerId] && (
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agents.map((agent) => (
                  <div key={agent.name} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/40">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{agent.icon}</span>
                      <span className="font-bold text-white text-sm">{agent.name}</span>
                      <span className={`w-2 h-2 rounded-full ml-auto ${STATUS_DOT[agent.status]}`} />
                      <span className="text-xs text-slate-400 capitalize">{agent.status}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{agent.lastAction}</p>
                    <p className="text-[11px] text-slate-500 mb-3">{agent.lastTime}</p>
                    <button
                      onClick={() => setLogAgent(agent)}
                      className="w-full py-1 text-xs font-semibold text-blue-400 border border-blue-700/40 rounded hover:bg-blue-900/20 transition-colors"
                    >
                      View Logs
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log Modal */}
      {logAgent && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setLogAgent(null)}
        >
          <div
            className="bg-[#0d1526] border border-slate-700 rounded-xl w-full max-w-md max-h-[70vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="font-bold text-white">{logAgent.icon} {logAgent.name} — Logs</h2>
              <button onClick={() => setLogAgent(null)} className="text-slate-500 hover:text-white text-xl">×</button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
              {logAgent.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-slate-800 pb-3 last:border-0">
                  <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap mt-0.5">{log.time}</span>
                  <span className="text-[11px] bg-blue-900/40 text-blue-400 border border-blue-700/40 px-1.5 py-0.5 rounded font-semibold shrink-0">{log.type}</span>
                  <p className="text-xs text-slate-300">{log.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
