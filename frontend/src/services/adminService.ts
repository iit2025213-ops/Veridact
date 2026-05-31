// ============================================================
// adminService — Admin-only API calls
// ============================================================
import apiClient from './apiClient'
import type { User, CustodyLog, AnalyticsSummary, PaginatedResponse } from '@/types'

export const adminService = {
  async getUsers(params?: { page?: number; size?: number }): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params })
    return response.data
  },

  async updateUser(userId: string, payload: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>(`/admin/users/${userId}`, payload)
    return response.data
  },

  async getCustodyLogs(params?: {
    case_id?: string
    user_id?: string
    action?: string
    page?: number
    size?: number
  }): Promise<PaginatedResponse<CustodyLog>> {
    const response = await apiClient.get<PaginatedResponse<CustodyLog>>('/admin/custody', { params })
    return response.data
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    const response = await apiClient.get<AnalyticsSummary>('/admin/analytics')
    return response.data
  },
}
