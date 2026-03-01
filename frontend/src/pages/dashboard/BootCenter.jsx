// Phase 5 - File #60
// frontend/src/pages/dashboard/BootCenter.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = ["Location", "Resources", "Medical Staff", "Blood Bank", "Connectivity", "Review"];

const CONNECTIVITY_CHECKS = [
  "Stable internet connection (min 10 Mbps)",
  "Uninterrupted power supply (UPS/Generator)",
  "Water access (piped or tanker)",
  "Road access for vehicles",
  "Secure perimeter established",
];

const EQUIPMENT_ITEMS = ["Ventilators", "Defibrillators", "Stretchers", "Oxygen Cylinders"];

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const KEY_MAP = {
  "A+": "a_pos", "A-": "a_neg", "B+": "b_pos", "B-": "b_neg",
  "O+": "o_pos", "O-": "o_neg", "AB+": "ab_pos", "AB-": "ab_neg",
};

const DEFAULT_FORM = {
  address: "", lat: null, lng: null,
  total_beds: "", total_vehicles: "",
  doctors: "", nurses: "", paramedics: "", surgeons: "", icu_nurses: "",
  equipment: {},
  blood_bank: false,
  blood: Object.fromEntries(BLOOD_TYPES.map((t) => [KEY_MAP[t], ""])),
  connectivity: {},
};

function Field({ label, value, onChange, type = "number", placeholder = "" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 placeholder-slate-600"
      />
    </div>
  );
}

export default function BootCenter() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setBlood = (key, val) => setForm((f) => ({ ...f, blood: { ...f.blood, [key]: val } }));
  const toggleEquip = (item) =>
    setForm((f) => ({ ...f, equipment: { ...f.equipment, [item]: !f.equipment[item] } }));
  const toggleConn = (item) =>
    setForm((f) => ({ ...f, connectivity: { ...f.connectivity, [item]: !f.connectivity[item] } }));

  return (
    <div className="p-6 bg-[#060d1a] min-h-full">
      <h1 className="text-2xl font-bold text-white mb-6">Boot New Center</h1>

      {/* Step indicator */}
      <div className="flex gap-0 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              i === step ? "bg-blue-600 text-white" :
              i < step  ? "text-green-400" : "text-slate-500"
            }`}>
              {i < step ? "✓" : <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] border-current">{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-slate-700 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="max-w-2xl bg-[#0d1526] rounded-xl border border-slate-700/50 p-6">

        {/* Step 0: Location */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white mb-2">📍 Location</h2>
            <Field label="Center Address" type="text" value={form.address} onChange={(v) => set("address", v)} placeholder="e.g. 45 Relief Nagar, Dharavi, Mumbai 400017" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude"  value={form.lat ?? ""}  onChange={(v) => set("lat", v)}  placeholder="19.0411" />
              <Field label="Longitude" value={form.lng ?? ""}  onChange={(v) => set("lng", v)}  placeholder="72.8535" />
            </div>
            <div className="h-40 bg-slate-800/60 rounded-lg border border-slate-700 flex items-center justify-center">
              <p className="text-slate-500 text-sm">📍 Map preview will render here (Google Maps)</p>
            </div>
          </div>
        )}

        {/* Step 1: Resources */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white mb-2">🏥 Resources</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Total Beds"     value={form.total_beds}     onChange={(v) => set("total_beds", v)} />
              <Field label="Total Vehicles" value={form.total_vehicles} onChange={(v) => set("total_vehicles", v)} />
            </div>
          </div>
        )}

        {/* Step 2: Medical Staff */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white mb-2">👨‍⚕️ Medical Staff</h2>
            <div className="grid grid-cols-2 gap-4">
              {[["Doctors", "doctors"], ["Nurses", "nurses"], ["Paramedics", "paramedics"], ["Surgeons", "surgeons"], ["ICU Nurses", "icu_nurses"]].map(([l, k]) => (
                <Field key={k} label={l} value={form[k]} onChange={(v) => set(k, v)} />
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Equipment Available</p>
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT_ITEMS.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form.equipment[item]} onChange={() => toggleEquip(item)} className="accent-blue-500" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Blood Bank */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white mb-2">🩸 Blood Bank</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <div
                onClick={() => set("blood_bank", !form.blood_bank)}
                className={`w-10 h-5 rounded-full transition-colors ${form.blood_bank ? "bg-blue-600" : "bg-slate-700"} relative`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.blood_bank ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-slate-300">Blood Bank Available</span>
            </label>
            {form.blood_bank && (
              <div className="grid grid-cols-4 gap-3">
                {BLOOD_TYPES.map((bt) => (
                  <div key={bt}>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">{bt}</label>
                    <input
                      type="number"
                      value={form.blood[KEY_MAP[bt]]}
                      onChange={(e) => setBlood(KEY_MAP[bt], e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Connectivity */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white mb-2">📡 Connectivity Requirements</h2>
            <div className="space-y-3">
              {CONNECTIVITY_CHECKS.map((check) => (
                <label key={check} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!form.connectivity[check]} onChange={() => toggleConn(check)} className="accent-blue-500 mt-0.5" />
                  <span className="text-sm text-slate-300">{check}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white mb-2">✅ Review</h2>
            <div className="bg-slate-800/60 rounded-lg p-4 space-y-2 text-xs text-slate-300">
              <p><span className="text-slate-500">Address:</span> {form.address || "—"}</p>
              <p><span className="text-slate-500">Coords:</span> {form.lat || "—"}, {form.lng || "—"}</p>
              <p><span className="text-slate-500">Beds / Vehicles:</span> {form.total_beds || "—"} / {form.total_vehicles || "—"}</p>
              <p><span className="text-slate-500">Doctors:</span> {form.doctors || "—"} · Nurses: {form.nurses || "—"} · Paramedics: {form.paramedics || "—"}</p>
              <p><span className="text-slate-500">Blood Bank:</span> {form.blood_bank ? "Yes" : "No"}</p>
              <p><span className="text-slate-500">Equipment:</span> {Object.entries(form.equipment).filter(([,v]) => v).map(([k]) => k).join(", ") || "None selected"}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-sm font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => {
                // Phase 6 will wire the real API call here
                alert("Center Booted! (mock) — wire to useBootCenter() in Phase 6");
                navigate("/dashboard/centers");
              }}
              className="px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
            >
              🚀 Boot Center
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
