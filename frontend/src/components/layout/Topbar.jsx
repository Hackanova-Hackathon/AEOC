import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

// File #40 - Topbar.jsx
export default function Topbar({ pageTitle = 'Dashboard', activeDisaster = 'CYCLONE VAYU' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logoutAction = useAuthStore((s) => s.logoutAction);

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <header className="h-14 flex items-center px-6 gap-4 border-b border-gray-800 bg-[#0d1526] shrink-0">
      {/* Left: page title */}
      <h1 className="text-base font-semibold text-white flex-1">{pageTitle}</h1>

      {/* Center: active disaster badge */}
      <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 rounded-full px-3 py-1">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-bold text-red-300 tracking-wide">{activeDisaster}</span>
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <Button variant="ghost" onClick={() => navigate('/dashboard/sitrep')}>
          Export SITREP
        </Button>
        <Button variant="primary" onClick={() => navigate('/dashboard/centers/boot')}>
          Boot New Center
        </Button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <span>{user?.full_name ?? 'Operator'}</span>
            <span className="text-gray-500">▾</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-8 w-36 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
