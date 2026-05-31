// ============================================================
// RoleRoute — Restricts access to specific roles
// ============================================================
import { Navigate } from 'react-router-dom'
import type { UserRole } from '@/types/constants'

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

function getCurrentUserRole(): UserRole | null {
  try {
    const stored = localStorage.getItem('veridact_user')
    if (!stored) return null
    const user = JSON.parse(stored)
    return user.role ?? null
  } catch {
    return null
  }
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const role = getCurrentUserRole()

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
