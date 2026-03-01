// Phase 5 - File #66
// frontend/src/pages/dashboard/Settings.jsx

import { useState } from "react";

const AGENTS = ["Liaison", "Dispatcher", "Quartermaster", "Healer", "Diplomat", "Soldier", "Reporter", "Recruiter"];

const API_HEALTH = [
  { name: "Gemini AI",     status: "healthy", latency: "142ms" },
  { name: "Twilio",        status: "healthy", latency: "89ms"  },
  { name: "Google Maps",   status: "healthy", latency: "203ms" },
];

const WHATSAPP_NUMBER = "+1 415 523 8886";

export default function Settings() {
  const [agentToggles, setAgentToggles] = useState(
    Object.fromEntries(AGENTS.map((a) => [a, true]))
  );
  const [copied, setCopied] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  const toggleAgent = (a) => setAgentToggles((t) => ({ ...t, [a]: !t[a] }));

  const copyNumber = () => {
    navigator.clipboard.writeText(WHATSAPP_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <section className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
          <h2 className="text-base font-bold text-white mb-4">Account Settings</h2>
          <div className="space-y-3 mb-5">
            {[["Name", "Admin User"], ["Email", "admin@aeoc.com"], ["Role", "Administrator"]].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-400 font-semibold">{label}</span>
                <span className="text-white">{val}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Change Password</p>
            <div className="space-y-3">
              {[["Current Password", "current"], ["New Password", "next"], ["Confirm New Password", "confirm"]].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
                  <input
                    type="password"
                    value={passwordForm[key]}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                  />
                </div>
              ))}
              <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section className="bg-[#0d1526] rounded-xl border border-slate-700/50 p-5">
          <h2 className="text-base font-bold text-white mb-4">System Settings</h2>

          {/* Agent toggles */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Agent Control</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {AGENTS.map((agent) => (
              <label key={agent} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2 cursor-pointer">
                <span className="text-sm text-slate-300">{agent}</span>
                <div
                  onClick={() => toggleAgent(agent)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${agentToggles[agent] ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${agentToggles[agent] ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
              </label>
            ))}
          </div>

          {/* WhatsApp sandbox */}
          <div className="border-t border-slate-800 pt-4 mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">WhatsApp Sandbox Number</p>
            <div className="flex items-center gap-3 bg-slate-800/60 rounded-lg px-4 py-3">
              <span className="font-mono text-white text-sm flex-1">{WHATSAPP_NUMBER}</span>
              <button
                onClick={copyNumber}
                className="text-xs text-blue-400 font-semibold hover:text-blue-300"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* API health */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">API Health</p>
            <div className="space-y-2">
              {API_HEALTH.map((api) => (
                <div key={api.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${api.status === "healthy" ? "bg-green-400" : "bg-red-500"}`} />
                    <span className="text-sm text-slate-300">{api.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{api.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
