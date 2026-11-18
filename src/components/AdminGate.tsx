import React, { useEffect, useState } from 'react';
import { AdminPage } from './AdminPage';
import { AdminUsersPanel } from './AdminUsersPanel';
import type { RegisteredParticipant } from './QrPassView';

interface Me {
  email: string;
  role: 'admin' | 'super_admin';
}

interface Props {
  localRegistrations: RegisteredParticipant[];
  onUpdateLocalRegistrations: (list: RegisteredParticipant[]) => void;
}

/** Renders the dashboard only after the server confirms an active admin session. */
export const AdminGate: React.FC<Props> = ({ localRegistrations, onUpdateLocalRegistrations }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [state, setState] = useState<'checking' | 'ok' | 'unconfigured'>('checking');

  useEffect(() => {
    document.title = 'Admin';
    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then(async (r) => {
        if (r.ok) {
          setMe(await r.json());
          setState('ok');
        } else if (r.status === 503) {
          setState('unconfigured');
        } else {
          window.location.replace('/admin/login');
        }
      })
      .catch(() => window.location.replace('/admin/login'));
  }, []);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
    // Wipe cached PII from this browser
    try {
      localStorage.removeItem('slytherin_registrations');
    } catch {
      // ignore
    }
    window.location.replace('/admin/login');
  };

  if (state === 'unconfigured') {
    return (
      <div className="admin-login-page">
        <p className="reg-form-error">Admin authentication is not configured on this server.</p>
      </div>
    );
  }
  if (state !== 'ok' || !me) {
    return <div className="admin-login-page" aria-busy="true" />;
  }

  return (
    <>
      <div className="admin-session-bar">
        <span>
          Signed in as <strong>{me.email}</strong> ({me.role === 'super_admin' ? 'super admin' : 'admin'})
        </span>
        <button type="button" className="admin-mini-btn admin-mini-btn--action" onClick={logout}>
          Sign out
        </button>
      </div>
      <AdminPage
        onBackToHome={() => window.location.assign('/')}
        localRegistrations={localRegistrations}
        onUpdateLocalRegistrations={onUpdateLocalRegistrations}
      />
      {me.role === 'super_admin' && (
        <div className="admin-portal">
          <AdminUsersPanel selfEmail={me.email} />
        </div>
      )}
    </>
  );
};

