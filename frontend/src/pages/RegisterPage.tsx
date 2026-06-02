// ============================================================
// RegisterPage — Citizen self-registration
// ============================================================
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      // 1. Register user
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      
      // 2. Auto login
      const loginSuccess = await login({
        email: data.email,
        password: data.password,
      })

      if (loginSuccess) {
        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        setError('Registration succeeded, but auto-login failed. Please sign in.')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : 'Registration failed')
      } else {
        setError('Registration failed. Please try again.')
      }
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
              <p className="text-body-sm text-text-muted mt-1">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-body-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="register-name" 
                    type="text" 
                    {...register('name')}
                    className={`input-base pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Your full name" 
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="register-email" className="block text-body-sm font-medium text-text-secondary mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="register-email" 
                    type="email" 
                    {...register('email')}
                    className={`input-base pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="you@example.com" 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="register-password" className="block text-body-sm font-medium text-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="register-password" 
                    type={showPassword ? 'text' : 'password'} 
                    {...register('password')}
                    className={`input-base pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Min. 8 characters" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="register-confirm" className="block text-body-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="register-confirm" 
                    type="password" 
                    {...register('confirm_password')}
                    className={`input-base pl-10 ${errors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Repeat your password" 
                  />
                </div>
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
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
