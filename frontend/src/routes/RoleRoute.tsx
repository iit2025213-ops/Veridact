// ============================================================
// RoleRoute — Restricts access to specific roles
// ============================================================
import { Navigate } from 'react-router-dom'
import type { UserRole } from '@/types/constants'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
          <p className="text-body-sm font-medium">Verifying access...</p>
        </div>
      </div>
    )
  }

  const role = user?.role

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
