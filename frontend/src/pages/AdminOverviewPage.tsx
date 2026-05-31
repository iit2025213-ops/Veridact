// ============================================================
// AdminOverviewPage — Super admin system overview
// ============================================================
import { useNavigate } from 'react-router-dom'
import { Users, Clock, Settings, FolderOpen, FileText, Activity } from 'lucide-react'

export default function AdminOverviewPage() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Admin Overview</h1>
        <p className="text-body-sm text-text-muted mt-1">System-wide health and management</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: 12, icon: Users },
          { label: 'Total Cases', value: 952, icon: FolderOpen },
          { label: 'Evidence Files', value: 2847, icon: Activity },
          { label: 'Reports Generated', value: 1203, icon: FileText },
          { label: 'Custody Events', value: 18392, icon: Clock },
          { label: 'System Status', value: 'Operational', icon: Settings },
        ].map(stat => (
          <div key={stat.label} className="card-base p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-accent-primary" />
              </div>
              <p className="text-body-sm text-text-muted">{stat.label}</p>
            </div>
            <p className="text-h2 font-bold font-mono-data text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Manage Users', path: '/admin/users', icon: Users, desc: 'Create, edit, deactivate user accounts' },
          { label: 'Custody Log', path: '/admin/custody', icon: Clock, desc: 'Full audit trail of all system events' },
          { label: 'Settings', path: '/admin/settings', icon: Settings, desc: 'View system configuration and .env values' },
        ].map(item => (
          <button key={item.label} id={`admin-overview-${item.label.toLowerCase().replace(/\s/g, '-')}`} onClick={() => navigate(item.path)} className="card-base card-hover p-6 text-left">
            <item.icon className="w-6 h-6 text-accent-primary mb-3" />
            <p className="text-body font-semibold text-text-primary">{item.label}</p>
            <p className="text-body-sm text-text-muted mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
