// ============================================================
// reportService — Report management API calls
// ============================================================
import apiClient from './apiClient'
import type { Report, PaginatedResponse } from '@/types'

export const reportService = {
  async getReports(params?: { case_id?: string; page?: number; size?: number }): Promise<PaginatedResponse<Report>> {
    const response = await apiClient.get<PaginatedResponse<Report>>('/reports', { params })
    return response.data
  },

  async downloadReport(reportId: string): Promise<void> {
    const response = await apiClient.get(`/reports/${reportId}`, {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `veridact-report-${reportId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}
