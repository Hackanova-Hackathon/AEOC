// Phase 5 - File #67
// frontend/src/pages/LandingPage.jsx

import { useNavigate } from "react-router-dom";

const STATS = [
  { value: "7",    label: "Centers" },
  { value: "4,821", label: "Sheltered" },
  { value: "38",   label: "Vehicles" },
  { value: "8",    label: "AI Agents" },
];

const FEATURES = [
  { icon: "💬", title: "WhatsApp Triage",     desc: "Citizens send SOS via WhatsApp. AI Liaison agent triages, classifies urgency, and responds in their language instantly — 24/7." },
  { icon: "🤖", title: "Live Agent Swarm",    desc: "8 specialized AI agents operate in parallel — dispatching vehicles, managing supplies, coordinating medics, and generating reports." },
  { icon: "🗺", title: "Node Network",        desc: "Real-time map of all relief centers with live capacity, vehicle positions, and active mission routes. Command everything from one screen." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060d1a] text-white overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%), #060d1a",
        }}
      >
        {/* Animated gradient orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="text-7xl mb-6">🛡️</div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AEOC</span>
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-3">
            AI-Powered Disaster Relief
          </p>
          <p className="text-lg text-slate-400 mb-10">
            Coordinated in Real Time
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-lg shadow-blue-900/50"
            >
              Go to Command Center →
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-bold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
          ↓
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#0d1526] border-y border-slate-800 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 divide-x divide-slate-800">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center px-4">
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-16">
          Built for <span className="text-blue-400">the Worst Moments</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#0d1526] border border-slate-700/50 rounded-2xl p-6 hover:border-blue-700/50 transition-colors"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        <p className="mb-1">Built with ❤️ for emergency response · Hackathon 2025</p>
        <p>AEOC — AI Emergency Operations Center</p>
      </footer>
    </div>
  );
}
