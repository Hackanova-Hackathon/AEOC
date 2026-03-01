import { X, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// File #37 - Alert.jsx
// variants: error, warning, success, info
const VARIANTS = {
  error:   { bg: 'bg-red-900/30',    border: 'border-red-700',    text: 'text-red-300',    icon: AlertCircle },
  warning: { bg: 'bg-yellow-900/30', border: 'border-yellow-700', text: 'text-yellow-300', icon: AlertTriangle },
  success: { bg: 'bg-green-900/30',  border: 'border-green-700',  text: 'text-green-300',  icon: CheckCircle },
  info:    { bg: 'bg-blue-900/30',   border: 'border-blue-700',   text: 'text-blue-300',   icon: Info },
};

export default function Alert({ message, variant = 'info', onDismiss }) {
  const v = VARIANTS[variant] ?? VARIANTS.info;
  const Icon = v.icon;

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${v.bg} ${v.border}`}>
      <Icon size={16} className={`mt-0.5 shrink-0 ${v.text}`} />
      <p className={`flex-1 text-sm ${v.text}`}>{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className={`shrink-0 hover:opacity-80 transition-opacity ${v.text}`}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
