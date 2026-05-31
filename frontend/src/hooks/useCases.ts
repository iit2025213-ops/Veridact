// ============================================================
// useCases — Stub hook for cases data fetching
// TODO Phase 3: Replace with real API calls via caseService
// ============================================================
import { useState, useEffect } from 'react'
import type { Case, PaginatedResponse } from '@/types'
import { MOCK_CASES } from '@/lib/mockData'

export interface UseCasesOptions {
  status?: string
  complaint_type?: string
  priority?: string
  page?: number
  size?: number
}

export function useCases(options: UseCasesOptions = {}) {
  const [data, setData] = useState<PaginatedResponse<Case> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // TODO Phase 3: Replace with caseService.getCases(options)
        await new Promise(res => setTimeout(res, 600))
        const filtered = MOCK_CASES.filter(c => {
          if (options.status && c.status !== options.status) return false
          if (options.complaint_type && c.complaint_type !== options.complaint_type) return false
          if (options.priority && c.priority !== options.priority) return false
          return true
        })
        const page = options.page ?? 1
        const size = options.size ?? 10
        const start = (page - 1) * size
        setData({
          items: filtered.slice(start, start + size),
          total: filtered.length,
          page,
          size,
          pages: Math.ceil(filtered.length / size),
        })
      } catch {
        setError('Failed to load cases')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCases()
  }, [options.status, options.complaint_type, options.priority, options.page, options.size])

  return { data, isLoading, error }
}
