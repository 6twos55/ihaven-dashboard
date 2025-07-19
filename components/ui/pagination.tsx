"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export function Pagination({ currentPage, totalPages, onPageChange, maxVisiblePages = 5 }: PaginationProps) {
  if (totalPages <= 1) return null

  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // If total pages is less than or equal to max visible pages, show all pages
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1

    // Adjust if end page exceeds total pages
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pageNumbers[0] > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 w-8", currentPage === 1 && "bg-zinc-100 dark:bg-zinc-800")}
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {pageNumbers[0] > 2 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant="outline"
          size="sm"
          className={cn("h-8 w-8", currentPage === page && "bg-zinc-100 dark:bg-zinc-800")}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 w-8", currentPage === totalPages && "bg-zinc-100 dark:bg-zinc-800")}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}

export const PaginationContent = () => null
export const PaginationItem = () => null
export const PaginationLink = () => null
export const PaginationNext = () => null
export const PaginationPrevious = () => null
export const PaginationEllipsis = () => null
