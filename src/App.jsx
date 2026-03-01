import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layout
import DashboardLayout from './pages/dashboard/DashboardLayout'

// Auth pages (stubs until Phase 2)
import NotFoundPage from './pages/NotFoundPage'

// Auth guard
function AuthGuard({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Placeholder for pages not yet built
function Placeholder({ name }) {
  return (
    <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
      🚧 {name} — coming in Phase 4/5
    </div>
  )
}

// Temp login page until Phase 2
function TempLogin() {
  const loginAction = useAuthStore((s) => s.loginAction)
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center space-y-4">
        <div className="text-4xl">🛡️</div>
        <h1 className="text-white text-2xl font-bold">AEOC</h1>
        <p className="text-gray-400 text-sm">Temporary login for Phase 3 testing</p>
        <button
          onClick={() => loginAction('temp-token', { full_name: 'Operator', role: 'admin', email: 'op@aeoc.com' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<TempLogin />} />

      <Route path="/dashboard" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
        <Route index element={<Placeholder name="Command Dashboard" />} />
        <Route path="map" element={<Placeholder name="Network Map" />} />
        <Route path="centers" element={<Placeholder name="Centers List" />} />
        <Route path="centers/boot" element={<Placeholder name="Boot Center" />} />
        <Route path="centers/:id" element={<Placeholder name="Center Detail" />} />
        <Route path="whatsapp" element={<Placeholder name="WhatsApp Feed" />} />
        <Route path="fleet" element={<Placeholder name="Fleet Manager" />} />
        <Route path="inventory" element={<Placeholder name="Inventory" />} />
        <Route path="sitrep" element={<Placeholder name="SITREP Viewer" />} />
        <Route path="agents" element={<Placeholder name="Agent Monitor" />} />
        <Route path="settings" element={<Placeholder name="Settings" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}