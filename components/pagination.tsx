'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-muted hover:bg-muted disabled:opacity-50 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg border font-semibold transition-all ${
            currentPage === page
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-muted text-muted-foreground hover:bg-muted'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-muted hover:bg-muted disabled:opacity-50 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
