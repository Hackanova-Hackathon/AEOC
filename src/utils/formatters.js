// File #44 - formatters.js

/**
 * formatRelativeTime('2024-01-01T10:00:00Z') → '2 min ago'
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * formatCapacity(680, 800) → '680 / 800'
 */
export function formatCapacity(occupied, total) {
  return `${occupied ?? 0} / ${total ?? 0}`;
}

/**
 * formatCapacityPercent(680, 800) → 85
 */
export function formatCapacityPercent(occupied, total) {
  if (!total) return 0;
  return Math.round(((occupied ?? 0) / total) * 100);
}

/**
 * getCapacityColor(85) → 'yellow'
 * thresholds: <70 green, 70–90 yellow, >90 red
 */
export function getCapacityColor(percent) {
  if (percent >= 90) return 'red';
  if (percent >= 70) return 'yellow';
  return 'green';
}

/**
 * truncate('Hello World', 5) → 'Hello...'
 */
export function truncate(str, len = 80) {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
}

/**
 * formatDateTime('2024-01-15T14:30:00Z') → 'Jan 15, 2:30 PM'
 */
export function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * formatUrgency(4) → { label: 'Severe', color: 'red' }
 */
export function formatUrgency(level) {
  const map = {
    1: { label: 'Low',      color: 'green'  },
    2: { label: 'Moderate', color: 'blue'   },
    3: { label: 'High',     color: 'yellow' },
    4: { label: 'Severe',   color: 'red'    },
    5: { label: 'Critical', color: 'red'    },
  };
  return map[level] ?? { label: 'Unknown', color: 'gray' };
}
