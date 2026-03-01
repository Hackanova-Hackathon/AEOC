import Spinner from './Spinner';

// File #38 - Table.jsx
// columns: [{ key, label, width?, render?(row) => JSX }]
export default function Table({ columns = [], data = [], loading = false, emptyMessage = 'No data available.' }) {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-700">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 z-10 rounded-lg">
          <Spinner size="lg" />
        </div>
      )}
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : {}}
                className="px-4 py-3 font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.length === 0 && !loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i} className="bg-gray-900/40 hover:bg-gray-800/60 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-300">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
