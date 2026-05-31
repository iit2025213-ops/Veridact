// ============================================================
// SubmitPage — Citizen Evidence Submission Wizard (4 steps)
// ============================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Image, Video, Mic, FileText, User, HelpCircle,
  Shield, CheckCircle, Upload, Loader2, Copy, Check,
  ArrowRight, ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComplaintType } from '@/types/constants'

const COMPLAINT_OPTIONS: { type: ComplaintType; label: string; desc: string; icon: React.ComponentType<{className?: string}> }[] = [
  { type: 'deepfake_image', label: 'Deepfake Image', desc: 'AI-generated or manipulated photo', icon: Image },
  { type: 'deepfake_video', label: 'Deepfake Video', desc: 'Fabricated or face-swapped video', icon: Video },
  { type: 'voice_clone', label: 'Voice Clone', desc: 'AI-cloned audio/voice impersonation', icon: Mic },
  { type: 'fake_document', label: 'Fake Document', desc: 'Forged or digitally altered document', icon: FileText },
  { type: 'synthetic_identity', label: 'Synthetic Identity', desc: 'AI-generated fake persona/profile', icon: User },
  { type: 'other', label: 'Other', desc: 'Other type of digital fraud', icon: HelpCircle },
]

const STEPS = ['Complaint Type', 'Description', 'Upload File', 'Review & Submit']

interface FormData {
  complaint_type: ComplaintType | ''
  title: string
  description: string
  contact_email: string
  contact_phone: string
  location: string
  file: File | null
}

