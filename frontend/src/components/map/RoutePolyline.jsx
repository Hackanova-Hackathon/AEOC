// Phase 4 - File #54
// frontend/src/components/map/RoutePolyline.jsx
// Uses @react-google-maps/api Polyline

import { Polyline } from "@react-google-maps/api";

const MISSION_COLOR = {
  extraction: "#ef4444", // red
  supply_run: "#3b82f6", // blue
};

export default function RoutePolyline({ origin, destination, type = "extraction" }) {
  const strokeColor = MISSION_COLOR[type] ?? MISSION_COLOR.extraction;

  const path = [
    { lat: origin.lat, lng: origin.lng },
    { lat: destination.lat, lng: destination.lng },
  ];

  const options = {
    strokeColor,
    strokeOpacity: 0,
    strokeWeight: 2,
    icons: [
      {
        icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
        offset: "0",
        repeat: "12px",
      },
    ],
  };

  return <Polyline path={path} options={options} />;
}
