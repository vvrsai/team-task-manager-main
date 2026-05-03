import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

const statusBadge = {
  TODO: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'To Do' },
  IN_PROGRESS: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', label: 'In Progress' },
  DONE: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Done' },
};
const priorityStyle = {
  LOW: { color: '#059669', bg: '#ECFDF5', bar: '#6EE7B7' },
  MEDIUM: { color: '#D97706', bg: '#FFFBEB', bar: '#FCD34D' },
  HIGH: { color: '#DC2626', bg: '#FEF2F2', bar: '#FCA5A5' },
};

const card = { background: '#fff', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' };
const inp = { width: '100%', padding: '10px 14px', background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13, fontFamily: 'DM Sans', outline: 'none', transition: 'all 0.15s' };

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProject = () => api.get(`/projects/${id}`).then((r) => setProject(r.data));
  useEffect(() => { fetchProject(); }, [id]);

  const isAdmin = project?.members?.find((m) => m.userId === user?.id)?.role === 'ADMIN';

  const handleCreateTask = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.post(`/projects/${id}/tasks`, { ...taskForm, assigneeId: taskForm.assigneeId || undefined });
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
      setShowTaskForm(false); fetchProject();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create task'); }
    finally { setLoading(false); }
  };
  const handleStatusChange = async (taskId, status) => { await api.put(`/projects/${id}/tasks/${taskId}`, { status }); fetchProject(); };
  const handleDeleteTask = async (taskId) => { await api.delete(`/projects/${id}/tasks/${taskId}`); fetchProject(); };
  const handleAddMember = async (e) => {
    e.preventDefault(); setError('');
    try { await api.post(`/projects/${id}/members`, { email: memberEmail, role: 'MEMBER' }); setMemberEmail(''); setShowMemberForm(false); fetchProject(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to add member'); }
  };
  const handleRemoveMember = async (userId) => { await api.delete(`/projects/${id}/members/${userId}`); fetchProject(); };

  if (!project) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--accent-light)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading project...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const total = project.tasks?.length || 0;
  const done = project.tasks?.filter(t => t.status === 'DONE').length || 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Back to Projects
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', fontFamily: 'Plus Jakarta Sans' }}>{project.name}</h1>
              {project.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{project.description}</p>}
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '12px 20px', textAlign: 'center', minWidth: 100 }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', margin: 0, fontFamily: 'Plus Jakarta Sans', lineHeight: 1 }}>{pct}%</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>{done}/{total} done</p>
            </div>
          </div>
          {/* Progress */}
          <div style={{ marginTop: 14, height: 6, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #6366F1, #818CF8)', borderRadius: 999, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
          {/* Tasks */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>
                Tasks <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>({project.tasks?.length || 0})</span>
              </h2>
              {isAdmin && (
                <button onClick={() => setShowTaskForm(!showTaskForm)} style={{ padding: '8px 16px', background: showTaskForm ? '#F3F4F6' : 'var(--accent)', border: 'none', borderRadius: 10, color: showTaskForm ? 'var(--text-secondary)' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                  {showTaskForm ? 'Cancel' : '+ Add Task'}
                </button>
              )}
            </div>

            {showTaskForm && (
              <div style={{ ...card, padding: '20px', marginBottom: 14 }}>
                <form onSubmit={handleCreateTask}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Task Title</label>
                    <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required placeholder="Task title" style={inp}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #EEF2FF'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#F9FAFB'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Description</label>
                    <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={2} style={{ ...inp, resize: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'Priority', el: <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>{PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}</select> },
                      { label: 'Assignee', el: <select value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })} style={{ ...inp, cursor: 'pointer' }}><option value="">Unassigned</option>{project.members?.map((m) => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}</select> },
                      { label: 'Due Date', el: <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} style={inp} /> },
                    ].map((f) => (
                      <div key={f.label}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{f.label}</label>
                        {f.el}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={loading} style={{ padding: '9px 20px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                      {loading ? 'Creating...' : 'Create Task'}
                    </button>
                    <button type="button" onClick={() => setShowTaskForm(false)} style={{ padding: '9px 20px', background: '#F3F4F6', border: 'none', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {project.tasks?.length === 0 && (
              <div style={{ ...card, padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: 'Plus Jakarta Sans' }}>No tasks yet</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Add a task to get started</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.tasks?.map((task) => {
                const s = statusBadge[task.status] || statusBadge.TODO;
                const p = priorityStyle[task.priority] || priorityStyle.MEDIUM;
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
                return (
                  <div key={task.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: 4, alignSelf: 'stretch', background: p.bar, borderRadius: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', fontFamily: 'Plus Jakarta Sans' }}>{task.title}</p>
                      {task.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.6 }}>{task.description}</p>}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', background: p.bg, color: p.color, borderRadius: 6 }}>{task.priority}</span>
                        {task.assignee && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>→ {task.assignee.name}</span>}
                        {task.dueDate && <span style={{ fontSize: 11, color: isOverdue ? '#DC2626' : 'var(--text-muted)', fontWeight: isOverdue ? 600 : 400 }}>
                          {isOverdue ? '⚠️ ' : ''}DUE {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                        </span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {isAdmin ? (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: s.bg, color: s.color, borderRadius: 20, border: `1px solid ${s.border}` }}>{s.label}</span>
                      ) : (
                        <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} style={{ padding: '5px 10px', border: `1px solid ${s.border}`, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none', borderRadius: 20, fontFamily: 'DM Sans' }}>
                          {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{statusBadge[opt].label}</option>)}
                        </select>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDeleteTask(task.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', cursor: 'pointer', fontSize: 14, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}>×</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Members sidebar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>Members</h2>
              {isAdmin && (
                <button onClick={() => setShowMemberForm(!showMemberForm)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                  {showMemberForm ? 'Cancel' : '+ Add'}
                </button>
              )}
            </div>
            {showMemberForm && (
              <form onSubmit={handleAddMember} style={{ marginBottom: 12 }}>
                <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required placeholder="email@address.com" style={{ ...inp, marginBottom: 8 }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#F9FAFB'; }} />
                <button type="submit" style={{ width: '100%', padding: '9px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Add Member</button>
              </form>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.members?.map((m) => (
                <div key={m.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--accent-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{m.user.name[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans' }}>{m.user.name}</p>
                    <span style={{ fontSize: 11, color: m.role === 'ADMIN' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.role}</span>
                  </div>
                  {isAdmin && m.userId !== user?.id && (
                    <button onClick={() => handleRemoveMember(m.userId)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1, transition: 'color 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
