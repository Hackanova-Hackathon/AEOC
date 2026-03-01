// Phase 4 - File #53
// frontend/src/components/map/CenterMarker.jsx
// Uses @react-google-maps/api OverlayViewF

import { OverlayViewF, OVERLAY_MOUSE_TARGET } from "@react-google-maps/api";

const STATUS_COLOR = {
  online: { bg: "bg-green-500",  ring: "ring-green-500/40" },
  full:   { bg: "bg-red-500",    ring: "ring-red-500/40" },
  offline:{ bg: "bg-slate-500",  ring: "ring-slate-500/40" },
};

export default function CenterMarker({ center, onSelect }) {
  const { bg, ring } = STATUS_COLOR[center.status] ?? STATUS_COLOR.offline;
  const position = { lat: center.lat, lng: center.lng };

  return (
    <OverlayViewF
      position={position}
      mapPaneName={OVERLAY_MOUSE_TARGET}
    >
      <div
        className="relative cursor-pointer flex items-center justify-center"
        onClick={() => onSelect?.(center)}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {/* Pulsing ring */}
        <span
          className={`absolute w-8 h-8 rounded-full ring-4 ${ring} animate-ping opacity-60`}
        />
        {/* Core dot */}
        <span
          className={`relative w-5 h-5 rounded-full ${bg} border-2 border-white shadow-lg`}
        />
      </div>
    </OverlayViewF>
  );
}
