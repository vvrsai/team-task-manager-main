import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const projectIcons = ['🎨', '🛒', '💻', '💰', '📚', '🚚', '📱', '🌐'];
const projectColors = [
  { bg: '#EEF2FF', icon: '#6366F1' },
  { bg: '#FEF2F2', icon: '#EF4444' },
  { bg: '#ECFDF5', icon: '#059669' },
  { bg: '#FFFBEB', icon: '#D97706' },
  { bg: '#EFF6FF', icon: '#2563EB' },
  { bg: '#FDF4FF', icon: '#9333EA' },
];

function getColor(idx) { return projectColors[idx % projectColors.length]; }
function getIcon(idx) { return projectIcons[idx % projectIcons.length]; }

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchProjects = () => api.get('/projects').then((r) => setProjects(r.data));
  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/projects', form); setForm({ name: '', description: '' }); setShowForm(false); fetchProjects(); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '10px 14px', background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13, fontFamily: 'DM Sans', outline: 'none', transition: 'border-color 0.15s' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>Team</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '2px 0 0' }}>{projects.length} projects</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <input placeholder="Search anything" style={{ padding: '9px 14px 9px 36px', background: '#fff', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-primary)', outline: 'none', width: 200 }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div style={{ width: 38, height: 38, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
          </div>
        </div>

        {/* Create Form */}
        {user?.role === 'ADMIN' && (
          <div style={{ marginBottom: 24 }}>
            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={{ display: 'none' }} />
            ) : (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', marginBottom: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>New Project</h3>
                  <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
                </div>
                <form onSubmit={handleCreate}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Project Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Website Redesign" style={inp}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#F9FAFB'; }} />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inp, resize: 'none' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#F9FAFB'; }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={loading} style={{ padding: '9px 22px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                      {loading ? 'Creating...' : 'Create Project'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 22px', background: '#F3F4F6', border: 'none', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '80px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', fontFamily: 'Plus Jakarta Sans' }}>No projects yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Create your first project to get started</p>
            {user?.role === 'ADMIN' && (
              <button onClick={() => setShowForm(true)} style={{ padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>+ Add Project</button>
            )}
          </div>
        )}

        {/* Project Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
          {projects.map((p, idx) => {
            const clr = getColor(idx);
            const icon = getIcon(idx);
            const total = p.tasks?.length || 0;
            const done = p.tasks?.filter(t => t.status === 'DONE').length || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
                style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '20px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed var(--border)' }}>
                  <div style={{ width: 38, height: 38, background: clr.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', fontFamily: 'Plus Jakarta Sans', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h3>
                    {p.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>}
                  </div>
                </div>
                {/* Members + Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ display: 'flex' }}>
                    {p.members?.slice(0, 4).map((m, mi) => (
                      <div key={m.id} title={m.user.name} style={{ width: 26, height: 26, background: projectColors[mi % projectColors.length].bg, border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: projectColors[mi % projectColors.length].icon, marginLeft: mi > 0 ? -8 : 0, flexShrink: 0 }}>
                        {m.user.name[0].toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Aug 16 2025</span>
                </div>
                {/* Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Project Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #6366F1, #818CF8)', borderRadius: 999, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
