// ============================================================
// useAuth — Mock authentication hook (Phase 1: localStorage)
// Will be replaced with real JWT + API call in Phase 3
// ============================================================
import { useState, useCallback } from 'react'
import type { User, LoginPayload } from '@/types'

const DEMO_USERS: Record<string, User & { password: string }> = {
  'admin@veridact.gov.np': {
    id: 'usr-001',
    email: 'admin@veridact.gov.np',
    full_name: 'System Administrator',
    role: 'super_admin',
    is_active: true,
    organization: 'Nepal Cyber Bureau',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    password: 'admin123',
  },
  'investigator@veridact.gov.np': {
    id: 'usr-002',
    email: 'investigator@veridact.gov.np',
    full_name: 'Arjun Thapa',
    role: 'investigator',
    is_active: true,
    organization: 'Nepal Cyber Bureau',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    password: 'pass1234',
  },
  'supervisor@veridact.gov.np': {
    id: 'usr-003',
    email: 'supervisor@veridact.gov.np',
    full_name: 'Priya Sharma',
    role: 'supervisor',
    is_active: true,
    organization: 'Nepal Cyber Bureau',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    password: 'pass1234',
  },
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('veridact_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO Phase 3: Replace with real API call: POST /api/auth/login
      await new Promise(res => setTimeout(res, 800)) // simulate network

      const demoUser = DEMO_USERS[payload.email]
      if (!demoUser || demoUser.password !== payload.password) {
        setError('Invalid email or password')
        return false
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...userWithoutPassword } = demoUser
      localStorage.setItem('veridact_user', JSON.stringify(userWithoutPassword))
      localStorage.setItem('veridact_token', 'mock-jwt-token-' + demoUser.id)
      setUser(userWithoutPassword)
      return true
    } catch {
      setError('Could not connect to server. Is the backend running?')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('veridact_user')
    localStorage.removeItem('veridact_token')
    setUser(null)
  }, [])

  const isAuthenticated = !!user

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  }
}
