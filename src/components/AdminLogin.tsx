import React, { useEffect, useState } from 'react';
import { OrnateFrame } from './OrnateFrame';
import { LaurelTorchEmblemIcon } from './IconSet';

/** /admin/login — not linked from anywhere on the public site. */
export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Admin Sign In';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    // Already signed in? Go straight to the dashboard.
    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then((r) => {
        if (r.ok) window.location.replace('/admin');
      })
      .catch(() => undefined);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.replace('/admin');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Sign in failed.');
      setPassword('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <OrnateFrame variant="card">
          <form className="admin-login-form" onSubmit={submit} autoComplete="on">
            <LaurelTorchEmblemIcon />
            <h1 className="admin-login-title">ADMIN SIGN IN</h1>
            <p className="admin-login-sub">Zenforianz Presents • Authorised Staff Only</p>

            <label className="admin-login-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              className="reg-detail-input"
              type="email"
              name="email"
              autoComplete="username"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="admin-login-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className="reg-detail-input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="reg-form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="reg-submit-btn admin-login-btn" disabled={busy}>
              <span>{busy ? 'SIGNING IN…' : 'SIGN IN'}</span>
            </button>
          </form>
        </OrnateFrame>
      </div>
    </div>
  );
};

