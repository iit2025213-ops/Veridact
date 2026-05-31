// ============================================================
// caseService — Case management API calls
// ============================================================
import apiClient from './apiClient'
import type { Case, CreateCasePayload, UpdateCasePayload, PaginatedResponse } from '@/types'

export interface CaseFilters {
  status?: string
  complaint_type?: string
  priority?: string
  assigned_to?: string
  page?: number
  size?: number
}

export const caseService = {
  async getCases(filters: CaseFilters = {}): Promise<PaginatedResponse<Case>> {
    const response = await apiClient.get<PaginatedResponse<Case>>('/cases', { params: filters })
    return response.data
  },

  async getCase(caseId: string): Promise<Case> {
    const response = await apiClient.get<Case>(`/cases/${caseId}`)
    return response.data
  },

  async createCase(payload: CreateCasePayload): Promise<Case> {
    const response = await apiClient.post<Case>('/cases', payload)
    return response.data
  },

  async updateCase(caseId: string, payload: UpdateCasePayload): Promise<Case> {
    const response = await apiClient.patch<Case>(`/cases/${caseId}`, payload)
    return response.data
  },

  async generateReport(caseId: string): Promise<{ report_id: string; message: string }> {
    const response = await apiClient.post(`/cases/${caseId}/report`)
    return response.data
  },

  async getPublicCaseStatus(caseNumber: string) {
    const response = await apiClient.get(`/public/cases/${caseNumber}`)
    return response.data
  },
}
