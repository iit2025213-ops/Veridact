// ============================================================
// LandingPage — Public hero + features landing page
// ============================================================
import { Link } from 'react-router-dom'
import { Shield, ArrowRight, Eye, FileSearch, Lock, CheckCircle, Zap, Users } from 'lucide-react'

const STATS = [
  { label: 'Cases Analyzed', value: '2,847' },
  { label: 'Deepfakes Detected', value: '94.2%', subtitle: 'accuracy' },
  { label: 'Reports Generated', value: '1,203' },
  { label: 'Institutions Served', value: '37' },
]

const FEATURES = [
  {
    icon: Eye,
    title: 'Deepfake Detection',
    description: 'AI-powered analysis detects manipulated images and videos with 94%+ accuracy using facial artifact analysis.',
  },
  {
    icon: FileSearch,
    title: 'Document Forensics',
    description: 'Identify forged documents, altered certificates, and synthetic identity materials submitted as evidence.',
  },
  {
    icon: Zap,
    title: 'Voice Clone Analysis',
    description: 'Spectral analysis detects AI-cloned audio used in scams, extortion, and impersonation attacks.',
  },
  {
    icon: Lock,
    title: 'Chain of Custody',
    description: 'Every access, analysis, and action is cryptographically logged with SHA-256 hashes for court admissibility.',
  },
  {
    icon: CheckCircle,
    title: 'Forensic Reports',
    description: 'Generate court-ready PDF reports with AI verdict, confidence score, analysis timeline, and custody log.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Investigators, supervisors, and admins each see only what they need — nothing more, nothing less.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Evidence', desc: 'Citizens submit suspicious media through our secure wizard. No login required.' },
  { step: '02', title: 'AI Analysis', desc: 'Our forensic AI models analyze for deepfake artifacts, inconsistencies, and manipulation.' },
  { step: '03', title: 'Verdict Issued', desc: 'Investigators review the AI verdict and confidence score, then take action.' },
  { step: '04', title: 'Report & Refer', desc: 'Generate a tamper-proof forensic report and refer the case to the appropriate authority.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forensic-grid bg-surface-base py-24 px-6">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-accent-primary/5 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-primary/30 bg-accent-subtle text-caption text-accent-primary font-semibold uppercase tracking-widest mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            AI Forensic Evidence Platform
          </div>

          {/* Headline */}
          <h1 className="text-display font-bold text-text-primary mb-6 leading-tight">
            See Through the Fake.{' '}
            <span className="text-gradient-emerald">Secure the Truth.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            VERIDACT is Nepal's first AI-powered platform for detecting deepfakes, voice clones,
            and forged documents. Built for the Nepal Cyber Bureau to combat digital fraud.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit"
              id="hero-report-crime"
              className="btn-primary px-6 py-3 text-body-sm gap-2"
            >
              Report AI Crime
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/track"
              id="hero-track-case"
              className="btn-secondary px-6 py-3 text-body-sm"
            >
              Track Your Case
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-caption text-text-disabled flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-accent-primary" />
            End-to-end encrypted · SHA-256 chain of custody · Court-ready reports
          </p>
        </div>
      </section>

      {/* ── Stats Banner ─────────────────────────────────── */}
      <section className="border-y border-surface-border bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-h2 font-bold text-accent-primary font-mono-data">{stat.value}</div>
              <div className="text-caption text-text-muted mt-1">{stat.label}</div>
              {stat.subtitle && <div className="text-caption text-text-disabled">{stat.subtitle}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-surface-base">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-text-primary mb-3">Forensic Capabilities</h2>
            <p className="text-body text-text-muted">Built for investigators. Trusted by institutions.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="card-base card-hover p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-subtle border border-accent-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-accent-primary" />
                </div>
                <h3 className="text-h4 text-text-primary mb-2">{feature.title}</h3>
                <p className="text-body-sm text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-950/40 border-y border-surface-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-text-primary mb-3">How It Works</h2>
            <p className="text-body text-text-muted">From submission to forensic verdict in minutes.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-px bg-surface-border -translate-y-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-accent-subtle border-2 border-accent-primary/40 flex items-center justify-center mb-4">
                    <span className="font-mono-data text-caption font-bold text-accent-primary">{step.step}</span>
                  </div>
                  <h3 className="text-body font-semibold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-body-sm text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-surface-base">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card-base card-accent p-10">
            <Shield className="w-10 h-10 text-accent-primary mx-auto mb-4" />
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              Been a victim of digital fraud?
            </h2>
            <p className="text-body text-text-muted mb-8">
              Submit your evidence securely. No login required. We'll analyze it and provide
              a forensic verdict with full chain of custody.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit" id="cta-report" className="btn-primary px-8 py-3">
                Submit Evidence Now
              </Link>
              <Link to="/login" id="cta-login" className="btn-ghost px-8 py-3">
                Investigator Login →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
