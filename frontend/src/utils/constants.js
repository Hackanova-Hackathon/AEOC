// File #43 - constants.js

export const AGENTS = [
  { name: 'Liaison',      icon: '📞', color: 'bg-blue-700'   },
  { name: 'Quartermaster',icon: '📦', color: 'bg-orange-700' },
  { name: 'Dispatcher',   icon: '🚛', color: 'bg-teal-700'   },
  { name: 'Diplomat',     icon: '🤝', color: 'bg-purple-700' },
  { name: 'Soldier',      icon: '🪖', color: 'bg-green-700'  },
  { name: 'Reporter',     icon: '📋', color: 'bg-yellow-700' },
  { name: 'Healer',       icon: '❤️', color: 'bg-red-700'    },
  { name: 'Recruiter',    icon: '👥', color: 'bg-indigo-700' },
];

export const URGENCY_LEVELS = {
  1: { label: 'Low',      color: 'green'  },
  2: { label: 'Moderate', color: 'blue'   },
  3: { label: 'High',     color: 'yellow' },
  4: { label: 'Severe',   color: 'red'    },
  5: { label: 'Critical', color: 'red'    },
};

export const CENTER_STATUSES = {
  online:  { label: 'Online',   color: 'green'  },
  full:    { label: 'Full',     color: 'red'    },
  offline: { label: 'Offline',  color: 'gray'   },
};

export const VEHICLE_TYPES = ['ambulance', 'bus', 'truck'];

export const SUPPLY_ITEMS = [
  { name: 'Food Packets',  unit: 'packets', defaultThreshold: 200 },
  { name: 'Water',         unit: 'litres',  defaultThreshold: 500 },
  { name: 'Blankets',      unit: 'units',   defaultThreshold: 100 },
  { name: 'Medical Kits',  unit: 'kits',    defaultThreshold: 50  },
  { name: 'Medicines',     unit: 'units',   defaultThreshold: 100 },
  { name: 'Blood Units',   unit: 'units',   defaultThreshold: 20  },
];
