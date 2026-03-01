import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';

// File #41 - DashboardLayout.jsx
const PAGE_TITLES = {
  '/dashboard':              'Command Dashboard',
  '/dashboard/map':          'Network Map',
  '/dashboard/centers':      'Relief Centers',
  '/dashboard/centers/boot': 'Boot New Center',
  '/dashboard/whatsapp':     'WhatsApp Feed',
  '/dashboard/fleet':        'Fleet Manager',
  '/dashboard/inventory':    'Inventory',
  '/dashboard/sitrep':       'SITREP Viewer',
  '/dashboard/agents':       'Agent Monitor',
  '/dashboard/settings':     'Settings',
};

export default function DashboardLayout() {
  const { pathname } = useLocation();

  // Match exact or longest prefix for center detail routes like /dashboard/centers/:id
  const pageTitle =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith('/dashboard/centers/') ? 'Center Detail' : 'Dashboard');

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
