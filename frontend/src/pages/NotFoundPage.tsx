// ============================================================
// NotFoundPage — 404 error page
// ============================================================
import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-accent-subtle border border-accent-primary/30 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-accent-primary" />
        </div>
        <p className="font-mono-data text-display font-bold text-surface-border">404</p>
        <h1 className="text-h2 font-bold text-text-primary mt-2 mb-3">Page Not Found</h1>
        <p className="text-body text-text-muted mb-8">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => window.history.back()} className="btn-ghost gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link to="/" className="btn-primary gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
