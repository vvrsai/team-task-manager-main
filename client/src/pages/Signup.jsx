import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      if (data.message && !data.token) { setPending(true); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: '100%', padding: '11px 14px', background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'DM Sans', outline: 'none', transition: 'all 0.15s' };

  if (pending) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border)', padding: 48, maxWidth: 420, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 64, height: 64, background: '#EEF2FF', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>⏳</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>Request Submitted</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 28 }}>Your account is pending admin approval. You will be able to sign in once an admin reviews and approves your request.</p>
        <Link to="/login" style={{ display: 'inline-block', padding: '11px 28px', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 10, fontFamily: 'Plus Jakarta Sans' }}>Back to Sign In</Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Left */}
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
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>Join the<br />team.</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>Create your account and start collaborating with your team.</p>
        </div>
        <div style={{ position: 'relative', background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '20px 22px' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, margin: 0 }}>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Create Account</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Fill in your details to get started</p>

          {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#DC2626' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required placeholder={f.placeholder} style={inp}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #EEF2FF'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#F9FAFB'; e.target.style.boxShadow = 'none'; }} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ ...inp, cursor: 'pointer', appearance: 'none' }}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#A5B4FC' : 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
