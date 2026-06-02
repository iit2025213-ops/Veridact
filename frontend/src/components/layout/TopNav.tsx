// ============================================================
// TopNav — Top navigation bar for authenticated pages
// ============================================================
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, LogOut, User, ChevronDown, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/cases': 'Cases',
  '/dashboard/reports': 'Reports',
  '/dashboard/analytics': 'Analytics',
  '/admin': 'Admin Overview',
  '/admin/users': 'User Management',
  '/admin/custody': 'Custody Log',
  '/admin/settings': 'Settings',
}

export default function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const currentUser = user ?? { name: 'User', role: 'investigator', email: '' }

  const isNestedPage = !ROUTE_LABELS[location.pathname]

  const pageTitle = (() => {
    const exact = ROUTE_LABELS[location.pathname]
    if (exact) return exact
    if (location.pathname.includes('/evidence/')) return 'Evidence Analysis'
    if (location.pathname.match(/\/cases\/[^/]+$/)) return 'Case Detail'
    return 'VERIDACT'
  })()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    supervisor: 'Supervisor',
    investigator: 'Investigator',
    citizen: 'Citizen',
    api_partner: 'API Partner',
  }

  return (
    <header className="h-14 bg-slate-950 border-b border-surface-border flex items-center justify-between px-6 shrink-0 relative z-30">
      {/* Page title and Back button */}
      <div className="flex items-center gap-4">
        {isNestedPage && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <h1 className="text-body font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications bell (placeholder) */}
        <button
          id="topnav-notifications"
          className="w-8 h-8 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-primary" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            id="topnav-user-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-surface-elevated transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-accent-subtle border border-accent-primary/30 flex items-center justify-center">
              <span className="text-caption font-semibold text-accent-primary">
                {currentUser.name?.[0] ?? 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-body-sm font-medium text-text-primary leading-none">
                {currentUser.name}
              </p>
              <p className="text-caption text-text-muted leading-none mt-0.5">
                {roleLabel[currentUser.role] ?? currentUser.role}
              </p>
            </div>
            <ChevronDown className={cn('w-3 h-3 text-text-muted transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-card border border-surface-border rounded-lg shadow-modal z-20 py-1 animate-fade-in">
                <div className="px-4 py-2 border-b border-surface-border">
                  <p className="text-body-sm font-medium text-text-primary truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-caption text-text-muted truncate">{currentUser.email}</p>
                </div>
                <button
                  id="topnav-profile"
                  className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-3.5 h-3.5" />
                  Profile
                </button>
                <button
                  id="topnav-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
