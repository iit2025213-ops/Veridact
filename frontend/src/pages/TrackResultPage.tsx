// ============================================================
// TrackResultPage — Public case status display
// Wired to real backend API in Phase 4 via publicService.trackCase().
// ============================================================
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Shield, Loader2, ArrowLeft, Clock, RefreshCw, AlertCircle } from 'lucide-react'
import { trackCase } from '@/services/publicService'

interface PublicCase {
  case_number: string
  status: string
  status_label: string
  complaint_type: string
  created_at: string
  updated_at: string
  public_notes: string[]
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
  const [caseData, setCaseData] = useState<PublicCase | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCase = async () => {
      setIsLoading(true)
      try {
        const data = await trackCase(caseNumber ?? '')
        setCaseData(data)
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setCaseData(null)
        } else {
          setCaseData(null) // treat any error as not found for now
        }
      } finally {
        setIsLoading(false)
      }
    }
    if (caseNumber) fetchCase()
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
          <p className="text-body text-text-muted">
            No case found with number{' '}
            <span className="font-mono-data text-accent-primary">{caseNumber}</span>.
            Please check your submission receipt.
          </p>
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
                {caseData.status_label ?? caseData.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-4 py-3 border-b border-surface-border">
                <span className="text-body-sm text-text-muted w-32 shrink-0">Complaint Type</span>
                <span className="text-body-sm text-text-primary capitalize">
                  {caseData.complaint_type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex gap-4 py-3 border-b border-surface-border">
                <span className="text-body-sm text-text-muted w-32 shrink-0">Submitted</span>
                <span className="text-body-sm text-text-primary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-text-muted" />
                  {new Date(caseData.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex gap-4 py-3">
                <span className="text-body-sm text-text-muted w-32 shrink-0">Last Updated</span>
                <span className="text-body-sm text-text-primary flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
                  {new Date(caseData.updated_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Public notes from investigators */}
          {caseData.public_notes && caseData.public_notes.length > 0 && (
            <div className="card-base p-5 space-y-3">
              <p className="text-caption text-text-muted uppercase tracking-widest">Status Updates</p>
              {caseData.public_notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-accent-subtle/50 border border-accent-primary/20">
                  <AlertCircle className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                  <p className="text-body-sm text-text-secondary">{note}</p>
                </div>
              ))}
            </div>
          )}

          <div className="card-base p-5">
            <p className="text-caption text-text-muted uppercase tracking-widest mb-2">Privacy Notice</p>
            <p className="text-body-sm text-text-secondary">
              Your complaint has been received and is being processed by the Nepal Cyber Bureau.
              Sensitive case details are not publicly disclosed to protect the integrity of the investigation.
            </p>
          </div>

          <p className="text-caption text-text-disabled text-center mt-4">
            For urgent matters, contact the Nepal Cyber Bureau at{' '}
            <span className="text-text-muted">cyber@nepalpolice.gov.np</span>
          </p>
        </div>
      )}
    </div>
  )
}