export default function SubmitPage() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    complaint_type: '', title: '', description: '',
    contact_email: '', contact_phone: '', location: '', file: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<{ caseNumber: string; hash: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleNext = () => setStep(s => Math.min(s + 1, 3))
  const handleBack = () => setStep(s => Math.max(s - 1, 0))

  const handleFileSelect = (file: File) => {
    setFormData(prev => ({ ...prev, file }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // TODO Phase 3: Replace with caseService.createCase() + evidenceService.uploadEvidence()
      await new Promise(res => setTimeout(res, 2000))
      setSubmitted({
        caseNumber: `VRD-2025-${String(Math.floor(Math.random() * 99999)).padStart(6, '0')}`,
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      })
    } catch {
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="card-base p-10">
          <CheckCircle className="w-16 h-16 text-accent-primary mx-auto mb-6" />
          <h1 className="text-h2 font-bold text-text-primary mb-2">Complaint Submitted</h1>
          <p className="text-body text-text-muted mb-8">Your evidence has been securely received and logged.</p>

          <div className="bg-slate-950 rounded-lg p-6 text-left mb-6 space-y-4">
            <div>
              <p className="text-caption text-text-muted uppercase tracking-widest mb-1">Case Number</p>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono-data text-h3 font-bold text-accent-primary">{submitted.caseNumber}</span>
                <button onClick={() => handleCopy(submitted.caseNumber)} className="btn-ghost p-1.5">
                  {copied ? <Check className="w-4 h-4 text-accent-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-caption text-text-muted uppercase tracking-widest mb-1">SHA-256 Hash</p>
              <p className="hash-display text-[11px]">{submitted.hash}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/track/${submitted.caseNumber}`} id="confirmation-track" className="btn-primary">
              Track My Case <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={() => { setSubmitted(null); setStep(0); setFormData({ complaint_type: '', title: '', description: '', contact_email: '', contact_phone: '', location: '', file: null }) }} className="btn-secondary">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-caption font-bold transition-all',
                  i < step ? 'bg-accent-primary border-accent-primary text-slate-900' :
                  i === step ? 'border-accent-primary text-accent-primary bg-accent-subtle' :
                  'border-surface-border text-text-disabled'
                )}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={cn(
                  'text-body-sm hidden sm:block whitespace-nowrap',
                  i === step ? 'text-text-primary font-medium' : 'text-text-muted'
                )}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={cn('flex-1 h-px', i < step ? 'bg-accent-primary' : 'bg-surface-border')} />}
            </div>
          ))}
        </div>
      </div>

      <div className="card-base p-8">
        {/* Step 1: Complaint Type */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-h3 font-bold text-text-primary">What type of AI crime occurred?</h2>
            <div className="grid grid-cols-2 gap-3">
              {COMPLAINT_OPTIONS.map(opt => (
                <button
                  key={opt.type}
                  id={`complaint-type-${opt.type}`}
                  onClick={() => setFormData(prev => ({ ...prev, complaint_type: opt.type }))}
                  className={cn(
                    'flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-all duration-150',
                    formData.complaint_type === opt.type
                      ? 'border-accent-primary bg-accent-subtle'
                      : 'border-surface-border hover:border-slate-500 hover:bg-surface-elevated'
                  )}
                >
                  <opt.icon className={cn('w-5 h-5', formData.complaint_type === opt.type ? 'text-accent-primary' : 'text-text-muted')} />
                  <div>
                    <p className={cn('text-body-sm font-semibold', formData.complaint_type === opt.type ? 'text-accent-primary' : 'text-text-primary')}>{opt.label}</p>
                    <p className="text-caption text-text-muted mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button id="step1-next" onClick={handleNext} disabled={!formData.complaint_type} className="btn-primary">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-h3 font-bold text-text-primary">Describe the incident</h2>
            <div>
              <label htmlFor="submit-title" className="block text-body-sm font-medium text-text-secondary mb-1.5">Title <span className="text-red-400">*</span></label>
              <input id="submit-title" type="text" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="input-base" placeholder="Brief title for your complaint" minLength={5} maxLength={200} required />
            </div>
            <div>
              <label htmlFor="submit-description" className="block text-body-sm font-medium text-text-secondary mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea id="submit-description" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="input-base min-h-[120px] resize-none" placeholder="Describe what happened, when it occurred, and how you discovered it. (50-2000 characters)" minLength={50} maxLength={2000} required rows={5} />
              <p className="text-caption text-text-muted mt-1">{formData.description.length}/2000</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="submit-email" className="block text-body-sm font-medium text-text-secondary mb-1.5">Contact Email (optional)</label>
                <input id="submit-email" type="email" value={formData.contact_email} onChange={e => setFormData(prev => ({ ...prev, contact_email: e.target.value }))} className="input-base" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="submit-phone" className="block text-body-sm font-medium text-text-secondary mb-1.5">Contact Phone (optional)</label>
                <input id="submit-phone" type="tel" value={formData.contact_phone} onChange={e => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))} className="input-base" placeholder="+977-98XXXXXXXX" />
              </div>
            </div>
            <div>
              <label htmlFor="submit-location" className="block text-body-sm font-medium text-text-secondary mb-1.5">Incident Location (optional)</label>
              <input id="submit-location" type="text" value={formData.location} onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))} className="input-base" placeholder="City, District, or Platform (e.g. Facebook, Kathmandu)" />
            </div>
            <div className="flex justify-between">
              <button onClick={handleBack} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
              <button id="step2-next" onClick={handleNext} disabled={!formData.title || formData.description.length < 50} className="btn-primary">Next <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* Step 3: Upload */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-h3 font-bold text-text-primary">Upload evidence file</h2>
            <div
              id="submit-dropzone"
              onDragOver={e => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 cursor-pointer',
                dragActive ? 'border-accent-primary bg-accent-subtle' :
                formData.file ? 'border-accent-primary/50 bg-accent-subtle/50' :
                'border-surface-border hover:border-slate-500'
              )}
              onClick={() => document.getElementById('submit-file-input')?.click()}
            >
              <input
                id="submit-file-input"
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
              />
              {formData.file ? (
                <div>
                  <CheckCircle className="w-10 h-10 text-accent-primary mx-auto mb-3" />
                  <p className="text-body font-semibold text-text-primary">{formData.file.name}</p>
                  <p className="text-caption text-text-muted mt-1">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button type="button" onClick={e => { e.stopPropagation(); setFormData(prev => ({ ...prev, file: null })) }} className="text-caption text-red-400 hover:text-red-300 mt-2">Remove</button>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-body font-medium text-text-primary">Drop your file here, or click to browse</p>
                  <p className="text-body-sm text-text-muted mt-2">Images, videos, audio, PDFs — max 100MB</p>
                </div>
              )}
            </div>
            <p className="text-caption text-text-muted flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent-primary" />
              Files are encrypted in transit and stored with SHA-256 integrity verification.
            </p>
            <div className="flex justify-between">
              <button onClick={handleBack} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
              <button id="step3-next" onClick={handleNext} disabled={!formData.file} className="btn-primary">Next <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-h3 font-bold text-text-primary">Review & Submit</h2>
            <div className="space-y-3">
              {[
                { label: 'Complaint Type', value: COMPLAINT_OPTIONS.find(o => o.type === formData.complaint_type)?.label },
                { label: 'Title', value: formData.title },
                { label: 'Description', value: formData.description },
                { label: 'File', value: formData.file?.name },
                { label: 'Contact Email', value: formData.contact_email || '—' },
              ].map(row => (
                <div key={row.label} className="flex gap-4 py-3 border-b border-surface-border">
                  <span className="text-body-sm font-medium text-text-muted w-36 shrink-0">{row.label}</span>
                  <span className="text-body-sm text-text-primary break-words">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-caption text-text-muted">
              By submitting, you confirm this evidence is genuine and consent to its forensic analysis.
              All submissions are governed by the Nepal Cyber Bureau Privacy Policy.
            </p>
            <div className="flex justify-between">
              <button onClick={handleBack} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
              <button id="submit-complaint" onClick={handleSubmit} disabled={isSubmitting} className="btn-primary px-6">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Securing submission...</> : 'Submit Complaint'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
