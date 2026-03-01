import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// File #39 - Sidebar.jsx
const NAV_GROUPS = [
  {
    label: 'Command',
    items: [
      { label: 'Dashboard',       icon: '🛡️',  path: '/dashboard',             badge: null },
      { label: 'Network Map',     icon: '🗺️',  path: '/dashboard/map',         badge: null },
      { label: 'Relief Centers',  icon: '🏥',  path: '/dashboard/centers',     badge: null },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'WhatsApp Feed',   icon: '💬',  path: '/dashboard/whatsapp',    badge: 3 },
      { label: 'Fleet Manager',   icon: '🚛',  path: '/dashboard/fleet',       badge: null },
      { label: 'Inventory',       icon: '📦',  path: '/dashboard/inventory',   badge: null },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'SITREP Viewer',   icon: '📋',  path: '/dashboard/sitrep',      badge: null },
      { label: 'Agent Monitor',   icon: '🤖',  path: '/dashboard/agents',      badge: null },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings',        icon: '⚙️',  path: '/dashboard/settings',    badge: null },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OP';

  return (
    <aside className="w-60 min-h-screen flex flex-col bg-[#0d1526] border-r border-gray-800 shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🛡️</span>
          <span className="text-lg font-bold text-white tracking-wide">AEOC</span>
        </div>
        <p className="text-xs text-gray-500 leading-tight">AI Emergency Operations Center</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-2 mb-1">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-100 text-left ${
                        active
                          ? 'bg-blue-600/20 text-blue-300 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{user?.full_name ?? 'Operator'}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role ?? 'operator'}</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" title="Online" />
      </div>
    </aside>
  );
}
