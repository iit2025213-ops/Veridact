// ============================================================
// AdminCustodyPage — System-wide custody audit log
// ============================================================
import { Clock, Eye, Upload, Play, CheckCircle, FileText, Download, Edit, Archive, FilePlus } from 'lucide-react'
import type { CustodyAction } from '@/types'

const ACTION_ICONS: Record<string, React.ComponentType<{className?: string}>> = {
  case_created: FilePlus, evidence_uploaded: Upload, evidence_accessed: Eye,
  analysis_started: Play, analysis_completed: CheckCircle, report_generated: FileText,
  file_downloaded: Download, case_updated: Edit, case_closed: Archive,
}

const MOCK_LOGS = [
  { id: 'log-001', action: 'case_created', case_id: 'VRD-2025-000001', user_name: 'System', ip_address: '127.0.0.1', created_at: '2025-05-20T10:30:00Z', details: 'Case created from citizen submission' },
  { id: 'log-002', action: 'evidence_uploaded', case_id: 'VRD-2025-000001', user_name: 'Arjun Thapa', ip_address: '192.168.1.10', created_at: '2025-05-20T11:00:00Z', details: 'suspect_video.mp4 (24.5 MB)' },
  { id: 'log-003', action: 'analysis_started', case_id: 'VRD-2025-000001', user_name: 'Arjun Thapa', ip_address: '192.168.1.10', created_at: '2025-05-22T09:15:00Z', details: 'VERIDACT-v1 model' },
  { id: 'log-004', action: 'analysis_completed', case_id: 'VRD-2025-000001', user_name: 'System', ip_address: '127.0.0.1', created_at: '2025-05-22T09:15:42Z', details: 'Verdict: likely_fake (87%)' },
  { id: 'log-005', action: 'report_generated', case_id: 'VRD-2025-000001', user_name: 'Arjun Thapa', ip_address: '192.168.1.10', created_at: '2025-05-23T10:00:00Z', details: 'forensic_summary.pdf' },
]

export default function AdminCustodyPage() {
  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Custody Audit Log</h1>
        <p className="text-body-sm text-text-muted mt-1">Complete chain-of-custody record for all system events</p>
      </div>

      <div className="card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="text-left px-4 py-3">Action</th>
              <th className="text-left px-4 py-3">Case</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Actor</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">IP</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Details</th>
              <th className="text-left px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map(log => {
              const ActionIcon = ACTION_ICONS[log.action] ?? Clock
              return (
                <tr key={log.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ActionIcon className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                      <span className="text-body-sm text-text-secondary capitalize">{log.action.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono-data text-caption text-accent-primary">{log.case_id}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-body-sm text-text-secondary">{log.user_name}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-mono-data text-caption text-text-muted">{log.ip_address}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-caption text-text-muted truncate max-w-[200px] block">{log.details}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-caption text-text-muted font-mono-data">{new Date(log.created_at).toLocaleString()}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
