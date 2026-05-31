// ============================================================
// AnalyticsPage — Charts and analytics (supervisor/admin only)
// ============================================================
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const VERDICT_DATA = [
  { name: 'Authentic', value: 312, color: '#34D399' },
  { name: 'Suspicious', value: 187, color: '#FB923C' },
  { name: 'Likely Fake', value: 298, color: '#F87171' },
  { name: 'Inconclusive', value: 155, color: '#94A3B8' },
]

const DAILY_DATA = [
  { date: 'May 20', cases: 12 },
  { date: 'May 21', cases: 19 },
  { date: 'May 22', cases: 8 },
  { date: 'May 23', cases: 24 },
  { date: 'May 24', cases: 17 },
  { date: 'May 25', cases: 31 },
  { date: 'May 26', cases: 22 },
]

const WORKLOAD_DATA = [
  { name: 'Arjun Thapa', cases: 14 },
  { name: 'Priya Sharma', cases: 9 },
  { name: 'Rajan Koirala', cases: 11 },
  { name: 'Sunita Rai', cases: 6 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-lg p-3 shadow-card">
        <p className="text-body-sm font-medium text-text-primary">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-caption text-text-muted">{entry.name}: <span className="text-accent-primary font-mono-data">{entry.value}</span></p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Analytics</h1>
        <p className="text-body-sm text-text-muted mt-1">Department-wide forensic intelligence overview</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: '952', icon: BarChart3, trend: '+12% this month' },
          { label: 'Detection Rate', value: '63.2%', icon: TrendingUp, trend: 'Likely fake + suspicious' },
          { label: 'Avg Resolution', value: '4.2 days', icon: TrendingUp, trend: 'From submission to report' },
          { label: 'High Risk Alerts', value: '28', icon: AlertTriangle, trend: 'Confidence > 80%' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-caption text-text-muted">{stat.label}</p>
              <stat.icon className="w-4 h-4 text-accent-primary" />
            </div>
            <p className="text-h2 font-bold font-mono-data text-accent-primary">{stat.value}</p>
            <p className="text-caption text-text-muted mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily submissions */}
        <div className="card-base p-6">
          <h2 className="text-h4 font-semibold text-text-primary mb-4">Daily Submissions (Last 7 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cases" name="Cases" fill="#34D399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Verdict distribution */}
        <div className="card-base p-6">
          <h2 className="text-h4 font-semibold text-text-primary mb-4">Verdict Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={VERDICT_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {VERDICT_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investigator workload */}
      <div className="card-base p-6">
        <h2 className="text-h4 font-semibold text-text-primary mb-4">Investigator Workload</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={WORKLOAD_DATA} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#CBD5E1', fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="cases" name="Open Cases" fill="#60A5FA" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
