// ============================================================
// RegisterPage — Citizen self-registration
// ============================================================
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsLoading(true)
    try {
      // TODO Phase 3: Replace with authService.register()
      await new Promise(res => setTimeout(res, 1000))
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forensic-grid bg-surface-base flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card-base p-8 shadow-modal">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent-subtle border border-accent-primary/30 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent-primary" />
            </div>
            <h1 className="text-h3 font-bold text-text-primary font-brand">Create Account</h1>
            <p className="text-body-sm text-text-muted mt-1">Citizen access to VERIDACT</p>
          </div>

          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-accent-primary mx-auto mb-3" />
              <p className="text-body font-semibold text-text-primary">Account Created!</p>
              <p className="text-body-sm text-text-muted mt-1">Redirecting to login...</p>
            </div>
          ) : (
            <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-body-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input id="register-name" name="full_name" type="text" value={formData.full_name} onChange={handleChange} className="input-base pl-10" placeholder="Your full name" required minLength={2} />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-body-sm font-medium text-text-secondary mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input id="register-email" name="email" type="email" value={formData.email} onChange={handleChange} className="input-base pl-10" placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-body-sm font-medium text-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="input-base pl-10 pr-10" placeholder="Min. 8 characters" required minLength={8} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="register-confirm" className="block text-body-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input id="register-confirm" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} className="input-base pl-10" placeholder="Repeat your password" required />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-body-sm text-red-400">{error}</p>
                </div>
              )}

              <button id="register-submit" type="submit" disabled={isLoading} className="btn-primary w-full py-2.5">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <span className="text-body-sm text-text-muted">Already have an account? </span>
            <Link to="/login" className="text-body-sm text-accent-primary hover:text-accent-hover">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
