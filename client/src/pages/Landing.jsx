import { Link } from 'react-router-dom';

const features = [
  { tag: '01', emoji: '📁', title: 'Project Architecturing', desc: 'Structure work into projects. Assign ownership, set scope, and give every team member clear context on what matters.' },
  { tag: '02', emoji: '🔐', title: 'Role-Based Permissions', desc: 'Admins control the workspace. Members execute. Account approvals keep your team secure.' },
  { tag: '03', emoji: '📊', title: 'Live Progress Tracking', desc: 'Dashboards with task distribution, priority charts, and overdue alerts — all in real time.' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 64px', background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366F1, #818CF8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Task Z</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" style={{ padding: '8px 20px', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}>Sign In</Link>
          <Link to="/signup" style={{ padding: '8px 20px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 64px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EEF2FF', borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
          <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', fontFamily: 'Plus Jakarta Sans' }}>Team Collaboration · Task Management</span>
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 68, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em' }}>
          Create.{' '}<span style={{ color: 'var(--accent)' }}>Assign.</span><br />Track.
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 500, marginBottom: 36 }}>
          Create projects. Assign tasks. Track progress. Task Z gives teams a structured, role-based environment to deliver and keep track of their work.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/signup" style={{ padding: '13px 28px', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 12, fontFamily: 'Plus Jakarta Sans' }}>Get Started Free →</Link>
          <Link to="/login" style={{ padding: '13px 28px', border: '1px solid var(--border)', background: '#fff', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 12 }}>Sign In</Link>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ maxWidth: 1100, margin: '0 auto 60px', padding: '0 64px' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          {[
            { val: 'Admin', sub: 'Full workspace control' },
            { val: 'Member', sub: 'Task execution & tracking' },
            { val: '4 States', sub: 'Todo → Progress → Done → Overdue' },
          ].map((s, i) => (
            <div key={s.val} style={{ padding: '28px 32px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 28, fontWeight: 800, color: 'var(--accent)', marginBottom: 6 }}>{s.val}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {features.map((f) => (
            <div key={f.tag} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 44, height: 44, background: '#EEF2FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.emoji}</div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Plus Jakarta Sans' }}>{f.tag}</p>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 17, color: 'var(--text-primary)', marginBottom: 10, fontWeight: 700 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 64px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #6366F1, #818CF8)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans' }}>Task Z</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Team Task Management Platform</span>
      </div>
    </div>
  );
}
