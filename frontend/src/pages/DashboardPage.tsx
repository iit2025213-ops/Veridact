// ============================================================
// DashboardPage — Role-specific overview dashboard
// ============================================================
import { useNavigate } from 'react-router-dom'
import {
  FolderOpen, Clock, CheckCircle, AlertTriangle, Activity,
  Plus, ArrowRight, TrendingUp, Users, FileText
} from 'lucide-react'
import { MOCK_CASES } from '@/lib/mockData'
import type { UserRole } from '@/types/constants'

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('veridact_user') ?? '{}') } catch { return {} }
}

const StatCard = ({ label, value, icon: Icon, variant = 'default', trend }: {
  label: string; value: string | number; icon: React.ComponentType<{className?: string}>;
  variant?: 'default' | 'success' | 'warning' | 'danger'; trend?: string
}) => {
  const variantClasses = {
    default: 'text-text-primary',
    success: 'text-accent-primary',
    warning: 'text-status-pending',
    danger: 'text-verdict-fake',
  }
  const iconBg = {
    default: 'bg-slate-700/50',
    success: 'bg-accent-subtle',
    warning: 'bg-amber-400/10',
    danger: 'bg-red-400/10',
  }
  return (
    <div className="card-base card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-body-sm font-medium text-text-muted">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg[variant]}`}>
          <Icon className={`w-4 h-4 ${variantClasses[variant]}`} />
        </div>
      </div>
      <p className={`text-h2 font-bold font-mono-data ${variantClasses[variant]}`}>{value}</p>
      {trend && <p className="text-caption text-text-muted mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const role: UserRole = user.role ?? 'investigator'

  const recentCases = MOCK_CASES.slice(0, 4)

  const stats = role === 'super_admin' || role === 'supervisor'
    ? [
        { label: 'Total Cases', value: MOCK_CASES.length, icon: FolderOpen, variant: 'default' as const, trend: '+3 this week' },
        { label: 'Pending Review', value: MOCK_CASES.filter(c => c.status === 'pending').length, icon: Clock, variant: 'warning' as const },
        { label: 'Analysis Complete', value: MOCK_CASES.filter(c => c.status === 'analysis_complete' || c.status === 'report_generated').length, icon: CheckCircle, variant: 'success' as const },
        { label: 'Critical Priority', value: MOCK_CASES.filter(c => c.priority === 'critical').length, icon: AlertTriangle, variant: 'danger' as const },
      ]
    : [
        { label: 'My Cases', value: MOCK_CASES.filter(c => c.assigned_to === user.id).length || 3, icon: FolderOpen, variant: 'default' as const },
        { label: 'In Review', value: 1, icon: Activity, variant: 'warning' as const },
        { label: 'Completed', value: 2, icon: CheckCircle, variant: 'success' as const },
        { label: 'Reports Generated', value: 1, icon: FileText, variant: 'default' as const },
      ]

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">
            Welcome back, {user.name?.split(' ')[0] ?? 'Investigator'}
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          id="dashboard-new-case"
          onClick={() => navigate('/submit')}
          className="btn-secondary gap-2 hidden sm:flex"
        >
          <Plus className="w-4 h-4" />
          New Case
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Alert: unassigned cases (supervisor/admin only) */}
      {(role === 'supervisor' || role === 'super_admin') && MOCK_CASES.filter(c => !c.assigned_to).length > 0 && (
        <div className="card-base border-l-4 border-l-status-pending bg-amber-400/5 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-status-pending shrink-0" />
            <div>
              <p className="text-body-sm font-semibold text-text-primary">
                {MOCK_CASES.filter(c => !c.assigned_to).length} unassigned case(s)
              </p>
              <p className="text-caption text-text-muted">Assign to investigators to begin processing.</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard/cases')} className="btn-secondary text-caption gap-1 shrink-0">
            View Cases <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Recent cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h4 font-semibold text-text-primary">Recent Cases</h2>
          <button onClick={() => navigate('/dashboard/cases')} className="text-body-sm text-accent-primary hover:text-accent-hover transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="card-base overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3">Case Number</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map(c => (
                <tr
                  key={c.id}
                  id={`dashboard-case-${c.id}`}
                  className="table-row"
                  onClick={() => navigate(`/dashboard/cases/${c.id}`)}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono-data text-body-sm text-accent-primary">{c.case_number}</span>
                    <p className="text-caption text-text-muted truncate max-w-[200px]">{c.title}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-caption text-text-secondary capitalize">{c.complaint_type.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`badge-base border text-caption ${
                      c.priority === 'critical' ? 'text-verdict-fake border-red-400/30 bg-red-400/10' :
                      c.priority === 'high' ? 'text-status-pending border-amber-400/30 bg-amber-400/10' :
                      'text-text-muted border-surface-border bg-surface-elevated'
                    }`}>{c.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-base border text-caption ${
                      c.status === 'pending' ? 'text-status-pending border-amber-400/30 bg-amber-400/10' :
                      c.status === 'in_review' ? 'text-status-review border-blue-400/30 bg-blue-400/10' :
                      c.status === 'analysis_complete' ? 'text-status-complete border-emerald-400/30 bg-emerald-400/10' :
                      'text-text-muted border-surface-border'
                    }`}>{c.status.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-caption text-text-muted">{new Date(c.updated_at).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      {(role === 'super_admin') && (
        <div>
          <h2 className="text-h4 font-semibold text-text-primary mb-4">Admin Quick Access</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Manage Users', path: '/admin/users', icon: Users },
              { label: 'Custody Log', path: '/admin/custody', icon: Clock },
              { label: 'All Reports', path: '/dashboard/reports', icon: FileText },
            ].map(item => (
              <button
                key={item.label}
                id={`dashboard-quick-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => navigate(item.path)}
                className="card-base card-hover p-5 flex flex-col items-center gap-3 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-subtle border border-accent-primary/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-accent-primary" />
                </div>
                <span className="text-body-sm font-medium text-text-secondary">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
