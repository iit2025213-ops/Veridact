// ============================================================
// CaseDetailPage — Full case view with tabs and actions
// ============================================================
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Eye, FileText, Clock, Zap, Upload, Loader2, CheckCircle, UserCheck, AlertTriangle } from 'lucide-react'
import { MOCK_CASES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<string, string> = {
  pending: 'text-status-pending border-amber-400/30 bg-amber-400/10',
  in_review: 'text-status-review border-blue-400/30 bg-blue-400/10',
  analysis_complete: 'text-status-complete border-emerald-400/30 bg-emerald-400/10',
  report_generated: 'text-status-referred border-purple-400/30 bg-purple-400/10',
  closed: 'text-text-muted border-surface-border bg-surface-elevated',
  referred: 'text-status-referred border-purple-400/30 bg-purple-400/10',
}

const TABS = ['Evidence', 'Notes', 'Custody Log', 'Reports']

const INVESTIGATORS = [
  { id: 'usr-002', name: 'Arjun Thapa' },
  { id: 'usr-004', name: 'Ramesh Giri' },
  { id: 'usr-005', name: 'Sita Devkota' },
]

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  
  // State for notification
  const [notification, setNotification] = useState<string | null>(null)
  
  // Dynamic User Role Simulation
  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('veridact_user')
      return stored ? JSON.parse(stored) : { role: 'supervisor', name: 'Priya Sharma' }
    } catch {
      return { role: 'supervisor', name: 'Priya Sharma' }
    }
  })

  // State for case data
  const [currentCase, setCurrentCase] = useState(() => {
    return MOCK_CASES.find(c => c.id === caseId) || null
  })

  // State for custody logs
  const [custodyLogs, setCustodyLogs] = useState(() => {
    if (!currentCase) return []
    return [
      { action: 'case_created', time: currentCase.created_at, actor: 'System', detail: 'Case created from citizen submission' },
      { action: 'evidence_uploaded', time: currentCase.updated_at, actor: currentCase.assigned_to_name ?? 'System', detail: '2 evidence files uploaded' },
    ]
  })

  if (!currentCase) {
    return (
      <div className="text-center py-16">
        <p className="text-h3 font-bold text-text-primary mb-2">Case Not Found</p>
        <Link to="/dashboard/cases" className="text-accent-primary hover:text-accent-hover text-body-sm">← Back to cases</Link>
      </div>
    )
  }

  const showToast = (message: string) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    await new Promise(res => setTimeout(res, 2000))
    setGeneratingReport(false)
    setReportGenerated(true)
    
    // Add to custody logs
    setCustodyLogs(prev => [
      ...prev,
      {
        action: 'report_generated',
        time: new Date().toISOString(),
        actor: currentUser.name,
        detail: 'PDF Case report compiled and certified.'
      }
    ])
    showToast('Report generated successfully!')
  }

  // Action handlers
  const handleUpdateStatus = (newStatus: string) => {
    setCurrentCase(prev => {
      if (!prev) return null
      return { ...prev, status: newStatus, updated_at: new Date().toISOString() }
    })
    setCustodyLogs(prev => [
      ...prev,
      {
        action: 'status_updated',
        time: new Date().toISOString(),
        actor: currentUser.name,
        detail: `Status changed to: ${newStatus.replace(/_/g, ' ')}`
      }
    ])
    showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`)
  }

  const handleAssignInvestigator = (invId: string) => {
    const inv = INVESTIGATORS.find(i => i.id === invId)
    const name = inv ? inv.name : 'Unassigned'
    setCurrentCase(prev => {
      if (!prev) return null
      return {
        ...prev,
        assigned_to: invId || null,
        assigned_to_name: invId ? name : null,
        updated_at: new Date().toISOString()
      }
    })
    setCustodyLogs(prev => [
      ...prev,
      {
        action: 'case_assigned',
        time: new Date().toISOString(),
        actor: currentUser.name,
        detail: `Case assigned to investigator: ${name}`
      }
    ])
    showToast(`Case assigned to ${name}`)
  }

  const handleUpdatePriority = (newPriority: string) => {
    setCurrentCase(prev => {
      if (!prev) return null
      return { ...prev, priority: newPriority, updated_at: new Date().toISOString() }
    })
    setCustodyLogs(prev => [
      ...prev,
      {
        action: 'priority_updated',
        time: new Date().toISOString(),
        actor: currentUser.name,
        detail: `Priority changed to: ${newPriority}`
      }
    ])
    showToast(`Priority set to ${newPriority}`)
  }

  const isSupervisorOrAdmin = currentUser.role === 'supervisor' || currentUser.role === 'super_admin'
  const isSuperAdmin = currentUser.role === 'super_admin'

  return (
    <div className="space-y-5 animate-slide-up relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border-l-4 border-accent-primary text-text-primary px-4 py-3 rounded shadow-xl flex items-center gap-2 animate-bounce-in max-w-sm">
          <CheckCircle className="w-5 h-5 text-accent-primary shrink-0" />
          <span className="text-body-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <Link to="/dashboard/cases" className="inline-flex items-center gap-2 text-body-sm text-text-muted hover:text-text-primary">
        <ArrowLeft className="w-4 h-4" /> Cases
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Columns: Main case info & tabs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Case header */}
          <div className="card-base p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-mono-data text-body-sm text-accent-primary bg-accent-subtle px-2 py-0.5 rounded">
                    {currentCase.case_number}
                  </span>
                  <span className={`badge-base border ${STATUS_BADGE[currentCase.status] ?? ''}`}>{currentCase.status.replace(/_/g, ' ')}</span>
                  <span className={`badge-base border ${
                    currentCase.priority === 'critical' ? 'text-verdict-fake border-red-400/30 bg-red-400/10' :
                    currentCase.priority === 'high' ? 'text-status-pending border-amber-400/30 bg-amber-400/10' :
                    'text-text-muted border-surface-border'
                  }`}>{currentCase.priority} priority</span>
                </div>
                <h1 className="text-h3 font-bold text-text-primary mb-1">{currentCase.title}</h1>
                <p className="text-body-sm text-text-muted capitalize">{currentCase.complaint_type.replace(/_/g, ' ')}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-surface-border">
              {[
                { label: 'Assigned To', value: currentCase.assigned_to_name ?? 'Unassigned' },
                { label: 'Evidence Files', value: currentCase.evidence_count ?? 0 },
                { label: 'Submitted', value: new Date(currentCase.created_at).toLocaleDateString() },
                { label: 'Last Updated', value: new Date(currentCase.updated_at).toLocaleDateString() },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-caption text-text-muted uppercase tracking-widest">{item.label}</p>
                  <p className="text-body-sm font-medium text-text-primary mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-surface-border">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                id={`casedetail-tab-${tab.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setActiveTab(i)}
                className={cn(
                  'px-5 py-3 text-body-sm font-medium transition-colors border-b-2 -mb-px',
                  activeTab === i
                    ? 'text-accent-primary border-accent-primary'
                    : 'text-text-muted border-transparent hover:text-text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="card-base p-6">
            {/* Evidence tab */}
            {activeTab === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-h4 font-semibold text-text-primary">Evidence Files</h2>
                  <button id="casedetail-upload-evidence" className="btn-secondary text-body-sm gap-2">
                    <Upload className="w-4 h-4" /> Upload File
                  </button>
                </div>
                {/* Mock evidence items */}
                {[
                  { name: 'suspect_video.mp4', type: 'video', size: '24.5 MB', hash: 'a3f4b2c1d8e9...', status: 'analysis_complete' },
                  { name: 'screenshot_proof.jpg', type: 'image', size: '2.1 MB', hash: 'f9e1d3c2b4a7...', status: 'pending' },
                ].map((ev, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-4 bg-slate-950/40 rounded-lg border border-surface-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-surface-elevated flex items-center justify-center">
                        <Eye className="w-4 h-4 text-text-muted" />
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-text-primary">{ev.name}</p>
                        <p className="text-caption text-text-muted">{ev.type} · {ev.size} · <span className="font-mono-data">{ev.hash}</span></p>
                      </div>
                    </div>
                    <button
                      id={`casedetail-analyze-${i}`}
                      onClick={() => navigate(`/dashboard/cases/${caseId}/evidence/ev-00${i + 1}`)}
                      className={cn('btn-secondary text-caption gap-1.5 shrink-0', ev.status === 'analysis_complete' ? 'text-accent-primary' : '')}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {ev.status === 'analysis_complete' ? 'View Analysis' : 'Analyze'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Notes tab */}
            {activeTab === 1 && (
              <div className="text-center py-10 text-text-muted">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-body-sm">No notes added yet.</p>
                <button id="casedetail-add-note" className="btn-secondary mt-4 text-body-sm">Add Note</button>
              </div>
            )}

            {/* Custody Log tab */}
            {activeTab === 2 && (
              <div className="space-y-3">
                {custodyLogs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-accent-primary mt-1.5" />
                      {i < custodyLogs.length - 1 && <div className="w-px flex-1 bg-surface-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-body-sm font-medium text-text-primary capitalize">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-caption text-text-muted">{log.actor} · {new Date(log.time).toLocaleString()}</p>
                      <p className="text-caption text-text-disabled mt-0.5">{log.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reports tab */}
            {activeTab === 3 && (
              <div className="text-center py-10 text-text-muted">
                {reportGenerated ? (
                  <div>
                    <CheckCircle className="w-8 h-8 text-accent-primary mx-auto mb-3" />
                    <p className="text-body font-semibold text-text-primary">Report Ready</p>
                    <button id="casedetail-download-report" className="btn-primary mt-4 gap-2">
                      <FileText className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                ) : (
                  <div>
                    <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-body-sm">No reports generated yet.</p>
                    <button onClick={handleGenerateReport} className="btn-secondary mt-4 text-body-sm">Generate Report</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions Panel */}
        <div className="space-y-6">
          <div className="card-base p-6 space-y-6">
            <h2 className="text-body-sm font-bold text-text-primary uppercase tracking-wider border-b border-surface-border pb-3">
              Case Actions
            </h2>

            {/* Update Status */}
            <div className="space-y-2">
              <label className="text-caption text-text-muted uppercase tracking-widest block font-semibold">
                Update Status
              </label>
              <select
                id="casedetail-status-select"
                value={currentCase.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="input-base text-body-sm"
              >
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="analysis_complete">Analysis Complete</option>
                <option value="report_generated">Report Generated</option>
                <option value="referred">Referred</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Assignment Section (Supervisor / Admin only) */}
            {isSupervisorOrAdmin ? (
              <div className="space-y-2 pt-4 border-t border-surface-border/40">
                <label className="text-caption text-text-muted uppercase tracking-widest block font-semibold">
                  Assign Investigator
                </label>
                <select
                  id="casedetail-assign-select"
                  value={currentCase.assigned_to || ''}
                  onChange={(e) => handleAssignInvestigator(e.target.value)}
                  className="input-base text-body-sm"
                >
                  <option value="">Unassigned</option>
                  {INVESTIGATORS.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} (Investigator)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1 pt-4 border-t border-surface-border/40">
                <span className="text-caption text-text-muted uppercase tracking-widest block font-semibold">
                  Assigned Investigator
                </span>
                <div className="flex items-center gap-2 text-body-sm text-text-secondary mt-1">
                  <UserCheck className="w-4 h-4 text-accent-primary" />
                  <span>{currentCase.assigned_to_name ?? 'Unassigned'}</span>
                </div>
              </div>
            )}

            {/* Update Priority (Supervisor / Admin only) */}
            {isSupervisorOrAdmin && (
              <div className="space-y-2 pt-4 border-t border-surface-border/40">
                <label className="text-caption text-text-muted uppercase tracking-widest block font-semibold">
                  Case Priority
                </label>
                <select
                  id="casedetail-priority-select"
                  value={currentCase.priority}
                  onChange={(e) => handleUpdatePriority(e.target.value)}
                  className="input-base text-body-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            )}

            {/* Generate Report Button */}
            <div className="pt-4 border-t border-surface-border/40">
              <button
                id="casedetail-generate-report"
                onClick={handleGenerateReport}
                disabled={generatingReport || reportGenerated}
                className={cn('btn-primary w-full text-body-sm gap-2', reportGenerated && 'opacity-75 cursor-default')}
              >
                {generatingReport ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : reportGenerated ? (
                  <><CheckCircle className="w-4 h-4" /> Report Ready</>
                ) : (
                  <><FileText className="w-4 h-4" /> Generate Report</>
                )}
              </button>
            </div>
          </div>

          {/* Danger Zone (Admin Only) */}
          {isSuperAdmin && (
            <div className="card-base p-6 border-red-500/20 bg-red-950/10 space-y-4">
              <h3 className="text-body-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Danger Zone
              </h3>
              <p className="text-caption text-text-muted">
                Closing this case marks it as resolved. This action will be logged in the custody chain.
              </p>
              <button
                onClick={() => handleUpdateStatus('closed')}
                disabled={currentCase.status === 'closed'}
                className="btn-danger w-full text-body-sm py-2"
              >
                Close Case
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

  
