// Phase 4 - File #49
// frontend/src/components/dashboard/WhatsAppPanel.jsx

import { useNavigate } from "react-router-dom";

const MOCK_MESSAGES = [
  {
    id: 1,
    phone: "+91 98765 43210",
    timestamp: "2 min ago",
    citizen: "I need help, there is flooding near Dharavi station. My family is trapped.",
    agent: "Dispatcher has assigned Ambulance #AMB-02. ETA 12 min. Please stay on the second floor.",
    agentName: "Liaison",
  },
  {
    id: 2,
    phone: "+91 91234 56789",
    timestamp: "8 min ago",
    citizen: "Mujhe doctor chahiye, meri maa ko chest pain ho raha hai.",
    agent: "Healer has located nearest cardiac unit at Powai Center. Vehicle dispatched.",
    agentName: "Healer",
  },
  {
    id: 3,
    phone: "+91 87654 32100",
    timestamp: "15 min ago",
    citizen: "We need food and water at the shelter near Kurla bus depot. Around 40 people.",
    agent: "Quartermaster notified. Supply truck #TRK-01 en route with provisions. ETA 20 min.",
    agentName: "Quartermaster",
  },
];

function initials(phone) {
  return phone.replace(/\D/g, "").slice(-2);
}

export default function WhatsAppPanel({ messages }) {
  const navigate = useNavigate();
  const displayMessages = messages ?? MOCK_MESSAGES;

  return (
    <div className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          💬 <span>WhatsApp Feed</span>
        </h2>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
          Live
        </span>
      </div>

      {/* Message feed */}
      <div className="overflow-y-auto max-h-60 space-y-4 pr-1 flex-1">
        {displayMessages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
              {initials(msg.phone)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-300">{msg.phone}</span>
                <span className="text-[11px] text-slate-500">{msg.timestamp}</span>
              </div>
              {/* Citizen bubble */}
              <div className="bg-blue-900/50 border border-blue-700/40 rounded-lg rounded-tl-none px-3 py-2 text-xs text-slate-200 mb-1">
                {msg.citizen}
              </div>
              {/* Agent bubble */}
              <div className="bg-green-900/50 border border-green-700/40 rounded-lg rounded-tl-none px-3 py-2 text-xs text-slate-200">
                <span className="text-green-400 font-semibold">[{msg.agentName}] </span>
                {msg.agent}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button
        onClick={() => navigate("/dashboard/whatsapp")}
        className="mt-3 w-full py-2 text-xs font-semibold text-blue-400 border border-blue-700/40 rounded-lg hover:bg-blue-900/20 transition-colors"
      >
        View All Conversations →
      </button>
    </div>
  );
}
