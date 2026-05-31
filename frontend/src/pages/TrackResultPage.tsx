// ============================================================
// TrackResultPage — Public case status display
// ============================================================
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Shield, Loader2, ArrowLeft, Clock, RefreshCw } from 'lucide-react'
import { MOCK_CASES } from '@/lib/mockData'
import type { CaseStatus } from '@/types/constants'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Received — Under Review',
  in_review: 'Under Active Investigation',
  analysis_complete: 'Analysis Complete',
  report_generated: 'Report Generated',
  closed: 'Case Closed',
  referred: 'Referred to Authority',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-status-pending bg-amber-400/10 border-amber-400/30',
  in_review: 'text-status-review bg-blue-400/10 border-blue-400/30',
  analysis_complete: 'text-status-complete bg-emerald-400/10 border-emerald-400/30',
  report_generated: 'text-status-referred bg-purple-400/10 border-purple-400/30',
  closed: 'text-status-closed bg-slate-400/10 border-slate-400/30',
  referred: 'text-status-referred bg-purple-400/10 border-purple-400/30',
}

export default function TrackResultPage() {
  const { caseNumber } = useParams<{ caseNumber: string }>()
  const [caseData, setCaseData] = useState<typeof MOCK_CASES[0] | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCase = async () => {
      setIsLoading(true)
      await new Promise(res => setTimeout(res, 800))
      // TODO Phase 3: caseService.getPublicCaseStatus(caseNumber)
      const found = MOCK_CASES.find(c => c.case_number === caseNumber)
      setCaseData(found ?? null)
      setIsLoading(false)
    }
    fetchCase()
  }, [caseNumber])

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <Link to="/track" className="inline-flex items-center gap-2 text-body-sm text-text-muted hover:text-text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> Track another case
      </Link>

      {isLoading && (
        <div className="card-base p-12 text-center">
          <Loader2 className="w-8 h-8 text-accent-primary animate-spin mx-auto mb-3" />
          <p className="text-body text-text-muted">Looking up your case...</p>
        </div>
      )}

      {!isLoading && caseData === null && (
        <div className="card-base p-10 text-center">
          <Shield className="w-10 h-10 text-text-disabled mx-auto mb-4" />
          <h2 className="text-h3 font-bold text-text-primary mb-2">Case Not Found</h2>
          <p className="text-body text-text-muted">No case found with number <span className="font-mono-data text-accent-primary">{caseNumber}</span>. Please check your receipt.</p>
        </div>
      )}

      {!isLoading && caseData && (
        <div className="space-y-4">
          <div className="card-base p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-caption text-text-muted uppercase tracking-widest mb-1">Case Number</p>
                <p className="font-mono-data text-h3 font-bold text-accent-primary">{caseData.case_number}</p>
              </div>
              <span className={`badge-base border ${STATUS_COLORS[caseData.status] ?? ''}`}>
                {STATUS_LABELS[caseData.status] ?? caseData.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-4 py-3 border-b border-surface-border">
                <span className="text-body-sm text-text-muted w-32 shrink-0">Complaint Type</span>
                <span className="text-body-sm text-text-primary capitalize">{caseData.complaint_type.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex gap-4 py-3 border-b border-surface-border">
                <span className="text-body-sm text-text-muted w-32 shrink-0">Submitted</span>
                <span className="text-body-sm text-text-primary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-text-muted" />
                  {new Date(caseData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex gap-4 py-3">
                <span className="text-body-sm text-text-muted w-32 shrink-0">Last Updated</span>
                <span className="text-body-sm text-text-primary flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
                  {new Date(caseData.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="card-base p-5">
            <p className="text-caption text-text-muted uppercase tracking-widest mb-2">Public Status Note</p>
            <p className="text-body-sm text-text-secondary">
              Your complaint has been received and is being processed by the Nepal Cyber Bureau.
              Sensitive case details are not publicly disclosed to protect the integrity of the investigation.
            </p>
          </div>

          <p className="text-caption text-text-disabled text-center mt-4">
            For urgent matters, contact the Nepal Cyber Bureau at <span className="text-text-muted">cyber@nepalpolice.gov.np</span>
          </p>
        </div>
      )}
    </div>
  )
}
