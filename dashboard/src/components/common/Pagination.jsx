import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button.jsx'

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex justify-between flex-1 sm:hidden">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="sm"
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="sm"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => {
              const p = idx + 1
              const isCurrent = p === currentPage
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'z-10 bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination
