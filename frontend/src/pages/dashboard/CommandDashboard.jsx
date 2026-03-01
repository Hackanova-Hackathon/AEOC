// Phase 4 - File #56
// frontend/src/pages/dashboard/CommandDashboard.jsx

import StatCard        from "../../components/dashboard/StatCard";
import NetworkMapView  from "../../components/map/NetworkMapView";
import CentersTable    from "../../components/dashboard/CentersTable";
import WhatsAppPanel   from "../../components/dashboard/WhatsAppPanel";
import SitrepCard      from "../../components/dashboard/SitrepCard";
import ActivityLog     from "../../components/dashboard/ActivityLog";
import AgentSwarmPanel from "../../components/dashboard/AgentSwarmPanel";

// Mock top-level stats
const STATS = [
  { label: "Active Centers",       value: "5",    sub: "3 online · 1 full · 1 offline", icon: "🏥", variant: "blue"   },
  { label: "Citizens Sheltered",   value: "1,705", sub: "+148 since last hour",          icon: "👥", variant: "green"  },
  { label: "Vehicles Deployed",    value: "17",   sub: "8 on mission · 9 idle",         icon: "🚑", variant: "orange" },
  { label: "Pending Extractions",  value: "14",   sub: "Urgent: 3 critical cases",      icon: "🆘", variant: "red"    },
];

export default function CommandDashboard() {
  return (
    <div className="p-6 space-y-6 bg-[#060d1a] min-h-full">
      {/* Stat row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* LEFT: map + centers table */}
        <div className="space-y-6">
          <div className="h-[400px]">
            <NetworkMapView />
          </div>
          <CentersTable />
        </div>

        {/* RIGHT: chat feed + sitrep + activity */}
        <div className="space-y-4">
          <WhatsAppPanel />
          <SitrepCard />
          <ActivityLog />
        </div>
      </div>

      {/* Agent swarm — full width */}
      <AgentSwarmPanel centerName="All Centers" />
    </div>
  );
}
