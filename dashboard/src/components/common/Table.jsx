import React from 'react'

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No data found.',
  renderRow,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto w-full border border-slate-200 rounded-lg bg-white ${className}`}>
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 font-semibold tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
          {isLoading && (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-5/6" />
                  </td>
                ))}
              </tr>
            ))
          )}
          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-lg font-medium text-slate-500">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          )}
          {!isLoading && data.length > 0 && (
            data.map((item, idx) => (
              renderRow ? renderRow(item, idx) : (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  {Object.values(item).map((val, cellIdx) => (
                    <td key={cellIdx} className="px-6 py-4 whitespace-nowrap">
                      {val}
                    </td>
                  ))}
                </tr>
              )
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
