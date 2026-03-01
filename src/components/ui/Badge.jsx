// File #34 - Badge.jsx
// variants: green, yellow, red, blue, gray
const VARIANTS = {
  green:  { dot: 'bg-green-400',  text: 'text-green-300',  pill: 'bg-green-900/40' },
  yellow: { dot: 'bg-yellow-400', text: 'text-yellow-300', pill: 'bg-yellow-900/40' },
  red:    { dot: 'bg-red-400',    text: 'text-red-300',    pill: 'bg-red-900/40' },
  blue:   { dot: 'bg-blue-400',   text: 'text-blue-300',   pill: 'bg-blue-900/40' },
  gray:   { dot: 'bg-gray-400',   text: 'text-gray-300',   pill: 'bg-gray-800' },
};

export default function Badge({ label, variant = 'gray' }) {
  const v = VARIANTS[variant] ?? VARIANTS.gray;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${v.pill} ${v.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {label}
    </span>
  );
}
