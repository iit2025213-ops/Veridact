// ============================================================
// AdminUsersPage — User management table
// ============================================================
import { useState } from 'react'
import { Users, Edit2, CheckCircle, XCircle } from 'lucide-react'
import type { User } from '@/types'
import type { UserRole } from '@/types/constants'

const MOCK_USERS: User[] = [
  { id: 'usr-001', email: 'admin@veridact.gov.np', full_name: 'System Administrator', role: 'super_admin', is_active: true, organization: 'Nepal Cyber Bureau', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'usr-002', email: 'investigator@veridact.gov.np', full_name: 'Arjun Thapa', role: 'investigator', is_active: true, organization: 'Nepal Cyber Bureau', created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: 'usr-003', email: 'supervisor@veridact.gov.np', full_name: 'Priya Sharma', role: 'supervisor', is_active: true, organization: 'Nepal Cyber Bureau', created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: 'usr-004', email: 'investigator2@veridact.gov.np', full_name: 'Rajan Koirala', role: 'investigator', is_active: true, organization: 'Nepal Cyber Bureau', created_at: '2025-03-01T00:00:00Z', updated_at: '2025-03-01T00:00:00Z' },
]

const ROLE_BADGE: Record<UserRole, string> = {
  super_admin: 'text-verdict-fake border-red-400/30 bg-red-400/10',
  supervisor: 'text-status-pending border-amber-400/30 bg-amber-400/10',
  investigator: 'text-status-review border-blue-400/30 bg-blue-400/10',
  citizen: 'text-text-muted border-surface-border',
  api_partner: 'text-status-referred border-purple-400/30 bg-purple-400/10',
}

export default function AdminUsersPage() {
  const [editingUser, setEditingUser] = useState<User | null>(null)

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">User Management</h1>
          <p className="text-body-sm text-text-muted mt-1">{MOCK_USERS.length} users registered</p>
        </div>
        <button id="admin-users-add" className="btn-primary gap-2 text-body-sm">
          <Users className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Role</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Organization</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Joined</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map(user => (
              <tr key={user.id} className="table-row">
                <td className="px-4 py-3">
                  <p className="text-body-sm font-medium text-text-primary">{user.full_name}</p>
                  <p className="text-caption text-text-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`badge-base border ${ROLE_BADGE[user.role]}`}>{user.role.replace(/_/g, ' ')}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-body-sm text-text-secondary">{user.organization ?? '—'}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-caption text-text-muted">{new Date(user.created_at).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-3">
                  {user.is_active
                    ? <span className="flex items-center gap-1.5 text-caption text-accent-primary"><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                    : <span className="flex items-center gap-1.5 text-caption text-verdict-fake"><XCircle className="w-3.5 h-3.5" /> Inactive</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    id={`admin-users-edit-${user.id}`}
                    onClick={() => setEditingUser(user)}
                    className="btn-ghost p-1.5"
                    aria-label="Edit user"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal placeholder */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
          <div className="card-base p-6 w-full max-w-md shadow-modal" onClick={e => e.stopPropagation()}>
            <h2 className="text-h4 font-bold text-text-primary mb-4">Edit User</h2>
            <p className="text-body-sm text-text-muted mb-4">Editing: {editingUser.full_name}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-body-sm font-medium text-text-secondary mb-1">Role</label>
                <select defaultValue={editingUser.role} className="input-base">
                  {(['investigator', 'supervisor', 'super_admin', 'citizen', 'api_partner'] as UserRole[]).map(r => (
                    <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-body-sm font-medium text-text-secondary">Active</label>
                <input type="checkbox" defaultChecked={editingUser.is_active} className="w-4 h-4 accent-emerald-500" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setEditingUser(null)} className="btn-ghost">Cancel</button>
              <button id="admin-users-save" onClick={() => setEditingUser(null)} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
