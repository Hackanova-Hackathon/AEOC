# AEOC — Phase 3: Dashboard Shell & UI Primitives

## Files in This Phase (Files #33–44)

```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx        #33 – primary / danger / ghost variants
│   │   ├── Badge.jsx         #34 – colored dot + pill (green/yellow/red/blue/gray)
│   │   ├── Spinner.jsx       #35 – animated rotating ring (sm/md/lg)
│   │   ├── Modal.jsx         #36 – dark overlay card, ESC + overlay click to close
│   │   ├── Alert.jsx         #37 – inline banner (error/warning/success/info)
│   │   └── Table.jsx         #38 – generic dark table with loading overlay
│   └── layout/
│       ├── Sidebar.jsx       #39 – 240px nav with groups, active highlight, user footer
│       └── Topbar.jsx        #40 – page title | active disaster badge | action buttons
├── pages/
│   ├── dashboard/
│   │   └── DashboardLayout.jsx  #41 – Sidebar + Topbar + <Outlet />
│   └── NotFoundPage.jsx         #42 – gradient 404 + return button
├── utils/
│   ├── constants.js          #43 – AGENTS, URGENCY_LEVELS, CENTER_STATUSES, VEHICLE_TYPES, SUPPLY_ITEMS
│   └── formatters.js         #44 – formatRelativeTime, formatCapacity, getCapacityColor, truncate, etc.
└── store/
    └── authStore.js          (Phase 2 file – stub included for Phase 3 imports)
```

---

## What to Install

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

This installs everything declared in `package.json` (written in Phase 1, file #16):

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | React runtime |
| `react-router-dom` | Client-side routing (`useNavigate`, `useLocation`, `Outlet`) |
| `zustand` | State management (`useAuthStore`) |
| `@tanstack/react-query` | Server state / data fetching (used from Phase 6) |
| `axios` | HTTP client (used from Phase 6) |
| `lucide-react` | Icon set (`X`, `AlertCircle`, etc. in Modal + Alert) |
| `tailwindcss`, `@tailwindcss/vite` | Utility CSS |
| `@vitejs/plugin-react` | Vite + React integration |
| `socket.io-client` | WebSocket (used from Phase 6) |
| `@react-google-maps/api` | Map (used from Phase 4) |

### 2. Start the dev server

```bash
npm run dev
```

Vite starts on **http://localhost:5173**.

---

## Phase 3 Checkpoint

After logging in (Phase 2 must be complete), you should see:
- ✅ Left sidebar with nav groups, active highlight, user initials
- ✅ Top bar with page title, pulsing red disaster badge, action buttons
- ✅ Navigating to a bad URL shows the branded 404 page
- ✅ All `ui/` components render without errors in isolation

---

## Component API Reference

### `<Button>`
```jsx
<Button variant="primary" loading={false} onClick={fn} disabled={false}>
  Click me
</Button>
// variants: "primary" | "danger" | "ghost"
```

### `<Badge>`
```jsx
<Badge label="Online" variant="green" />
// variants: "green" | "yellow" | "red" | "blue" | "gray"
```

### `<Spinner>`
```jsx
<Spinner size="md" />
// sizes: "sm" | "md" | "lg"
```

### `<Modal>`
```jsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="My Modal" size="md">
  <p>Content here</p>
</Modal>
// sizes: "sm" | "md" | "lg"
```

### `<Alert>`
```jsx
<Alert message="Something went wrong" variant="error" onDismiss={() => {}} />
// variants: "error" | "warning" | "success" | "info"
// onDismiss is optional — omit to hide the X button
```

### `<Table>`
```jsx
<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', render: (row) => <Badge label={row.status} variant="green" /> },
  ]}
  data={[{ id: 1, name: 'Dharavi Center', status: 'Online' }]}
  loading={false}
  emptyMessage="No centers found."
/>
```

### Formatters (utils/formatters.js)
```js
formatRelativeTime('2024-01-01T10:00:00Z')   // → '2 min ago'
formatCapacity(680, 800)                       // → '680 / 800'
formatCapacityPercent(680, 800)               // → 85
getCapacityColor(85)                           // → 'yellow'
truncate('Long string...', 40)                 // → 'Long string...'
formatDateTime('2024-01-15T14:30:00Z')        // → 'Jan 15, 2:30 PM'
formatUrgency(4)                               // → { label: 'Severe', color: 'red' }
```
