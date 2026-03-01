// Phase 5 - File #61
// frontend/src/pages/dashboard/WhatsAppFeed.jsx

import { useState } from "react";

const URGENCY_BADGE = {
  1: "text-green-400 bg-green-400/10", 2: "text-blue-400 bg-blue-400/10",
  3: "text-yellow-400 bg-yellow-400/10", 4: "text-orange-400 bg-orange-400/10", 5: "text-red-400 bg-red-400/10",
};
const URGENCY_LABEL = { 1: "Low", 2: "Medium", 3: "High", 4: "Severe", 5: "Critical" };

const STATUS_BADGE = {
  active:   "text-blue-400 bg-blue-400/10",
  resolved: "text-green-400 bg-green-400/10",
  flagged:  "text-red-400 bg-red-400/10",
};

const CONVERSATIONS = [
  {
    id: 1, phone: "+91 98765 43210", center: "Dharavi Relief Hub", urgency: 5, status: "active",
    preview: "I need help, there is flooding near Dharavi station...",
    timestamp: "2 min ago",
    messages: [
      { id: 1, role: "citizen", content: "I need help, there is flooding near Dharavi station. My family is trapped.", time: "14:40" },
      { id: 2, role: "agent",   content: "Dispatcher has assigned Ambulance #AMB-02. ETA 12 min. Please stay on the second floor.", agentName: "Liaison", time: "14:41" },
      { id: 3, role: "citizen", content: "Thank you! We are 5 people, 2 elderly.", time: "14:42" },
      { id: 4, role: "agent",   content: "Noted. Please signal from your window with a cloth. The driver has your address.", agentName: "Liaison", time: "14:43" },
    ],
  },
  {
    id: 2, phone: "+91 91234 56789", center: "Powai Medical Annex", urgency: 5, status: "active",
    preview: "Mujhe doctor chahiye, meri maa ko chest pain ho raha hai.",
    timestamp: "8 min ago",
    messages: [
      { id: 1, role: "citizen", content: "Mujhe doctor chahiye, meri maa ko chest pain ho raha hai.", time: "14:34" },
      { id: 2, role: "agent",   content: "Healer has located nearest cardiac unit at Powai Center. Vehicle dispatched. Please keep her calm.", agentName: "Healer", time: "14:35" },
    ],
  },
  {
    id: 3, phone: "+91 87654 32100", center: "Chembur Shelter", urgency: 3, status: "resolved",
    preview: "We need food and water at the shelter near Kurla bus depot.",
    timestamp: "15 min ago",
    messages: [
      { id: 1, role: "citizen", content: "We need food and water at the shelter near Kurla bus depot. Around 40 people.", time: "14:27" },
      { id: 2, role: "agent",   content: "Quartermaster notified. Supply truck #TRK-01 en route with provisions. ETA 20 min.", agentName: "Quartermaster", time: "14:28" },
    ],
  },
];

function initials(phone) { return phone.replace(/\D/g, "").slice(-2); }

export default function WhatsAppFeed() {
  const [selected, setSelected] = useState(CONVERSATIONS[0]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#060d1a]">
      {/* LEFT: Conversation list */}
      <div className="w-[35%] border-r border-slate-800 overflow-y-auto">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-base font-bold text-white">WhatsApp Triage</h1>
          <p className="text-xs text-slate-500 mt-0.5">{CONVERSATIONS.length} conversations</p>
        </div>
        {CONVERSATIONS.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelected(conv)}
            className={`p-4 border-b border-slate-800/50 cursor-pointer transition-colors ${
              selected?.id === conv.id ? "bg-blue-900/20" : "hover:bg-slate-800/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials(conv.phone)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-sm font-semibold text-white">{conv.phone}</span>
                  <span className="text-[11px] text-slate-500">{conv.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 truncate mb-1.5">{conv.preview}</p>
                <div className="flex gap-1.5">
                  <span className={`text-[11px] px-1.5 py-0.5 rounded font-semibold ${URGENCY_BADGE[conv.urgency]}`}>
                    {URGENCY_LABEL[conv.urgency]}
                  </span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded font-semibold capitalize ${STATUS_BADGE[conv.status]}`}>
                    {conv.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Chat UI */}
      {selected ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">{selected.phone}</h2>
              <p className="text-xs text-slate-400">{selected.center} · Urgency: <span className={URGENCY_BADGE[selected.urgency].split(" ")[0]}>{URGENCY_LABEL[selected.urgency]}</span></p>
            </div>
            <div className="flex gap-2">
              {["Resolve", "Flag", "Reassign"].map((action) => (
                <button key={action} className="px-3 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {selected.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "citizen" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm ${
                  msg.role === "citizen"
                    ? "bg-blue-900/50 border border-blue-700/40 rounded-tl-none"
                    : "bg-green-900/50 border border-green-700/40 rounded-tr-none"
                }`}>
                  {msg.role === "agent" && (
                    <p className="text-xs font-bold text-green-400 mb-1">[{msg.agentName}]</p>
                  )}
                  <p className="text-slate-200">{msg.content}</p>
                  <p className="text-[11px] text-slate-500 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <p>Select a conversation</p>
        </div>
      )}
    </div>
  );
}
