// ============================================================
// CaseListPage — Filterable, paginated case table
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, FolderOpen, X } from 'lucide-react'
import { MOCK_CASES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import type { CaseStatus, ComplaintType, PriorityLevel } from '@/types/constants'

const STATUS_OPTIONS: CaseStatus[] = ['pending', 'in_review', 'analysis_complete', 'report_generated', 'closed', 'referred']
const PRIORITY_OPTIONS: PriorityLevel[] = ['low', 'medium', 'high', 'critical']

const STATUS_BADGE: Record<string, string> = {
  pending: 'text-status-pending border-amber-400/30 bg-amber-400/10',
  in_review: 'text-status-review border-blue-400/30 bg-blue-400/10',
  analysis_complete: 'text-status-complete border-emerald-400/30 bg-emerald-400/10',
  report_generated: 'text-status-referred border-purple-400/30 bg-purple-400/10',
  closed: 'text-status-closed border-slate-400/30 bg-slate-400/10',
  referred: 'text-status-referred border-purple-400/30 bg-purple-400/10',
}

const PRIORITY_BADGE: Record<string, string> = {
  low: 'text-text-muted border-surface-border',
  medium: 'text-status-review border-blue-400/30 bg-blue-400/10',
  high: 'text-status-pending border-amber-400/30 bg-amber-400/10',
  critical: 'text-verdict-fake border-red-400/30 bg-red-400/10',
}

export default function CaseListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const filtered = MOCK_CASES.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.case_number.toLowerCase().includes(q)
    const matchStatus = !statusFilter || c.status === statusFilter
    const matchPriority = !priorityFilter || c.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const hasFilters = search || statusFilter || priorityFilter

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Cases</h1>
        <p className="text-body-sm text-text-muted mt-1">{MOCK_CASES.length} total cases</p>
      </div>

      {/* Filter bar */}
      <div className="card-base p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="caselist-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-10"
            placeholder="Search by case number or title..."
          />
        </div>
        <select
          id="caselist-status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-base w-auto"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select
          id="caselist-priority-filter"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="input-base w-auto"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {hasFilters && (
          <button
            id="caselist-clear-filters"
            onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter('') }}
            className="btn-ghost text-body-sm gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card-base p-16 text-center">
          <FolderOpen className="w-10 h-10 text-text-disabled mx-auto mb-3" />
          <p className="text-h4 text-text-primary font-semibold">No cases found</p>
          <p className="text-body-sm text-text-muted mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3">Case</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Assigned To</th>
                <th className="text-left px-4 py-3 hidden xl:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.id}
                  id={`caselist-row-${c.id}`}
                  className="table-row"
                  onClick={() => navigate(`/dashboard/cases/${c.id}`)}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono-data text-body-sm text-accent-primary block">{c.case_number}</span>
                    <span className="text-caption text-text-muted truncate block max-w-[250px]">{c.title}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-caption text-text-secondary capitalize">{c.complaint_type.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`badge-base border ${PRIORITY_BADGE[c.priority] ?? ''}`}>{c.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-base border ${STATUS_BADGE[c.status] ?? ''}`}>{c.status.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-body-sm text-text-secondary">{c.assigned_to_name ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-caption text-text-muted">{new Date(c.updated_at).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
