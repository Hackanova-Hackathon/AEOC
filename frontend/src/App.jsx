import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

// Dashboard layout + guard
import AuthGuard from "./components/layout/AuthGuard";
import DashboardLayout from "./pages/dashboard/DashboardLayout";

// Dashboard pages
import CommandDashboard from "./pages/dashboard/CommandDashboard";
import NetworkMap from "./pages/dashboard/NetworkMap";
import CentersList from "./pages/dashboard/CentersList";
import CenterDetail from "./pages/dashboard/CenterDetail";
import BootCenter from "./pages/dashboard/BootCenter";
import WhatsAppFeed from "./pages/dashboard/WhatsAppFeed";
import FleetManager from "./pages/dashboard/FleetManager";
import Inventory from "./pages/dashboard/Inventory";
import SitrepViewer from "./pages/dashboard/SitrepViewer";
import AgentMonitor from "./pages/dashboard/AgentMonitor";
import Settings from "./pages/dashboard/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected dashboard routes */}
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<CommandDashboard />} />
          <Route path="map" element={<NetworkMap />} />
          <Route path="centers" element={<CentersList />} />
          <Route path="centers/boot" element={<BootCenter />} />
          <Route path="centers/:id" element={<CenterDetail />} />
          <Route path="whatsapp" element={<WhatsAppFeed />} />
          <Route path="fleet" element={<FleetManager />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="sitrep" element={<SitrepViewer />} />
          <Route path="agents" element={<AgentMonitor />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}