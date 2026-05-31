// ============================================================
// LoginPage — Investigator/Admin login form
// ============================================================
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({ email, password })
    if (success) {
      navigate(from, { replace: true })
    }
  }

  const demoCredentials = [
    { label: 'Admin', email: 'admin@veridact.gov.np', password: 'admin123' },
    { label: 'Investigator', email: 'investigator@veridact.gov.np', password: 'pass1234' },
    { label: 'Supervisor', email: 'supervisor@veridact.gov.np', password: 'pass1234' },
  ]

  return (
    <div className="min-h-screen bg-forensic-grid bg-surface-base flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card-base p-8 shadow-modal">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent-subtle border border-accent-primary/30 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent-primary" />
            </div>
            <h1 className="text-h3 font-bold text-text-primary font-brand">VERIDACT</h1>
            <p className="text-body-sm text-text-muted mt-1">Investigator Portal</p>
          </div>

          {/* Form */}
          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-body-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-base pl-10"
                  placeholder="you@veridact.gov.np"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-body-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-base pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-body-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-lg bg-slate-950/60 border border-surface-border">
            <p className="text-caption font-semibold text-text-disabled uppercase tracking-widest mb-2">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {demoCredentials.map(demo => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => { setEmail(demo.email); setPassword(demo.password) }}
                  className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-surface-elevated transition-colors group"
                >
                  <span className="text-body-sm font-medium text-text-secondary group-hover:text-text-primary">
                    {demo.label}
                  </span>
                  <span className="text-caption text-text-disabled font-mono-data">{demo.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 flex items-center justify-between">
            <Link to="/" className="text-body-sm text-text-muted hover:text-text-primary transition-colors">
              ← Back to Home
            </Link>
            <Link to="/register" className="text-body-sm text-accent-primary hover:text-accent-hover transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
