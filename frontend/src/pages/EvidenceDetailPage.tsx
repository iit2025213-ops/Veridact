// ============================================================
// EvidenceDetailPage — AI analysis result view
// ============================================================
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Shield, Zap, Loader2, Copy, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Verdict = 'authentic' | 'suspicious' | 'likely_fake' | 'inconclusive'

const VERDICT_CONFIG: Record<Verdict, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{className?: string}> }> = {
  authentic:    { label: 'Authentic', color: 'text-verdict-authentic', bg: 'bg-emerald-400/10', border: 'border-emerald-500/30', icon: Shield },
  suspicious:   { label: 'Suspicious', color: 'text-verdict-suspicious', bg: 'bg-orange-400/10', border: 'border-orange-500/30', icon: AlertTriangle },
  likely_fake:  { label: 'Likely Fake', color: 'text-verdict-fake', bg: 'bg-red-400/10', border: 'border-red-500/30', icon: AlertTriangle },
  inconclusive: { label: 'Inconclusive', color: 'text-verdict-inconclusive', bg: 'bg-slate-400/10', border: 'border-slate-500/30', icon: Shield },
}

export default function EvidenceDetailPage() {
  const { caseId, evidenceId } = useParams<{ caseId: string; evidenceId: string }>()
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{ verdict: Verdict; score: number; explanation: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const mockHash = 'a3f4b2c1d8e97f62ba01c9d4e6f38271a85c6d0e2b73f94d1e7a820c9b45681f'
  const mockFile = { name: 'suspect_video.mp4', type: 'video', size: '24.5 MB', uploaded: new Date().toISOString() }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    await new Promise(res => setTimeout(res, 3000))
    setAnalyzing(false)
    setResult({ verdict: 'likely_fake', score: 0.87, explanation: 'Facial landmark inconsistencies detected in 43% of frames. Temporal blending artifacts visible around mouth and eye regions, consistent with GAN-based face-swap. Metadata analysis shows encoding inconsistencies incompatible with the claimed device model.' })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(mockHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-5 animate-slide-up">
      {/* Breadcrumb */}
      <Link to={`/dashboard/cases/${caseId}`} className="inline-flex items-center gap-2 text-body-sm text-text-muted hover:text-text-primary">
        <ArrowLeft className="w-4 h-4" /> Back to Case
      </Link>

      {/* File metadata card */}
      <div className="card-base p-6 border-l-4 border-l-blue-400">
        <h2 className="text-h4 font-semibold text-text-primary mb-4">Evidence File</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Filename', value: mockFile.name },
            { label: 'Type', value: mockFile.type },
            { label: 'File Size', value: mockFile.size },
            { label: 'Uploaded', value: new Date(mockFile.uploaded).toLocaleDateString() },
          ].map(item => (
            <div key={item.label}>
              <p className="text-caption text-text-muted uppercase tracking-widest">{item.label}</p>
              <p className="text-body-sm font-medium text-text-primary mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
        {/* SHA-256 Hash */}
        <div>
          <p className="text-caption text-text-muted uppercase tracking-widest mb-1.5">SHA-256 Integrity Hash</p>
          <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2">
            <code className="font-mono-data text-caption text-text-secondary flex-1 break-all">{mockHash}</code>
            <button
              id="evidence-copy-hash"
              onClick={handleCopy}
              className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Copy hash"
            >
              {copied ? <Check className="w-4 h-4 text-accent-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis section */}
      {!result && (
        <div className="card-base p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-subtle border border-accent-primary/30 flex items-center justify-center mx-auto mb-5">
            <Zap className="w-8 h-8 text-accent-primary" />
          </div>
          <h2 className="text-h3 font-bold text-text-primary mb-2">Run AI Analysis</h2>
          <p className="text-body text-text-muted mb-8 max-w-md mx-auto">
            VERIDACT AI will analyze this {mockFile.type} for deepfake artifacts, manipulation indicators, and integrity anomalies.
          </p>
          <button
            id="evidence-analyze-btn"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="btn-primary px-8 py-3 text-body-sm"
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing... This may take up to 30 seconds</>
            ) : (
              <><Zap className="w-4 h-4" /> Analyze Evidence</>
            )}
          </button>
          {analyzing && (
            <p className="text-caption text-text-muted mt-4 animate-pulse">Running GAN detection · checking metadata · scanning landmarks...</p>
          )}
        </div>
      )}

      {/* Result */}
      {result && (() => {
        const config = VERDICT_CONFIG[result.verdict]
        const scorePercent = Math.round(result.score * 100)
        return (
          <div className={cn('card-base p-6 border', config.border, config.bg)}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-caption text-text-muted uppercase tracking-widest mb-1">AI Forensic Verdict</p>
                <div className="flex items-center gap-2">
                  <config.icon className={cn('w-6 h-6', config.color)} />
                  <span className={cn('text-h2 font-bold', config.color)}>{config.label}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-caption text-text-muted">Confidence Score</p>
                <p className={cn('text-h2 font-bold font-mono-data', config.color)}>{scorePercent}%</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', result.score > 0.65 ? 'bg-verdict-fake' : result.score > 0.4 ? 'bg-status-pending' : 'bg-accent-primary')}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-caption text-text-disabled">Authentic</span>
                <span className="text-caption text-text-disabled">Likely Fake</span>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <p className="text-caption text-text-muted uppercase tracking-widest mb-2">Analysis Explanation</p>
              <p className="text-body-sm text-text-secondary leading-relaxed">{result.explanation}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-surface-border">
              <div>
                <p className="text-caption text-text-muted">Model Used</p>
                <p className="text-body-sm font-medium text-text-primary">VERIDACT-v1 (Fallback Stub)</p>
              </div>
              <div>
                <p className="text-caption text-text-muted">Analyzed At</p>
                <p className="text-body-sm font-medium text-text-primary">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
