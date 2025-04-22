"use client"

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxDisplayedPages?: number
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxDisplayedPages = 5,
}: CustomPaginationProps) {
  if (totalPages <= 1) return null

  // Determinar qué páginas mostrar
  const getPageNumbers = () => {
    const pageNumbers = []
    const halfDisplayed = Math.floor(maxDisplayedPages / 2)

    let startPage = Math.max(1, currentPage - halfDisplayed)
    const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1)

    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1)
    }

    // Añadir páginas al array
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <PaginationRoot>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} href="#" />
          </PaginationItem>
        )}

        {pageNumbers[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)} href="#">
                1
              </PaginationLink>
            </PaginationItem>
            {pageNumbers[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href="#" onClick={() => onPageChange(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)} href="#">
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} href="#" />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  )
}
