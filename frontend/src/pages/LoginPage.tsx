// ============================================================
// LoginPage — Investigator/Admin login form
// ============================================================
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data)
    if (success) {
      // Small hack: to get the role we either await a second or we can just read from localStorage 
      // since login saves it. Alternatively, since login sets user in Context, we can let the ProtectedRoute handle redirect 
      // or we can read it immediately from local storage.
      const storedUser = localStorage.getItem('veridact_user')
      let role = 'citizen'
      if (storedUser) {
        try { role = JSON.parse(storedUser).role } catch {}
      }
      const defaultDest = role === 'super_admin' ? '/admin' : '/dashboard'
      navigate(from ?? defaultDest, { replace: true })
    }
  }

  const demoCredentials = [
    { label: 'Admin', email: 'admin@veridact.gov.np', password: 'demo1234' },
    { label: 'Investigator', email: 'inv1@veridact.gov.np', password: 'demo1234' },
    { label: 'Citizen', email: 'citizen1@veridact.gov.np', password: 'demo1234' },
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
          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  {...register('email')}
                  className={`input-base pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="you@veridact.gov.np"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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
                  {...register('password')}
                  className={`input-base pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
                  onClick={() => { setValue('email', demo.email); setValue('password', demo.password) }}
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
