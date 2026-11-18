import React, { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '../utils/adminApi';

interface AdminRow {
  user_id: string;
  email: string;
  role: 'admin' | 'super_admin';
  active: boolean;
  created_at?: string;
  created_by_email?: string | null;
}

/** Super-admin only: add / remove admins. All enforcement is server-side. */
export const AdminUsersPanel: React.FC<{ selfEmail: string }> = ({ selfEmail }) => {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch('/api/admin/admins');
    if (res.ok) setAdmins((await res.json()).admins ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await adminFetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg({ ok: true, text: `✓ ${email} added as ${role.replace('_', ' ')}.` });
      setEmail('');
      setPassword('');
      setRole('admin');
      load();
    } else {
      setMsg({ ok: false, text: data.error || 'Could not add admin.' });
    }
    setBusy(false);
  };

  const remove = async (row: AdminRow) => {
    if (!window.confirm(`Remove admin ${row.email}? They will lose access immediately.`)) return;
    const res = await adminFetch(`/api/admin/admins/${row.user_id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    setMsg(res.ok ? { ok: true, text: `✓ ${row.email} removed.` } : { ok: false, text: data.error || 'Failed.' });
    load();
  };

  return (
    <div className="admin-users-panel">
      <h2 className="admin-scanner-box__title">Admin Accounts</h2>
      <p className="admin-scanner-box__desc">
        Only super admins can add or remove admins. Passwords: 12+ characters, upper-case, lower-case and a number.
      </p>

      <form className="admin-users-form" onSubmit={add}>
        <input
          className="reg-detail-input"
          type="email"
          placeholder="New admin email"
          required
          maxLength={254}
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="reg-detail-input"
          type="password"
          placeholder="Temporary password"
          required
          minLength={12}
          maxLength={72}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="reg-detail-input"
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'super_admin')}
        >
          <option value="admin">Admin (scanners &amp; data)</option>
          <option value="super_admin">Super admin (can manage admins)</option>
        </select>
        <button type="submit" className="admin-scan-submit-btn" disabled={busy}>
          {busy ? 'Adding…' : '+ Add Admin'}
        </button>
      </form>

      {msg && <p className={msg.ok ? 'admin-gsheet-status' : 'reg-form-error'}>{msg.text}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Added by</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.user_id}>
                <td>{a.email}</td>
                <td>{a.role === 'super_admin' ? 'Super admin' : 'Admin'}</td>
                <td>{a.created_by_email || '—'}</td>
                <td>
                  {a.email !== selfEmail && (
                    <button type="button" className="admin-mini-btn" onClick={() => remove(a)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

