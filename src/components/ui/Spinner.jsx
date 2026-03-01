// File #35 - Spinner.jsx
// sizes: sm (16px), md (24px), lg (40px)
const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
};

export default function Spinner({ size = 'md' }) {
  return (
    <span
      className={`inline-block rounded-full border-gray-600 border-t-blue-400 animate-spin ${SIZES[size] ?? SIZES.md}`}
      role="status"
      aria-label="Loading"
    />
  );
}
