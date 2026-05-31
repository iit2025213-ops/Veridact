// ============================================================
// usePagination — Pagination state hook
// ============================================================
import { useState, useCallback } from 'react'

export function usePagination(initialPage = 1, initialSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const goToNext = useCallback((totalPages: number) => {
    setPage(p => Math.min(p + 1, totalPages))
  }, [])

  const goToPrev = useCallback(() => {
    setPage(p => Math.max(p - 1, 1))
  }, [])

  const reset = useCallback(() => {
    setPage(1)
  }, [])

  return { page, size, setSize, goToPage, goToNext, goToPrev, reset }
}
