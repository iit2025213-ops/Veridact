// ============================================================
// AdminSettingsPage — System configuration (read-only MVP)
// ============================================================
import { Settings, Info } from 'lucide-react'

const CONFIG_ITEMS = [
  { section: 'Backend', items: [
    { key: 'BACKEND_URL', value: 'http://localhost:8000', sensitive: false },
    { key: 'DATABASE_URL', value: 'sqlite:///./veridact.db', sensitive: false },
    { key: 'SECRET_KEY', value: '••••••••••••••••', sensitive: true },
    { key: 'JWT_EXPIRY_HOURS', value: '24', sensitive: false },
  ]},
  { section: 'AI Models', items: [
    { key: 'AI_MODEL_ENABLED', value: 'false (fallback mode)', sensitive: false },
    { key: 'HEATMAP_ENABLED', value: 'false', sensitive: false },
    { key: 'MAX_FILE_SIZE_MB', value: '100', sensitive: false },
  ]},
  { section: 'Storage', items: [
    { key: 'UPLOAD_DIR', value: './uploads/evidence', sensitive: false },
    { key: 'REPORTS_DIR', value: './uploads/reports', sensitive: false },
  ]},
]

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">System Settings</h1>
        <p className="text-body-sm text-text-muted mt-1">Read-only configuration display. Edit values in <code className="font-mono-data text-accent-primary">.env</code> file.</p>
      </div>

      <div className="card-base border-l-4 border-l-status-pending bg-amber-400/5 p-4 flex gap-3">
        <Info className="w-5 h-5 text-status-pending shrink-0 mt-0.5" />
        <p className="text-body-sm text-text-secondary">Settings are displayed for transparency. In the MVP, editing is done by modifying the <code className="font-mono-data text-accent-primary">.env</code> file directly. Full settings UI is planned for Phase 4.</p>
      </div>

      {CONFIG_ITEMS.map(section => (
        <div key={section.section} className="card-base overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border bg-slate-950/40 flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent-primary" />
            <h2 className="text-body-sm font-semibold text-text-primary">{section.section}</h2>
          </div>
          <table className="w-full">
            <tbody>
              {section.items.map(item => (
                <tr key={item.key} className="border-b border-surface-border last:border-0">
                  <td className="px-5 py-3 w-1/2">
                    <span className="font-mono-data text-body-sm text-text-muted">{item.key}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`font-mono-data text-body-sm ${item.sensitive ? 'text-text-disabled' : 'text-text-primary'}`}>{item.value}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
