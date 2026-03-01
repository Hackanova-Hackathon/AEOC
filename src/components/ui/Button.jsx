import Spinner from './Spinner';

// File #33 - Button.jsx
// variants: primary, danger, ghost
export default function Button({ children, onClick, disabled, loading, className = '', variant = 'primary' }) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-800 disabled:opacity-60',
    danger:  'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-800 disabled:opacity-60',
    ghost:   'bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white focus:ring-gray-500 disabled:opacity-40',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
