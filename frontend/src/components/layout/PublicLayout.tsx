// ============================================================
// PublicLayout — Layout for public-facing pages
// ============================================================
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, Github, ArrowLeft, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function PublicLayout() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      {/* Public header */}
      <header className="border-b border-surface-border bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo & Back */}
          <div className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                <Shield className="w-4 h-4 text-accent-primary" />
              </div>
              <span className="font-brand font-bold text-text-primary text-lg tracking-tight">
                VERIDACT
              </span>
            </Link>
          </div>

          {/* Public nav */}
          <nav className="flex items-center gap-6">
            <Link
              to="/track"
              className="text-body-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Track Case
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-body-sm font-medium text-accent-primary hover:text-accent-hover transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                {user?.name || 'Dashboard'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn-secondary text-body-sm"
              >
                Investigator Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-slate-950 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-primary" />
            <span className="text-caption text-text-muted font-brand font-semibold">VERIDACT</span>
            <span className="text-caption text-text-disabled">— Nepal Cyber Bureau</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-caption text-text-disabled">See Through the Fake. Secure the Truth.</span>
            <a
              href="https://github.com/iit2025213-ops/Veridact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
