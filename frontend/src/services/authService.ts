// ============================================================
// authService — Authentication API calls
// ============================================================
import apiClient from './apiClient'
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '@/types'

export const authService = {
  async login(payload: LoginPayload): Promise<AuthTokens & { user: User }> {
    const response = await apiClient.post<AuthTokens & { user: User }>('/auth/login', payload)
    return response.data
  },

  async register(payload: RegisterPayload): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', payload)
    return response.data
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },

  logout(): void {
    localStorage.removeItem('veridact_token')
    localStorage.removeItem('veridact_user')
  }
}
