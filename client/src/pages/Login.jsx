import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '11px 14px', background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'DM Sans', outline: 'none', transition: 'all 0.15s' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{ width: 420, background: 'linear-gradient(160deg, #6366F1 0%, #4338CA 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>Task Z</span>
          </div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Welcome<br />back.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>Sign in to your workspace and continue where you left off.</p>
        </div>
        <div style={{ position: 'relative' }}>
          {['Projects', 'Tasks', 'Teams', 'Analytics'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Sign in</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Enter your credentials to access your account</p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#DC2626' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@company.com" style={inp}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #EEF2FF'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#F9FAFB'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" style={inp}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #EEF2FF'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#F9FAFB'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#A5B4FC' : 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Plus Jakarta Sans', transition: 'background 0.15s' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
