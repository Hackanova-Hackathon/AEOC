// Phase 4 - File #55
// frontend/src/components/map/NetworkMapView.jsx

import { useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import CenterMarker from "./CenterMarker";
import RoutePolyline from "./RoutePolyline";

// 5 hardcoded Mumbai mock coordinates
const MOCK_CENTERS = [
  { id: 1, name: "Dharavi Relief Hub",  lat: 19.0411, lng: 72.8535, status: "online", occupied_beds: 680, total_beds: 800, doctor_count: 8, vehicle_count: 5 },
  { id: 2, name: "Andheri North Center",lat: 19.1136, lng: 72.8697, status: "online", occupied_beds: 310, total_beds: 400, doctor_count: 5, vehicle_count: 3 },
  { id: 3, name: "Kurla East Station",  lat: 19.0728, lng: 72.8826, status: "full",   occupied_beds: 395, total_beds: 400, doctor_count: 4, vehicle_count: 2 },
  { id: 4, name: "Chembur Shelter",     lat: 19.0620, lng: 72.8997, status: "online", occupied_beds: 200, total_beds: 500, doctor_count: 6, vehicle_count: 4 },
  { id: 5, name: "Powai Medical Annex", lat: 19.1197, lng: 72.9071, status: "online", occupied_beds: 120, total_beds: 300, doctor_count: 12, vehicle_count: 3 },
];

const MOCK_MISSIONS = [
  { id: 1, origin: { lat: 19.0411, lng: 72.8535 }, destination: { lat: 19.0728, lng: 72.8826 }, type: "extraction" },
  { id: 2, origin: { lat: 19.1136, lng: 72.8697 }, destination: { lat: 19.1197, lng: 72.9071 }, type: "supply_run" },
];

// Dark map style JSON (night theme)
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0d1526" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d1526" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e2d45" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#243852" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a1628" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const STATUS_LABELS = { online: "🟢 Online", full: "🔴 Full", offline: "⚫ Offline" };

export default function NetworkMapView({ centers, missions }) {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const displayCenters = centers ?? MOCK_CENTERS;
  const displayMissions = missions ?? MOCK_MISSIONS;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700/50">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 19.076, lng: 72.877 }}
          defaultZoom={12}
          styles={DARK_MAP_STYLE}
          disableDefaultUI
          className="w-full h-full"
        >
          {displayCenters.map((c) => (
            <CenterMarker key={c.id} center={c} onSelect={setSelectedCenter} />
          ))}
          {displayMissions.map((m) => (
            <RoutePolyline
              key={m.id}
              origin={m.origin}
              destination={m.destination}
              type={m.type}
            />
          ))}
        </Map>
      </APIProvider>

      {/* Info callout */}
      {selectedCenter && (
        <div className="absolute top-3 right-3 bg-[#0d1526]/95 border border-slate-700 rounded-xl p-4 w-56 shadow-2xl backdrop-blur">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-white text-sm leading-tight">{selectedCenter.name}</p>
            <button
              onClick={() => setSelectedCenter(null)}
              className="text-slate-500 hover:text-white text-lg leading-none ml-2"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-2">{STATUS_LABELS[selectedCenter.status]}</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>🛏 Beds: {selectedCenter.occupied_beds} / {selectedCenter.total_beds}</p>
            <p>👨‍⚕️ Doctors: {selectedCenter.doctor_count}</p>
            <p>🚑 Vehicles: {selectedCenter.vehicle_count}</p>
          </div>
        </div>
      )}
    </div>
  );
}
