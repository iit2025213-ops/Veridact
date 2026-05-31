// ============================================================
// Sidebar — Role-aware navigation sidebar
// ============================================================
import { Link, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, FolderOpen, FileText,
  BarChart3, Users, Clock, Settings, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types/constants'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['investigator', 'supervisor', 'super_admin'] },
  { label: 'Cases', path: '/dashboard/cases', icon: FolderOpen, roles: ['investigator', 'supervisor', 'super_admin'] },
  { label: 'Reports', path: '/dashboard/reports', icon: FileText, roles: ['investigator', 'supervisor', 'super_admin'] },
  { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, roles: ['supervisor', 'super_admin'] },
]

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Users', path: '/admin/users', icon: Users, roles: ['super_admin'] },
  { label: 'Custody Log', path: '/admin/custody', icon: Clock, roles: ['super_admin'] },
  { label: 'Settings', path: '/admin/settings', icon: Settings, roles: ['super_admin'] },
]

interface SidebarProps {
  role?: UserRole
}

export default function Sidebar({ role }: SidebarProps) {
  const location = useLocation()

  // Read role from localStorage if not passed as prop
  const currentRole: UserRole = role ?? (() => {
    try {
      const user = JSON.parse(localStorage.getItem('veridact_user') ?? '{}')
      return user.role ?? 'investigator'
    } catch { return 'investigator' }
  })()

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentRole))
  const filteredAdmin = ADMIN_ITEMS.filter(item => item.roles.includes(currentRole))

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-slate-950 border-r border-surface-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-surface-border">
        <div className="w-8 h-8 rounded-md bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center">
          <Shield className="w-4 h-4 text-accent-primary" />
        </div>
        <div>
          <span className="font-brand font-bold text-text-primary text-sm tracking-tight block leading-none">
            VERIDACT
          </span>
          <span className="text-[10px] text-text-disabled tracking-widest uppercase">Forensic Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'sidebar-item',
              isActive(item.path) && 'sidebar-item-active'
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
            {isActive(item.path) && (
              <ChevronRight className="w-3 h-3 ml-auto text-accent-primary" />
            )}
          </Link>
        ))}

        {/* Admin section */}
        {filteredAdmin.length > 0 && (
          <>
            <div className="pt-4 pb-2 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
                Administration
              </span>
            </div>
            {filteredAdmin.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'sidebar-item',
                  isActive(item.path) && 'sidebar-item-active'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <ChevronRight className="w-3 h-3 ml-auto text-accent-primary" />
                )}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse-slow" />
          <span className="text-caption text-text-disabled">v0.1.0 — MVP</span>
        </div>
      </div>
    </aside>
  )
}
