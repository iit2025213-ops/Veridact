// ============================================================
// useAuth — Real authentication hook using Context
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { User, LoginPayload } from '@/types'
import { authService } from '@/services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('veridact_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  
  // Start with loading true to check token on mount
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('veridact_token')
      if (token) {
        try {
          const fetchedUser = await authService.getMe()
          setUser(fetchedUser)
          localStorage.setItem('veridact_user', JSON.stringify(fetchedUser))
        } catch (err) {
          console.error('Session restored failed', err)
          authService.logout()
          setUser(null)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login(payload)
      localStorage.setItem('veridact_token', response.access_token)
      localStorage.setItem('veridact_user', JSON.stringify(response.user))
      setUser(response.user)
      return true
    } catch (err: any) {
      if (err.response?.data?.detail) {
        // detail might be string or array (from validation)
        const detail = err.response.data.detail
        if (typeof detail === 'string') {
          setError(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          setError(detail[0].msg || 'Invalid credentials')
        } else {
          setError('Invalid login credentials')
        }
      } else {
        setError('Could not connect to server. Is the backend running?')
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
